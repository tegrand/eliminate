import Razorpay from "razorpay";
import crypto from "crypto";
import prisma from "../../config/prisma.js";

const getRazorpay = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID?.trim(),
  key_secret: process.env.RAZORPAY_KEY_SECRET?.trim(),
});

export const createOrder = async (hiringRequestId, userId) => {
  const hiringRequest = await prisma.hiringRequest.findUnique({
    where: { id: hiringRequestId },
    include: { client: true }
  });

  if (!hiringRequest) throw new Error("Hiring request not found");
  if (hiringRequest.client.userId !== userId) throw new Error("Unauthorized");
  if (!hiringRequest.proposedRate) throw new Error("Proposed rate is not set");

  // Check existing transactions to determine if this is advance or final payment
  const existingTransactions = await prisma.paymentTransaction.findMany({
    where: { hiringRequestId, status: "SUCCESS" }
  });

  const isAdvancePayment = existingTransactions.length === 0;
  
  // 30% for advance, 70% for final payment
  const multiplier = isAdvancePayment ? 0.3 : 0.7;
  const amountToPay = parseFloat(hiringRequest.proposedRate) * multiplier;
  const amountInPaise = Math.round(amountToPay * 100);

  const options = {
    amount: amountInPaise,
    currency: "INR",
    receipt: `rcpt_${hiringRequest.id.substring(0, 30)}`
  };

  const order = await getRazorpay().orders.create(options);

  // Store transaction in DB
  await prisma.paymentTransaction.create({
    data: {
      orderId: order.id,
      amount: amountToPay,
      hiringRequestId: hiringRequest.id,
      status: "PENDING"
    }
  });

  return order;
};

export const verifyPayment = async (orderId, paymentId, signature) => {
  const body = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET?.trim())
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === signature;
  
  if (!isAuthentic) {
    throw new Error("Invalid signature");
  }

  // Find transaction
  const transaction = await prisma.paymentTransaction.findFirst({
    where: { orderId }
  });

  if (!transaction) throw new Error("Transaction not found");

  // Update Transaction
  await prisma.paymentTransaction.update({
    where: { id: transaction.id },
    data: {
      paymentId,
      status: "SUCCESS"
    }
  });

  // Check how many successful transactions this hiring request has NOW (including the one we just marked)
  const successfulTxCount = await prisma.paymentTransaction.count({
    where: { hiringRequestId: transaction.hiringRequestId, status: "SUCCESS" }
  });

  if (successfulTxCount === 1) {
    // First payment (Advance) completed -> ACTIVE
    const updatedReq = await prisma.hiringRequest.update({
      where: { id: transaction.hiringRequestId },
      data: { status: "ACTIVE" }
    });

    // Create Assignment
    const newAssignment = await prisma.assignment.create({
      data: {
        assignmentCode: `ASN-${Date.now().toString().slice(-6)}`,
        hiringRequestId: updatedReq.id,
        clientId: updatedReq.clientId,
        agencyId: updatedReq.targetAgencyId || undefined,
        title: updatedReq.title,
        description: updatedReq.description,
        agreedRate: updatedReq.proposedRate,
        startDate: updatedReq.startDate,
        endDate: updatedReq.endDate,
        status: "ACTIVE"
      }
    });

    // Assign worker
    if (updatedReq.targetWorkerId) {
      await prisma.assignmentWorker.create({
        data: {
          assignmentId: newAssignment.id,
          workerId: updatedReq.targetWorkerId,
          status: "ACTIVE"
        }
      });

      // Increment assigned count on JobRequirement
      if (updatedReq.jobRequirementId) {
        await prisma.jobRequirement.update({
          where: { id: updatedReq.jobRequirementId },
          data: { assignedCount: { increment: 1 } }
        });
      }
    }
  } else {
    const assignments = await prisma.assignment.findMany({
      where: { hiringRequestId: transaction.hiringRequestId },
      include: { assignedWorkers: true }
    });

    const feeSetting = await prisma.systemSetting.findUnique({ where: { key: "platform_fee_percentage" } });
    const platformFeePercentage = feeSetting && !isNaN(parseFloat(feeSetting.value)) ? parseFloat(feeSetting.value) : 0;

    for (const assignment of assignments) {
      await prisma.assignment.update({
        where: { id: assignment.id },
        data: { status: "COMPLETED" }
      });

      const workerCount = assignment.assignedWorkers.length;
      if (workerCount > 0) {
        const agreedRate = parseFloat(assignment.agreedRate || 0);
        const totalWorkerShare = agreedRate / (1 + (platformFeePercentage / 100));
        const amountPerWorker = totalWorkerShare / workerCount;
        const workerPayments = assignment.assignedWorkers.map(aw => ({
          workerId: aw.workerId,
          amount: amountPerWorker,
          periodStart: assignment.startDate || new Date(),
          periodEnd: assignment.endDate || new Date(),
          status: "PENDING",
          assignmentId: assignment.id,
          notes: `Payout for assignment ${assignment.assignmentCode}`
        }));

        await prisma.workerPayment.createMany({
          data: workerPayments
        });
      }
    }
  }

  return { success: true };
};

export const processWebhook = async (rawBody, signature) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "fallback_secret_123";

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  if (expectedSignature !== signature) {
    throw new Error("Invalid Webhook Signature");
  }

  const payload = JSON.parse(rawBody);
  
  if (payload.event === "payment.captured" || payload.event === "order.paid") {
    const paymentEntity = payload.payload.payment.entity;
    const orderId = paymentEntity.order_id;
    const paymentId = paymentEntity.id;

    const transaction = await prisma.paymentTransaction.findFirst({
      where: { orderId }
    });

    if (transaction && transaction.status !== "SUCCESS") {
      await prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          paymentId,
          status: "SUCCESS"
        }
      });

      // Check how many successful transactions this hiring request has NOW
      const successfulTxCount = await prisma.paymentTransaction.count({
        where: { hiringRequestId: transaction.hiringRequestId, status: "SUCCESS" }
      });

      if (successfulTxCount === 1) {
        // First payment (Advance)
        const updatedReq = await prisma.hiringRequest.update({
          where: { id: transaction.hiringRequestId },
          data: { status: "ACTIVE" }
        });

        // Create Assignment
        const newAssignment = await prisma.assignment.create({
          data: {
            assignmentCode: `ASN-${Date.now().toString().slice(-6)}`,
            hiringRequestId: updatedReq.id,
            clientId: updatedReq.clientId,
            agencyId: updatedReq.targetAgencyId || undefined,
            title: updatedReq.title,
            description: updatedReq.description,
            agreedRate: updatedReq.proposedRate,
            startDate: updatedReq.startDate,
            endDate: updatedReq.endDate,
            status: "ACTIVE"
          }
        });

        if (updatedReq.targetWorkerId) {
          await prisma.assignmentWorker.create({
            data: {
              assignmentId: newAssignment.id,
              workerId: updatedReq.targetWorkerId,
              status: "ACTIVE"
            }
          });

          // Increment assigned count on JobRequirement
          if (updatedReq.jobRequirementId) {
            await prisma.jobRequirement.update({
              where: { id: updatedReq.jobRequirementId },
              data: { assignedCount: { increment: 1 } }
            });
          }
        }
      } else {
        // Final payment
        const assignments = await prisma.assignment.findMany({
          where: { hiringRequestId: transaction.hiringRequestId },
          include: { assignedWorkers: true }
        });

        const feeSetting = await prisma.systemSetting.findUnique({ where: { key: "platform_fee_percentage" } });
        const platformFeePercentage = feeSetting && !isNaN(parseFloat(feeSetting.value)) ? parseFloat(feeSetting.value) : 0;

        for (const assignment of assignments) {
          await prisma.assignment.update({
            where: { id: assignment.id },
            data: { status: "COMPLETED" }
          });

          const workerCount = assignment.assignedWorkers.length;
          if (workerCount > 0) {
            const agreedRate = parseFloat(assignment.agreedRate || 0);
            const totalWorkerShare = agreedRate / (1 + (platformFeePercentage / 100));
            const amountPerWorker = totalWorkerShare / workerCount;
            const workerPayments = assignment.assignedWorkers.map(aw => ({
              workerId: aw.workerId,
              amount: amountPerWorker,
              periodStart: assignment.startDate || new Date(),
              periodEnd: assignment.endDate || new Date(),
              status: "PENDING",
              assignmentId: assignment.id,
              notes: `Payout for assignment ${assignment.assignmentCode}`
            }));

            await prisma.workerPayment.createMany({
              data: workerPayments
            });
          }
        }
      }
    }
  }

  return true;
};

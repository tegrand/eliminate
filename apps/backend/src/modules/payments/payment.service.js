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

  const amountInPaise = Math.round(parseFloat(hiringRequest.proposedRate) * 100);

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
      amount: hiringRequest.proposedRate,
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

  // Update HiringRequest to ACTIVE
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
      }
    }
  }

  return true;
};

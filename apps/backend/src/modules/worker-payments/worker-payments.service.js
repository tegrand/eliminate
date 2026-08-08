import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

const getWorkerByUserId = async (userId) => {
  const worker = await prisma.worker.findUnique({
    where: { userId }
  });
  if (!worker) throw new AppError("Worker profile not found", 404);
  return worker;
};

export const getMyPayments = async (userId, { status }) => {
  const worker = await getWorkerByUserId(userId);
  
  const where = { workerId: worker.id };
  if (status) {
    where.status = status;
  }

  return prisma.workerPayment.findMany({
    where,
    include: { assignment: true },
    orderBy: { periodEnd: "desc" }
  });
};

export const getPaymentSummary = async (userId) => {
  const worker = await getWorkerByUserId(userId);

  const payments = await prisma.workerPayment.findMany({
    where: { workerId: worker.id }
  });

  const summary = {
    totalEarned: 0,
    totalPending: 0,
    lastPaymentAmount: 0,
    lastPaymentDate: null
  };

  let lastCompleted = null;

  payments.forEach(p => {
    if (p.status === "COMPLETED") {
      summary.totalEarned += p.amount;
      if (!lastCompleted || new Date(p.paymentDate) > new Date(lastCompleted.paymentDate)) {
        lastCompleted = p;
      }
    } else if (p.status === "PENDING" || p.status === "PROCESSING") {
      summary.totalPending += p.amount;
    }
  });

  if (lastCompleted) {
    summary.lastPaymentAmount = lastCompleted.amount;
    summary.lastPaymentDate = lastCompleted.paymentDate;
  }

  return summary;
};

export const getPaymentById = async (userId, paymentId) => {
  const worker = await getWorkerByUserId(userId);

  const payment = await prisma.workerPayment.findFirst({
    where: { id: paymentId, workerId: worker.id },
    include: {
      assignment: true,
      worker: {
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true, phone: true }
          }
        }
      }
    }
  });

  if (!payment) throw new AppError("Payment not found", 404);

  return payment;
};

// --- Admin Methods ---

export const getAllWorkerPayouts = async ({ status, search, page = 1, limit = 10 }) => {
  const where = {};
  if (status && status !== "ALL") {
    where.status = status;
  }
  
  if (search) {
    where.worker = {
      user: {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } }
        ]
      }
    };
  }

  const skip = (page - 1) * limit;

  const [payouts, total] = await prisma.$transaction([
    prisma.workerPayment.findMany({
      where,
      include: {
        assignment: true,
        worker: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true, phone: true }
            }
          }
        }
      },
      orderBy: { periodEnd: "desc" },
      skip,
      take: Number(limit)
    }),
    prisma.workerPayment.count({ where })
  ]);

  return { payouts, total, page, limit };
};

export const markPayoutAsPaid = async (paymentId, { referenceNo, paymentMethod, notes }) => {
  const payment = await prisma.workerPayment.findUnique({
    where: { id: paymentId }
  });

  if (!payment) {
    throw new AppError("Payout not found", 404);
  }

  if (payment.status === "COMPLETED") {
    throw new AppError("Payout is already marked as completed", 400);
  }

  return prisma.workerPayment.update({
    where: { id: paymentId },
    data: {
      status: "COMPLETED",
      paymentDate: new Date(),
      referenceNo,
      paymentMethod: paymentMethod || "BANK_TRANSFER",
      notes
    },
    include: {
      worker: {
        include: {
          user: true
        }
      }
    }
  });
};

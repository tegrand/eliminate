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

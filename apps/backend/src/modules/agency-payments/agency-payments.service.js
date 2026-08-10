import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

const getAgencyByUserId = async (userId) => {
  const Agency = await prisma.Agency.findUnique({
    where: { userId }
  });
  if (!Agency) throw new AppError("Agency profile not found", 404);
  return Agency;
};

export const getMyPayments = async (userId, { status }) => {
  const Agency = await getAgencyByUserId(userId);
  
  const where = { agencyId: Agency.id };
  if (status) {
    where.status = status;
  }

  return prisma.agencyPayment.findMany({
    where,
    include: { assignment: true },
    orderBy: { periodEnd: "desc" }
  });
};

export const getPaymentSummary = async (userId) => {
  const Agency = await getAgencyByUserId(userId);

  const payments = await prisma.agencyPayment.findMany({
    where: { agencyId: Agency.id }
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
  const Agency = await getAgencyByUserId(userId);

  const payment = await prisma.agencyPayment.findFirst({
    where: { id: paymentId, agencyId: Agency.id },
    include: {
      assignment: true,
      agency: {
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

export const getAllAgencyPayouts = async ({ status, search, page = 1, limit = 10 }) => {
  const where = {};
  if (status && status !== "ALL") {
    where.status = status;
  }
  
  if (search) {
    where.agency = {
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
    prisma.agencyPayment.findMany({
      where,
      include: {
        assignment: true,
        agency: {
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
    prisma.agencyPayment.count({ where })
  ]);

  return { payouts, total, page, limit };
};

export const markPayoutAsPaid = async (paymentId, { referenceNo, paymentMethod, notes }) => {
  const payment = await prisma.agencyPayment.findUnique({
    where: { id: paymentId }
  });

  if (!payment) {
    throw new AppError("Payout not found", 404);
  }

  if (payment.status === "COMPLETED") {
    throw new AppError("Payout is already marked as completed", 400);
  }

  return prisma.agencyPayment.update({
    where: { id: paymentId },
    data: {
      status: "COMPLETED",
      paymentDate: new Date(),
      referenceNo,
      paymentMethod: paymentMethod || "BANK_TRANSFER",
      notes
    },
    include: {
      agency: {
        include: {
          user: true
        }
      }
    }
  });
};

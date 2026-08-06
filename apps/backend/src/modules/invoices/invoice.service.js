import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

export const listInvoices = async (filters, user) => {
  const where = {};
  if (user.profileType === "CLIENT") {
    const client = await prisma.client.findUnique({ where: { userId: user.id } });
    if (client) where.clientId = client.id;
  }

  const { page = 1, limit = 10 } = filters;
  const skip = (Number(page) - 1) * Number(limit);

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      include: {
        client: { include: { user: true } },
        assignment: true,
        items: {
          include: {
            worker: { include: { user: true } }
          }
        }
      },
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    }),
    prisma.invoice.count({ where })
  ]);

  return {
    invoices,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    }
  };
};

export const getInvoiceById = async (id, user) => {
  const where = { id };
  if (user.profileType === "CLIENT") {
    const client = await prisma.client.findUnique({ where: { userId: user.id } });
    if (client) where.clientId = client.id;
  }

  const invoice = await prisma.invoice.findFirst({
    where,
    include: {
      client: { include: { user: true } },
      assignment: true,
      items: {
        include: {
          worker: { include: { user: true } }
        }
      }
    }
  });

  if (!invoice) throw new AppError("Invoice not found", 404);
  return invoice;
};

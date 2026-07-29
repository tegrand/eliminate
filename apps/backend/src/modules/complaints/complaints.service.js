import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

export const createComplaint = async (clientId, data) => {
  return await prisma.complaint.create({
    data: {
      complainantId: clientId,
      targetWorkerId: data.targetWorkerId || undefined,
      targetAgencyId: data.targetAgencyId || undefined,
      assignmentId: data.assignmentId || undefined,
      title: data.title,
      description: data.description
    }
  });
};

export const getComplaints = async (clientId, filters) => {
  const where = { complainantId: clientId };
  if (filters.status) where.status = filters.status;

  return await prisma.complaint.findMany({
    where,
    include: {
      targetWorker: { include: { user: { select: { firstName: true, lastName: true } } } },
      targetAgency: { include: { user: { select: { firstName: true, lastName: true } } } },
      assignment: { select: { title: true, assignmentCode: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const updateComplaintStatus = async (id, status) => {
  return await prisma.complaint.update({
    where: { id },
    data: { status }
  });
};

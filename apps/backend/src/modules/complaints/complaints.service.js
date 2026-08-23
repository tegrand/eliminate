import prisma from "../../config/prisma.js";

export const createComplaint = async (ids, data) => {
  return await prisma.complaint.create({
    data: {
      complainantClientId: ids.clientId || undefined,
      complainantWorkerId: ids.workerId || undefined,
      complainantAgencyId: ids.agencyId || undefined,
      targetWorkerId: data.targetWorkerId || undefined,
      targetAgencyId: data.targetAgencyId || undefined,
      targetClientId: data.targetClientId || undefined,
      assignmentId: data.assignmentId || undefined,
      title: data.title,
      description: data.description
    }
  });
};

export const getComplaints = async (ids, filters) => {
  const OR = [];
  if (ids.clientId) OR.push({ complainantClientId: ids.clientId });
  if (ids.workerId) OR.push({ complainantWorkerId: ids.workerId });
  if (ids.agencyId) OR.push({ complainantAgencyId: ids.agencyId });

  const where = OR.length > 0 ? { OR } : {};
  
  if (filters.status) where.status = filters.status;

  return await prisma.complaint.findMany({
    where,
    include: {
      targetWorker: { include: { user: { select: { firstName: true, lastName: true } } } },
      targetAgency: { include: { user: { select: { firstName: true, lastName: true } } } },
      targetClient: { include: { user: { select: { firstName: true, lastName: true } } } },
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

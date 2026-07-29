import prisma from "../../config/prisma.js";
import AppError from "../../shared/utils/app-error.js";

export const createHiringRequest = async (clientId, data) => {
  return await prisma.hiringRequest.create({
    data: {
      ...data,
      clientId,
    },
    include: {
      agency: true,
      worker: true,
    }
  });
};

export const listHiringRequests = async (filters, user) => {
  const where = {};

  // Role-based filtering
  if (user.profileType === "CLIENT") {
    const client = await prisma.client.findUnique({ where: { userId: user.id } });
    if (client) where.clientId = client.id;
  } else if (user.profileType === "AGENCY") {
    const agency = await prisma.agency.findUnique({ where: { userId: user.id } });
    if (agency) where.targetAgencyId = agency.id;
  } else if (user.profileType === "WORKER") {
    const worker = await prisma.worker.findUnique({ where: { userId: user.id } });
    if (worker) where.targetWorkerId = worker.id;
  }

  if (filters.status) where.status = filters.status;

  const items = await prisma.hiringRequest.findMany({
    where,
    include: {
      client: {
        include: { user: { select: { firstName: true, lastName: true, email: true, phone: true } } }
      },
      agency: {
        include: { user: { select: { firstName: true, lastName: true } } }
      },
      worker: {
        include: { user: { select: { firstName: true, lastName: true } } }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return items;
};

export const getHiringRequest = async (id, user) => {
  const request = await prisma.hiringRequest.findUnique({
    where: { id },
    include: { client: true, agency: true, worker: true }
  });

  if (!request) throw new AppError("Hiring Request not found", 404);

  return request;
};

export const updateHiringRequestStatus = async (id, status, user) => {
  const request = await prisma.hiringRequest.findUnique({ where: { id } });
  if (!request) throw new AppError("Hiring Request not found", 404);

  // If accepting, we need to create an Assignment
  if (status === "ACCEPTED") {
    // Prevent double acceptance
    if (request.status === "ACCEPTED") throw new AppError("Request is already accepted", 400);

    const updatedRequest = await prisma.$transaction(async (tx) => {
      const req = await tx.hiringRequest.update({
        where: { id },
        data: { status }
      });

      // Create Assignment
      await tx.assignment.create({
        data: {
          assignmentCode: `ASN-${Date.now().toString().slice(-6)}`,
          hiringRequestId: req.id,
          clientId: req.clientId,
          agencyId: req.targetAgencyId || undefined,
          title: req.title,
          description: req.description,
          agreedRate: req.proposedRate,
          startDate: req.startDate,
          endDate: req.endDate,
          status: "ACTIVE"
        }
      });

      // If independent worker, auto-assign them to this assignment?
      // For now, the assignment is created. We will handle the worker linking in Assignment module.

      return req;
    });

    return updatedRequest;
  } else {
    return await prisma.hiringRequest.update({
      where: { id },
      data: { status }
    });
  }
};

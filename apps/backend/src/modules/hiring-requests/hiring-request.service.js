import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

export const createHiringRequest = async (clientId, data) => {
  return await prisma.$transaction(async (tx) => {
    let jobRequirementId = data.jobRequirementId;

    if (!jobRequirementId) {
      const newJob = await tx.jobRequirement.create({
        data: {
          requirementCode: `REQ-${Date.now().toString().slice(-6)}`,
          clientId,
          title: data.title || "Custom Hiring Request",
          description: data.description || data.notes || "",
          requiredWorkers: 1,
          startDate: data.startDate,
          endDate: data.endDate,
          salaryAmount: data.proposedRate,
          status: "OPEN",
          notes: data.notes
        }
      });
      jobRequirementId = newJob.id;
    }

    return await tx.hiringRequest.create({
      data: {
        ...data,
        jobRequirementId,
        clientId,
      },
      include: {
        agency: true,
        worker: true,
      }
    });
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
  const request = await prisma.hiringRequest.findUnique({ 
    where: { id },
    include: { client: true }
  });
  if (!request) throw new AppError("Hiring Request not found", 404);

  if (status === "ACCEPTED") {
    // Prevent double acceptance
    if (request.status === "PAYMENT_PENDING" || request.status === "ACTIVE") throw new AppError("Request is already processed", 400);

    const updatedRequest = await prisma.$transaction(async (tx) => {
      // Slot Checking: Prevent accepting if worker already has an active assignment on these dates
      if (request.targetWorkerId && request.startDate && request.endDate) {
        const overlappingAssignment = await tx.assignmentWorker.findFirst({
          where: {
            workerId: request.targetWorkerId,
            status: "ACTIVE",
            assignment: {
              status: "ACTIVE",
              startDate: { lte: request.endDate },
              endDate: { gte: request.startDate }
            }
          }
        });

        if (overlappingAssignment) {
          throw new AppError("You are already assigned to another job during these dates", 400);
        }
      }

      const req = await tx.hiringRequest.update({
        where: { id },
        data: { status: "PAYMENT_PENDING" }
      });

      // Create Notification
      await tx.notification.create({
        data: {
          userId: request.client.userId,
          type: "HIRING_ACCEPTED",
          title: "Hiring Request Accepted",
          message: `Your hiring request "${req.title}" has been accepted. Please complete the payment to start the work.`,
          link: "/client/requests"
        }
      });

      return req;
    });

    return updatedRequest;

    return updatedRequest;
  } else {
    const updatedRequest = await prisma.hiringRequest.update({
      where: { id },
      data: { status }
    });

    if (status === "REJECTED") {
      await prisma.notification.create({
        data: {
          userId: request.client.userId,
          type: "HIRING_REJECTED",
          title: "Hiring Request Rejected",
          message: `Your hiring request "${request.title}" was declined.`,
          link: "/hiring-requests"
        }
      });
    }

    return updatedRequest;
  }
};

import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

export const listAssignments = async (filters, user) => {
  const where = {};

  if (user.profileType === "CLIENT") {
    const client = await prisma.client.findUnique({ where: { userId: user.id } });
    if (client) where.clientId = client.id;
  } else if (user.profileType === "AGENCY") {
    const agency = await prisma.agency.findUnique({ where: { userId: user.id } });
    if (agency) where.agencyId = agency.id;
  } else if (user.profileType === "WORKER") {
    const worker = await prisma.worker.findUnique({ where: { userId: user.id } });
    if (worker) {
      where.assignedWorkers = {
        some: { workerId: worker.id, status: "ACTIVE" }
      };
    }
  }

  if (filters.status) where.status = filters.status;

  const items = await prisma.assignment.findMany({
    where,
    include: {
      client: {
        include: { user: { select: { firstName: true, lastName: true, email: true, phone: true } } }
      },
      agency: {
        include: { user: { select: { firstName: true, lastName: true } } }
      },
      assignedWorkers: {
        include: {
          worker: { include: { user: { select: { firstName: true, lastName: true } } } }
        }
      },
      hiringRequest: {
        include: {
          jobRequirement: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return items;
};

export const getAssignment = async (id, user) => {
  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: {
      client: { include: { user: { select: { firstName: true, lastName: true } } } },
      agency: { include: { user: { select: { firstName: true, lastName: true } } } },
      assignedWorkers: {
        include: {
          worker: { include: { user: { select: { firstName: true, lastName: true, avatar: true } } } }
        }
      }
    }
  });

  if (!assignment) throw new AppError("Assignment not found", 404);

  return assignment;
};

export const getAssignmentAttendance = async (id, user) => {
  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: { assignedWorkers: true }
  });

  if (!assignment) throw new AppError("Assignment not found", 404);

  const workerIds = assignment.assignedWorkers.map(aw => aw.workerId);
  if (workerIds.length === 0) return [];

  // Assuming attendance falls roughly in the assignment dates
  const where = { workerId: { in: workerIds } };
  if (assignment.startDate) where.date = { gte: assignment.startDate };
  
  const attendance = await prisma.workerAttendance.findMany({
    where,
    include: {
      worker: {
        include: { user: { select: { firstName: true, lastName: true } } }
      }
    },
    orderBy: { date: 'desc' }
  });

  return attendance;
};

export const updateAssignmentStatus = async (id, status, user) => {
  const assignment = await prisma.assignment.findUnique({ 
    where: { id },
    include: { client: true }
  });
  if (!assignment) throw new AppError("Assignment not found", 404);

  const updated = await prisma.assignment.update({
    where: { id },
    data: { status }
  });

  if (status === "COMPLETED") {
    await prisma.notification.create({
      data: {
        userId: assignment.client.userId,
        type: "ASSIGNMENT_COMPLETED",
        title: "Assignment Completed",
        message: `Your assignment "${assignment.title}" has been marked as completed.`,
        link: `/assignments/${assignment.id}`
      }
    });
  } else if (status === "ACTIVE") {
    await prisma.notification.create({
      data: {
        userId: assignment.client.userId,
        type: "ASSIGNMENT_STARTED",
        title: "Assignment Started",
        message: `Your assignment "${assignment.title}" is now active.`,
        link: `/assignments/${assignment.id}`
      }
    });
  }

  return updated;
};

export const assignWorker = async (assignmentId, workerId, user) => {
  const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });
  if (!assignment) throw new AppError("Assignment not found", 404);

  if (user.profileType === "AGENCY") {
    const agency = await prisma.agency.findUnique({ where: { userId: user.id } });
    if (assignment.agencyId !== agency.id) throw new AppError("Unauthorized", 403);
  }

  const existing = await prisma.assignmentWorker.findUnique({
    where: {
      assignmentId_workerId: {
        assignmentId,
        workerId
      }
    }
  });

  if (existing) {
    if (existing.status === "ACTIVE") throw new AppError("Worker already assigned", 400);
    return await prisma.assignmentWorker.update({
      where: { id: existing.id },
      data: { status: "ACTIVE" }
    });
  }

  return await prisma.assignmentWorker.create({
    data: {
      assignmentId,
      workerId,
      status: "ACTIVE"
    }
  });
};

export const removeWorker = async (assignmentId, workerId, user) => {
  const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });
  if (!assignment) throw new AppError("Assignment not found", 404);

  return await prisma.assignmentWorker.update({
    where: {
      assignmentId_workerId: {
        assignmentId,
        workerId
      }
    },
    data: { status: "REMOVED" }
  });
};

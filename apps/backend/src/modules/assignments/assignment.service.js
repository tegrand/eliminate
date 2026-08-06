import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";
import { startOfDay, endOfDay, differenceInMinutes } from "date-fns";

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
      },
      hiringRequest: {
        include: {
          payments: true,
          jobRequirement: true
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
  if (assignment.startDate || assignment.endDate) {
    where.date = {
      ...(assignment.startDate && { gte: startOfDay(assignment.startDate) }),
      ...(assignment.endDate && { lte: startOfDay(assignment.endDate) }),
    };
  }
  
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

export const markAssignmentAttendance = async (assignmentId, { workerId, status, date }, user) => {
  // Only clients/agencies can mark attendance for their assignments
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: {
      assignedWorkers: true,
      client: true
    }
  });

  if (!assignment) throw new AppError("Assignment not found", 404);

  // Verify the worker is actually in this assignment
  const isAssigned = assignment.assignedWorkers.some(aw => aw.workerId === workerId);
  if (!isAssigned) throw new AppError("Worker is not assigned to this assignment", 400);

  const attendanceDate = date ? startOfDay(new Date(date)) : startOfDay(new Date());
  if (assignment.startDate && attendanceDate < startOfDay(assignment.startDate)) {
    throw new AppError("Attendance date is before the assignment start date", 400);
  }
  if (assignment.endDate && attendanceDate > startOfDay(assignment.endDate)) {
    throw new AppError("Attendance date is after the assignment end date", 400);
  }

  const existing = await prisma.workerAttendance.findUnique({
    where: { workerId_date: { workerId, date: attendanceDate } }
  });

  const nowTime = new Date();
  const dataToSet = {
    workerId,
    date: attendanceDate,
    status,
    // Set checkInTime when marking PRESENT for the first time
    ...(status === 'PRESENT' && { checkInTime: nowTime })
  };

  if (existing) {
    return prisma.workerAttendance.update({
      where: { id: existing.id },
      data: { status, ...(status === 'PRESENT' && !existing.checkInTime && { checkInTime: nowTime }) }
    });
  }

  return prisma.workerAttendance.create({ data: dataToSet });
};

export const checkoutAssignmentAttendance = async (assignmentId, { workerId, date }) => {
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: { assignedWorkers: true }
  });
  if (!assignment) throw new AppError("Assignment not found", 404);
  if (!assignment.assignedWorkers.some((aw) => aw.workerId === workerId)) {
    throw new AppError("Worker is not assigned to this assignment", 400);
  }

  const attendanceDate = date ? startOfDay(new Date(date)) : startOfDay(new Date());
  let record = await prisma.workerAttendance.findFirst({
    where: {
      workerId,
      date: { gte: startOfDay(attendanceDate), lte: endOfDay(attendanceDate) }
    },
    orderBy: { date: "desc" }
  });
  if (!record) {
    record = await prisma.workerAttendance.findFirst({
      where: { workerId, status: "PRESENT", checkInTime: { not: null }, checkOutTime: null },
      orderBy: { date: "desc" }
    });
  }
  if (!record?.checkInTime) throw new AppError("Worker must be marked present before checkout", 400);
  if (record.checkOutTime) throw new AppError("Worker is already checked out", 400);

  const checkOutTime = new Date();
  const totalHours = differenceInMinutes(checkOutTime, record.checkInTime) / 60;
  const overtimeHours = totalHours > 8 ? totalHours - 8 : 0;

  return prisma.workerAttendance.update({
    where: { id: record.id },
    data: {
      checkOutTime,
      totalHours: Number(totalHours.toFixed(2)),
      overtimeHours: Number(overtimeHours.toFixed(2)),
    }
  });
};

export const updateAssignmentStatus = async (id, status, user) => {
  const assignment = await prisma.assignment.findUnique({ 
    where: { id },
    include: { 
      client: true,
      hiringRequest: true
    }
  });
  if (!assignment) throw new AppError("Assignment not found", 404);

  const updated = await prisma.assignment.update({
    where: { id },
    data: { status }
  });

  if (status === "COMPLETED") {
    // Update JobRequirement to COMPLETED
    if (assignment.hiringRequest?.jobRequirementId) {
      await prisma.jobRequirement.update({
        where: { id: assignment.hiringRequest.jobRequirementId },
        data: { status: "COMPLETED" }
      });
    }

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

  // Slot Checking: Prevent assigning if worker already has an active assignment on these dates
  if (assignment.startDate && assignment.endDate) {
    const overlappingAssignment = await prisma.assignmentWorker.findFirst({
      where: {
        workerId,
        status: "ACTIVE",
        assignment: {
          status: "ACTIVE",
          startDate: { lte: assignment.endDate },
          endDate: { gte: assignment.startDate },
          id: { not: assignmentId }
        }
      }
    });

    if (overlappingAssignment) {
      throw new AppError("Worker is already assigned to another job during these dates", 400);
    }
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

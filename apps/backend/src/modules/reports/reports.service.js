import prisma from "../../config/prisma.js";

export const getWorkerHistory = async (clientId) => {
  return await prisma.assignmentWorker.findMany({
    where: { assignment: { clientId } },
    include: {
      worker: { include: { user: { select: { firstName: true, lastName: true } } } },
      assignment: { select: { title: true, startDate: true, endDate: true, status: true } }
    },
    orderBy: { assignedAt: 'desc' }
  });
};

export const getAgencyHistory = async (clientId) => {
  return await prisma.assignment.findMany({
    where: { clientId, agencyId: { not: null } },
    include: {
      agency: { include: { user: { select: { firstName: true, lastName: true } } } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getJobHistory = async (clientId) => {
  return await prisma.assignment.findMany({
    where: { clientId },
    orderBy: { createdAt: 'desc' }
  });
};

export const getAttendanceReport = async (clientId) => {
  // Find all assignments for this client, then get all workers, then their attendance
  const assignments = await prisma.assignment.findMany({
    where: { clientId },
    select: { id: true }
  });
  const assignmentIds = assignments.map(a => a.id);

  const workers = await prisma.assignmentWorker.findMany({
    where: { assignmentId: { in: assignmentIds } },
    select: { workerId: true }
  });
  const workerIds = workers.map(w => w.workerId);

  return await prisma.workerAttendance.findMany({
    where: { workerId: { in: workerIds } },
    include: {
      worker: { include: { user: { select: { firstName: true, lastName: true } } } }
    },
    orderBy: { date: 'desc' }
  });
};


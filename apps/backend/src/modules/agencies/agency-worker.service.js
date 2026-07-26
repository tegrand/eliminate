import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

const agencyWorkerSelect = {
  id: true,
  assignedAt: true,
  status: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  worker: {
    select: {
      id: true,
      workerCode: true,
      firstName: true,
      lastName: true,
    },
  },
};

export const assignWorker = async (data) => {
  const [agency, worker] = await Promise.all([
    prisma.agency.findUnique({ where: { id: data.agencyId, deletedAt: null } }),
    prisma.worker.findUnique({ where: { id: data.workerId, deletedAt: null } }),
  ]);

  if (!agency) throw new AppError("Agency not found", 404);
  if (!worker) throw new AppError("Worker not found", 404);

  const existingAssignment = await prisma.agencyWorker.findUnique({
    where: {
      agencyId_workerId: {
        agencyId: data.agencyId,
        workerId: data.workerId,
      },
    },
  });

  if (existingAssignment) throw new AppError("This worker is already assigned to the agency", 409);

  return await prisma.agencyWorker.create({
    data,
    select: agencyWorkerSelect,
  });
};

export const getAgencyWorkers = async (agencyId) => {
  const agency = await prisma.agency.findUnique({ where: { id: agencyId, deletedAt: null } });
  if (!agency) throw new AppError("Agency not found", 404);

  return await prisma.agencyWorker.findMany({
    where: { agencyId },
    orderBy: { assignedAt: "desc" },
    select: agencyWorkerSelect,
  });
};

export const updateAssignment = async (agencyId, workerId, data) => {
  const existingAssignment = await prisma.agencyWorker.findUnique({
    where: {
      agencyId_workerId: { agencyId, workerId },
    },
  });

  if (!existingAssignment) throw new AppError("Agency worker assignment not found", 404);

  return await prisma.agencyWorker.update({
    where: {
      agencyId_workerId: { agencyId, workerId },
    },
    data,
    select: agencyWorkerSelect,
  });
};

export const deleteAssignment = async (agencyId, workerId) => {
  const existingAssignment = await prisma.agencyWorker.findUnique({
    where: {
      agencyId_workerId: { agencyId, workerId },
    },
  });

  if (!existingAssignment) throw new AppError("Agency worker assignment not found", 404);

  await prisma.agencyWorker.delete({
    where: {
      agencyId_workerId: { agencyId, workerId },
    },
  });

  return true;
};

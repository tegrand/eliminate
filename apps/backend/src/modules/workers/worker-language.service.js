import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

const workerLanguageSelect = {
  id: true,
  proficiencyLevel: true,
  canRead: true,
  canWrite: true,
  canSpeak: true,
  isPrimary: true,
  createdAt: true,
  updatedAt: true,
  language: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },
};

export const assignLanguage = async (data) => {
  const [worker, language] = await Promise.all([
    prisma.worker.findUnique({ where: { id: data.workerId, deletedAt: null } }),
    prisma.language.findUnique({ where: { id: data.languageId, deletedAt: null } }),
  ]);

  if (!worker) throw new AppError("Worker not found", 404);
  if (!language) throw new AppError("Language not found", 404);

  const existingAssignment = await prisma.workerLanguage.findUnique({
    where: {
      workerId_languageId: {
        workerId: data.workerId,
        languageId: data.languageId,
      },
    },
  });

  if (existingAssignment) throw new AppError("This language is already assigned to the worker", 409);

  return await prisma.$transaction(async (tx) => {
    if (data.isPrimary) {
      await tx.workerLanguage.updateMany({
        where: { workerId: data.workerId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    return await tx.workerLanguage.create({
      data,
      select: workerLanguageSelect,
    });
  });
};

export const getWorkerLanguages = async (workerId) => {
  const worker = await prisma.worker.findUnique({ where: { id: workerId, deletedAt: null } });
  if (!worker) throw new AppError("Worker not found", 404);

  return await prisma.workerLanguage.findMany({
    where: { workerId },
    orderBy: [
      { isPrimary: "desc" },
      { proficiencyLevel: "desc" },
    ],
    select: workerLanguageSelect,
  });
};

export const updateWorkerLanguage = async (workerId, languageId, data) => {
  const existingAssignment = await prisma.workerLanguage.findUnique({
    where: {
      workerId_languageId: { workerId, languageId },
    },
  });

  if (!existingAssignment) throw new AppError("Worker language assignment not found", 404);

  return await prisma.$transaction(async (tx) => {
    if (data.isPrimary) {
      await tx.workerLanguage.updateMany({
        where: { workerId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    return await tx.workerLanguage.update({
      where: {
        workerId_languageId: { workerId, languageId },
      },
      data,
      select: workerLanguageSelect,
    });
  });
};

export const deleteWorkerLanguage = async (workerId, languageId) => {
  const existingAssignment = await prisma.workerLanguage.findUnique({
    where: {
      workerId_languageId: { workerId, languageId },
    },
  });

  if (!existingAssignment) throw new AppError("Worker language assignment not found", 404);

  await prisma.workerLanguage.delete({
    where: {
      workerId_languageId: { workerId, languageId },
    },
  });

  return true;
};

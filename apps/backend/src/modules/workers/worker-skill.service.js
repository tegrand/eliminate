import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

const workerSkillSelect = {
  id: true,
  experienceYears: true,
  proficiencyLevel: true,
  isPrimary: true,
  createdAt: true,
  updatedAt: true,
  skill: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
};

export const assignSkill = async (data) => {
  const [worker, skill] = await Promise.all([
    prisma.worker.findUnique({ where: { id: data.workerId, deletedAt: null } }),
    prisma.skill.findUnique({ where: { id: data.skillId, deletedAt: null } }),
  ]);

  if (!worker) throw new AppError("Worker not found", 404);
  if (!skill) throw new AppError("Skill not found", 404);

  const existingAssignment = await prisma.workerSkill.findUnique({
    where: {
      workerId_skillId: {
        workerId: data.workerId,
        skillId: data.skillId,
      },
    },
  });

  if (existingAssignment) throw new AppError("This skill is already assigned to the worker", 409);

  return await prisma.$transaction(async (tx) => {
    if (data.isPrimary) {
      await tx.workerSkill.updateMany({
        where: { workerId: data.workerId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    return await tx.workerSkill.create({
      data,
      select: workerSkillSelect,
    });
  });
};

export const getWorkerSkills = async (workerId) => {
  const worker = await prisma.worker.findUnique({ where: { id: workerId, deletedAt: null } });
  if (!worker) throw new AppError("Worker not found", 404);

  return await prisma.workerSkill.findMany({
    where: { workerId },
    orderBy: [
      { isPrimary: "desc" },
      { proficiencyLevel: "desc" },
    ],
    select: workerSkillSelect,
  });
};

export const updateWorkerSkill = async (workerId, skillId, data) => {
  const existingAssignment = await prisma.workerSkill.findUnique({
    where: {
      workerId_skillId: { workerId, skillId },
    },
  });

  if (!existingAssignment) throw new AppError("Worker skill assignment not found", 404);

  return await prisma.$transaction(async (tx) => {
    if (data.isPrimary) {
      await tx.workerSkill.updateMany({
        where: { workerId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    return await tx.workerSkill.update({
      where: {
        workerId_skillId: { workerId, skillId },
      },
      data,
      select: workerSkillSelect,
    });
  });
};

export const deleteWorkerSkill = async (workerId, skillId) => {
  const existingAssignment = await prisma.workerSkill.findUnique({
    where: {
      workerId_skillId: { workerId, skillId },
    },
  });

  if (!existingAssignment) throw new AppError("Worker skill assignment not found", 404);

  await prisma.workerSkill.delete({
    where: {
      workerId_skillId: { workerId, skillId },
    },
  });

  return true;
};

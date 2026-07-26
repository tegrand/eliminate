import crypto from "crypto";

import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

const generateWorkerCode = () => {
  return `WRK-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
};

const workerSelect = {
  id: true,
  userId: true,
  workerCode: true,
  firstName: true,
  lastName: true,
  phone: true,
  gender: true,
  dateOfBirth: true,
  profilePhoto: true,
  employmentStatus: true,
  joiningDate: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      email: true,
      status: true,
      profileType: true,
    },
  },
};

export const createWorker = async (userId, data) => {
  // Assuming authorization middleware handles basic access control,
  // we ensure here that the 1:1 relationship is preserved.
  const existingWorker = await prisma.worker.findUnique({
    where: { userId },
  });

  if (existingWorker) {
    throw new AppError("Worker profile already exists for this user", 409);
  }

  const workerCode = generateWorkerCode();

  const worker = await prisma.worker.create({
    data: {
      ...data,
      userId,
      workerCode,
    },
    select: workerSelect,
  });

  return worker;
};

export const getWorkers = async ({
  page = 1,
  limit = 10,
  search,
  status,
  sortBy = "createdAt",
  sortOrder = "desc",
}) => {
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
  };

  if (status) {
    where.employmentStatus = status;
  }

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { workerCode: { contains: search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.worker.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { [sortBy]: sortOrder },
      select: workerSelect,
    }),
    prisma.worker.count({ where }),
  ]);

  return {
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getWorkerById = async (id, user) => {
  const worker = await prisma.worker.findFirst({
    where: { id, deletedAt: null },
    select: workerSelect,
  });

  if (!worker) {
    throw new AppError("Worker not found", 404);
  }

  // RBAC Ownership Check
  if (user?.profileType === "WORKER" && worker.userId !== user.id) {
    throw new AppError("Forbidden: You cannot access another worker's profile.", 403);
  }

  return worker;
};

export const updateWorker = async (id, data, user) => {
  const worker = await prisma.worker.findFirst({
    where: { id, deletedAt: null },
  });

  if (!worker) {
    throw new AppError("Worker not found", 404);
  }

  // RBAC Ownership Check
  if (user?.profileType === "WORKER" && worker.userId !== user.id) {
    throw new AppError("Forbidden: You cannot update another worker's profile.", 403);
  }

  const updatedWorker = await prisma.worker.update({
    where: { id },
    data,
    select: workerSelect,
  });

  return updatedWorker;
};

export const deleteWorker = async (id) => {
  const worker = await prisma.worker.findFirst({
    where: { id, deletedAt: null },
  });

  if (!worker) {
    throw new AppError("Worker not found", 404);
  }

  await prisma.worker.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return true;
};

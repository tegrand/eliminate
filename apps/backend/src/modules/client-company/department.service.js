import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

const deptSelect = {
  id: true,
  name: true,
  clientId: true,
  createdAt: true,
  updatedAt: true,
  hiringRequests: { select: { id: true, status: true } }
};

const getCompanyClient = async (userId) => {
  const client = await prisma.client.findUnique({ where: { userId, deletedAt: null } });
  if (!client) throw new AppError("Client profile not found", 404);
  if (client.clientType !== "COMPANY") throw new AppError("This feature is only available for Company clients", 403);
  return client;
};

export const listDepartments = async (userId) => {
  const client = await getCompanyClient(userId);
  return prisma.department.findMany({ where: { clientId: client.id }, select: deptSelect, orderBy: { name: "asc" } });
};

export const createDepartment = async (userId, data) => {
  const client = await getCompanyClient(userId);
  return prisma.department.create({ data: { ...data, clientId: client.id }, select: deptSelect });
};

export const updateDepartment = async (userId, deptId, data) => {
  const client = await getCompanyClient(userId);
  const dept = await prisma.department.findFirst({ where: { id: deptId, clientId: client.id } });
  if (!dept) throw new AppError("Department not found", 404);
  return prisma.department.update({ where: { id: deptId }, data, select: deptSelect });
};

export const deleteDepartment = async (userId, deptId) => {
  const client = await getCompanyClient(userId);
  const dept = await prisma.department.findFirst({ where: { id: deptId, clientId: client.id } });
  if (!dept) throw new AppError("Department not found", 404);
  await prisma.department.delete({ where: { id: deptId } });
  return true;
};

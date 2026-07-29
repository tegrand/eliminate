import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

const siteSelect = {
  id: true,
  name: true,
  address: true,
  city: true,
  state: true,
  clientId: true,
  projectId: true,
  project: { select: { id: true, name: true } },
  supervisors: { select: { id: true, userId: true } },
  createdAt: true,
  updatedAt: true,
};

const getCompanyClient = async (userId) => {
  const client = await prisma.client.findUnique({ where: { userId, deletedAt: null } });
  if (!client) throw new AppError("Client profile not found", 404);
  if (client.clientType !== "COMPANY") throw new AppError("This feature is only available for Company clients", 403);
  return client;
};

export const listSites = async (userId, projectId) => {
  const client = await getCompanyClient(userId);
  const where = { clientId: client.id };
  if (projectId) where.projectId = projectId;
  return prisma.siteLocation.findMany({ where, select: siteSelect, orderBy: { createdAt: "desc" } });
};

export const createSite = async (userId, data) => {
  const client = await getCompanyClient(userId);
  // If projectId provided, verify it belongs to this client
  if (data.projectId) {
    const proj = await prisma.project.findFirst({ where: { id: data.projectId, clientId: client.id } });
    if (!proj) throw new AppError("Project not found", 404);
  }
  return prisma.siteLocation.create({ data: { ...data, clientId: client.id }, select: siteSelect });
};

export const updateSite = async (userId, siteId, data) => {
  const client = await getCompanyClient(userId);
  const site = await prisma.siteLocation.findFirst({ where: { id: siteId, clientId: client.id } });
  if (!site) throw new AppError("Site location not found", 404);
  return prisma.siteLocation.update({ where: { id: siteId }, data, select: siteSelect });
};

export const deleteSite = async (userId, siteId) => {
  const client = await getCompanyClient(userId);
  const site = await prisma.siteLocation.findFirst({ where: { id: siteId, clientId: client.id } });
  if (!site) throw new AppError("Site location not found", 404);
  await prisma.siteLocation.delete({ where: { id: siteId } });
  return true;
};

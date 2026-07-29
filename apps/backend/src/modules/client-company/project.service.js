import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

const projectSelect = {
  id: true,
  name: true,
  description: true,
  status: true,
  clientId: true,
  createdAt: true,
  updatedAt: true,
  sites: {
    select: { id: true, name: true, city: true }
  },
  assignments: {
    select: { id: true, status: true }
  }
};

// Get the client record for the logged-in user (with COMPANY check)
const getCompanyClient = async (userId) => {
  const client = await prisma.client.findUnique({ where: { userId, deletedAt: null } });
  if (!client) throw new AppError("Client profile not found", 404);
  if (client.clientType !== "COMPANY") throw new AppError("This feature is only available for Company clients", 403);
  return client;
};

export const listProjects = async (userId) => {
  const client = await getCompanyClient(userId);
  return prisma.project.findMany({
    where: { clientId: client.id },
    select: projectSelect,
    orderBy: { createdAt: "desc" }
  });
};

export const createProject = async (userId, data) => {
  const client = await getCompanyClient(userId);
  return prisma.project.create({
    data: { ...data, clientId: client.id },
    select: projectSelect
  });
};

export const updateProject = async (userId, projectId, data) => {
  const client = await getCompanyClient(userId);
  const project = await prisma.project.findFirst({ where: { id: projectId, clientId: client.id } });
  if (!project) throw new AppError("Project not found", 404);
  return prisma.project.update({ where: { id: projectId }, data, select: projectSelect });
};

export const deleteProject = async (userId, projectId) => {
  const client = await getCompanyClient(userId);
  const project = await prisma.project.findFirst({ where: { id: projectId, clientId: client.id } });
  if (!project) throw new AppError("Project not found", 404);
  await prisma.project.delete({ where: { id: projectId } });
  return true;
};

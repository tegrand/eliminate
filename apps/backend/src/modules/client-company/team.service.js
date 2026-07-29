import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

const teamSelect = {
  id: true,
  name: true,
  clientId: true,
  createdAt: true,
  updatedAt: true,
  members: {
    select: {
      id: true,
      workerId: true,
      worker: {
        select: { id: true, firstName: true, lastName: true, phone: true, profilePhoto: true }
      }
    }
  }
};

const getCompanyClient = async (userId) => {
  const client = await prisma.client.findUnique({ where: { userId, deletedAt: null } });
  if (!client) throw new AppError("Client profile not found", 404);
  if (client.clientType !== "COMPANY") throw new AppError("This feature is only available for Company clients", 403);
  return client;
};

export const listTeams = async (userId) => {
  const client = await getCompanyClient(userId);
  return prisma.team.findMany({ where: { clientId: client.id }, select: teamSelect, orderBy: { createdAt: "desc" } });
};

export const createTeam = async (userId, data) => {
  const client = await getCompanyClient(userId);
  return prisma.team.create({ data: { name: data.name, clientId: client.id }, select: teamSelect });
};

export const updateTeam = async (userId, teamId, data) => {
  const client = await getCompanyClient(userId);
  const team = await prisma.team.findFirst({ where: { id: teamId, clientId: client.id } });
  if (!team) throw new AppError("Team not found", 404);
  return prisma.team.update({ where: { id: teamId }, data: { name: data.name }, select: teamSelect });
};

export const deleteTeam = async (userId, teamId) => {
  const client = await getCompanyClient(userId);
  const team = await prisma.team.findFirst({ where: { id: teamId, clientId: client.id } });
  if (!team) throw new AppError("Team not found", 404);
  await prisma.team.delete({ where: { id: teamId } });
  return true;
};

export const addTeamMember = async (userId, teamId, workerId) => {
  const client = await getCompanyClient(userId);
  const team = await prisma.team.findFirst({ where: { id: teamId, clientId: client.id } });
  if (!team) throw new AppError("Team not found", 404);
  const worker = await prisma.worker.findFirst({ where: { id: workerId, deletedAt: null } });
  if (!worker) throw new AppError("Worker not found", 404);
  // Check if already a member
  const existing = await prisma.teamMember.findUnique({ where: { teamId_workerId: { teamId, workerId } } });
  if (existing) throw new AppError("Worker is already a member of this team", 409);
  await prisma.teamMember.create({ data: { teamId, workerId } });
  return prisma.team.findUnique({ where: { id: teamId }, select: teamSelect });
};

export const removeTeamMember = async (userId, teamId, workerId) => {
  const client = await getCompanyClient(userId);
  const team = await prisma.team.findFirst({ where: { id: teamId, clientId: client.id } });
  if (!team) throw new AppError("Team not found", 404);
  const existing = await prisma.teamMember.findUnique({ where: { teamId_workerId: { teamId, workerId } } });
  if (!existing) throw new AppError("Worker is not a member of this team", 404);
  await prisma.teamMember.delete({ where: { teamId_workerId: { teamId, workerId } } });
  return true;
};

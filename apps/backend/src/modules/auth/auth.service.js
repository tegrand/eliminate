import bcrypt from "bcrypt";

import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { registerSchema } from "./auth.validation.js";
import AppError from "../../shared/errors/app-error.js";
import authConfig from "../../config/auth.config.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export const register = async (payload) => {
  const data = registerSchema.parse(payload);

  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const role = await prisma.role.findUnique({
    where: {
      name: data.accountType,
    },
  });

  if (!role) {
    throw new AppError("Role not found", 404);
  }

  const passwordHash = await bcrypt.hash(
    data.password,
    authConfig.bcryptRounds
  );

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      profileType: data.accountType,
      roleId: role.id,
    },
    select: {
      id: true,
      email: true,
      profileType: true,
      status: true,
      createdAt: true,
    },
  });

  return user;
};

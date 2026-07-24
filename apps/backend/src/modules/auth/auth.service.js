import bcrypt from "bcrypt";

import prisma from "../../config/prisma.js";
import authConfig from "../../config/auth.config.js";
import AppError from "../../shared/errors/app-error.js";
import { registerSchema } from "./auth.validation.js";

export const register = async (payload) => {
  const data = registerSchema.parse(payload);

  // Check email
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email.toLowerCase().trim(),
    },
  });

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  // Get role
  const role = await prisma.role.findUnique({
    where: {
      name: data.accountType,
    },
  });

  if (!role) {
    throw new AppError("Invalid account type", 400);
  }

  // Hash password
  const passwordHash = await bcrypt.hash(
    data.password,
    authConfig.bcryptRounds
  );

  // Create user
  const user = await prisma.user.create({
    data: {
      email: data.email.toLowerCase().trim(),
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

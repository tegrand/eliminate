import bcrypt from "bcrypt";

import { PrismaClient } from "../../generated/prisma/client.js";
import { registerSchema } from "./auth.validation.js";
import AppError from "../../shared/errors/app-error.js";

const prisma = new PrismaClient();

export const register = async (payload) => {
  // Validate request
  const data = registerSchema.parse(payload);

  // Check existing user
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  // Hash password
  const passwordHash = await bcrypt.hash(data.password, 10);

  // TODO:
  // Get role
  // Create user
  // Return response
};

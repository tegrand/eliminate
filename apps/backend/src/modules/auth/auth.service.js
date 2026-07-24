import bcrypt from "bcrypt";
import crypto from "crypto";

import prisma from "../../config/prisma.js";
import authConfig from "../../config/auth.config.js";
import AppError from "../../shared/errors/app-error.js";
import { generateAccessToken, generateRefreshToken, parseExpToMs, verifyRefreshToken } from "./auth.utils.js";

export const register = async (data) => {
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

export const login = async (data) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email.toLowerCase().trim(),
    },
    include: {
      role: true,
    },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  switch (user.status) {
    case "PENDING":
      throw new AppError("Your account is pending approval.", 403);
    case "SUSPENDED":
      throw new AppError("Your account has been suspended.", 403);
    case "REJECTED":
      throw new AppError("Your account has been rejected.", 403);
    case "DELETED":
      throw new AppError("Account not available.", 403);
    case "ACTIVE":
      break;
    default:
      throw new AppError("Invalid account status.", 403);
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const refreshTokenHash = await bcrypt.hash(refreshToken, authConfig.bcryptRounds);
  const refreshTokenExpiresAt = new Date(Date.now() + parseExpToMs(authConfig.refreshExpiresIn));

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshTokenHash,
      refreshTokenExpiresAt,
      lastLoginAt: new Date(),
      failedLoginAttempts: 0,
    },
    select: {
      id: true,
      email: true,
      status: true,
      profileType: true,
      emailVerified: true,
      emailVerifiedAt: true,
      lastLoginAt: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return { accessToken, refreshToken, user: updatedUser };
};

export const refreshToken = async (token) => {
  const payload = verifyRefreshToken(token);
  if (!payload || !payload.sub) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    include: { role: true },
  });

  if (!user || !user.refreshTokenHash) {
    throw new AppError("Unauthorized", 401);
  }

  const isValid = await bcrypt.compare(token, user.refreshTokenHash);
  if (!isValid) {
    throw new AppError("Unauthorized", 401);
  }

  if (user.refreshTokenExpiresAt && user.refreshTokenExpiresAt < new Date()) {
    throw new AppError("Unauthorized", 401);
  }

  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  const refreshTokenHash = await bcrypt.hash(newRefreshToken, authConfig.bcryptRounds);
  const refreshTokenExpiresAt = new Date(Date.now() + parseExpToMs(authConfig.refreshExpiresIn));

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshTokenHash,
      refreshTokenExpiresAt,
      lastLoginAt: new Date(),
    },
    select: {
      id: true,
      email: true,
      status: true,
      profileType: true,
      emailVerified: true,
      emailVerifiedAt: true,
      lastLoginAt: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return { accessToken, newRefreshToken, user: updatedUser };
};

export const logout = async (token) => {
  if (!token) return;

  const payload = verifyRefreshToken(token);
  if (!payload || !payload.sub) return;

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
  });

  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshTokenHash: null,
        refreshTokenExpiresAt: null,
      },
    });
  }
};

export const getCurrentUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      status: true,
      profileType: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      role: {
        select: {
          id: true,
          name: true,
          displayName: true,
        },
      },
    },
  });

  if (!user || user.status !== "ACTIVE") {
    throw new AppError("Unauthorized", 401);
  }

  return user;
};

export const changePassword = async (userId, data) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("Unauthorized", 401);
  }

  const isPasswordValid = await bcrypt.compare(data.currentPassword, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError("Unauthorized", 401);
  }

  const isSamePassword = await bcrypt.compare(data.newPassword, user.passwordHash);
  if (isSamePassword) {
    throw new AppError("New password cannot be the same as current password", 400);
  }

  const passwordHash = await bcrypt.hash(data.newPassword, authConfig.bcryptRounds);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      refreshTokenHash: null,
      refreshTokenExpiresAt: null,
    },
  });
};

export const forgotPassword = async (data) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase().trim() },
  });

  if (!user) return;

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
  const resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetTokenHash,
      resetTokenExpiresAt,
    },
  });
};

export const resetPassword = async (data) => {
  const resetTokenHash = crypto.createHash("sha256").update(data.token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      resetTokenHash,
      resetTokenExpiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  const passwordHash = await bcrypt.hash(data.newPassword, authConfig.bcryptRounds);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetTokenHash: null,
      resetTokenExpiresAt: null,
      refreshTokenHash: null,
      refreshTokenExpiresAt: null,
    },
  });
};

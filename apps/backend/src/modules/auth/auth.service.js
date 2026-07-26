import bcrypt from "bcrypt";
import crypto from "crypto";

import prisma from "../../config/prisma.js";
import authConfig from "../../config/auth.config.js";
import AppError from "../../shared/errors/app-error.js";
import { generateAccessToken, generateRefreshToken, parseExpToMs, verifyRefreshToken } from "./auth.utils.js";

const issueTokensAndUpdateUser = async (user, meta, action = "LOGIN") => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const refreshTokenHash = await bcrypt.hash(refreshToken, authConfig.bcryptRounds);
  const refreshTokenExpiresAt = new Date(Date.now() + parseExpToMs(authConfig.refreshExpiresIn));

  const [updatedUser] = await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        refreshTokenHash,
        refreshTokenExpiresAt,
        lastLoginAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
      select: {
        id: true,
        email: true,
        status: true,
        profileType: true,
        emailVerified: true,
        emailVerifiedAt: true,
        lastLoginAt: true,
        role: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.authAuditLog.create({
      data: {
        userId: user.id,
        action,
        ipAddress: meta?.ipAddress,
        userAgent: meta?.userAgent,
      },
    }),
  ]);

  return { accessToken, refreshToken, user: updatedUser };
};

export const register = async (data) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const role = await prisma.role.findUnique({
    where: { name: data.accountType },
  });

  if (!role) {
    throw new AppError("Invalid account type", 400);
  }

  const passwordHash = await bcrypt.hash(data.password, authConfig.bcryptRounds);

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

export const login = async (data, meta) => {
  console.log("\n=== LOGIN ATTEMPT ===");
  console.log("Email received:", data.email);
  console.log("Password received:", data.password);
  console.log("=====================\n");

  const normalizedEmail = data.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      passwordHash: true,
      status: true,
      profileType: true,
      failedLoginAttempts: true,
      lockedUntil: true,
      role: {
        select: {
          id: true,
          name: true,
          displayName: true,
        },
      },
    },
  });

  if (!user) {
    await bcrypt.compare(data.password, "$2b$10$dummyHashThatIs60CharsLong12345678901234567890123456789");
    throw new AppError("Invalid email or password", 401);
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw new AppError(`Account is locked until ${user.lockedUntil.toISOString()}`, 403);
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
  if (!isPasswordValid) {
    const failedAttempts = user.failedLoginAttempts + 1;
    const isLocked = failedAttempts >= 5;

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: failedAttempts,
          lockedUntil: isLocked ? new Date(Date.now() + 15 * 60 * 1000) : null,
        },
      }),
      prisma.authAuditLog.create({
        data: {
          userId: user.id,
          action: isLocked ? "ACCOUNT_LOCK" : "FAILED_LOGIN",
          ipAddress: meta?.ipAddress,
          userAgent: meta?.userAgent,
        },
      }),
    ]);

    throw new AppError("Invalid email or password", 401);
  }

  if (user.profileType === "WORKER" || user.profileType === "AGENCY") {
    switch (user.status) {
      case "SUSPENDED":
        throw new AppError("Your account has been suspended.", 403);
      case "REJECTED":
        throw new AppError("Your account has been rejected.", 403);
      case "DELETED":
        throw new AppError("Account not available.", 403);
      case "PENDING":
      case "ACTIVE":
        break;
      default:
        throw new AppError("Invalid account status.", 403);
    }
  } else {
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
  }

  return issueTokensAndUpdateUser(user, meta, "LOGIN");
};

export const refreshToken = async (token, meta) => {
  const payload = verifyRefreshToken(token);
  if (!payload || !payload.sub) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      refreshTokenHash: true,
      refreshTokenExpiresAt: true,
      status: true,
      profileType: true,
      role: {
        select: {
          id: true,
          name: true,
          displayName: true,
        },
      },
    },
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

  return issueTokensAndUpdateUser(user, meta, "REFRESH");
};

export const logout = async (token, meta) => {
  if (!token) return;

  const payload = verifyRefreshToken(token);
  if (!payload || !payload.sub) return;

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true },
  });

  if (user) {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          refreshTokenHash: null,
          refreshTokenExpiresAt: null,
        },
      }),
      prisma.authAuditLog.create({
        data: {
          userId: user.id,
          action: "LOGOUT",
          ipAddress: meta?.ipAddress,
          userAgent: meta?.userAgent,
        },
      }),
    ]);
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

  if (!user) {
    throw new AppError("Unauthorized", 401);
  }

  if (user.profileType === "WORKER" || user.profileType === "AGENCY") {
    if (user.status !== "ACTIVE" && user.status !== "PENDING") {
      throw new AppError("Unauthorized", 401);
    }
  } else {
    if (user.status !== "ACTIVE") {
      throw new AppError("Unauthorized", 401);
    }
  }

  return user;
};

export const changePassword = async (userId, data, meta) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, passwordHash: true },
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

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        refreshTokenHash: null,
        refreshTokenExpiresAt: null,
      },
    }),
    prisma.authAuditLog.create({
      data: {
        userId: user.id,
        action: "PASSWORD_CHANGE",
        ipAddress: meta?.ipAddress,
        userAgent: meta?.userAgent,
      },
    }),
  ]);
};

export const forgotPassword = async (data) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true },
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
    select: { id: true },
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

export const resendVerification = async (data) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true, emailVerified: true },
  });

  if (!user || user.emailVerified) return;

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenHash = crypto.createHash("sha256").update(verificationToken).digest("hex");
  const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      verificationTokenHash,
      verificationTokenExpiresAt,
    },
  });
};

export const verifyEmail = async (data) => {
  const verificationTokenHash = crypto.createHash("sha256").update(data.token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      verificationTokenHash,
      verificationTokenExpiresAt: {
        gt: new Date(),
      },
    },
    select: { id: true },
  });

  if (!user) {
    throw new AppError("Invalid or expired verification token", 400);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerifiedAt: new Date(),
      verificationTokenHash: null,
      verificationTokenExpiresAt: null,
    },
  });
};

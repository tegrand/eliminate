import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";
import bcrypt from "bcrypt";
import authConfig from "../../config/auth.config.js";

const selectFields = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  avatar: true,
  timezone: true,
  language: true,
  status: true,
  profileType: true,
  emailVerified: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
  role: {
    select: { id: true, name: true, displayName: true },
  },
};

export const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: selectFields,
  });
  if (!user) throw new AppError("User not found", 404);
  return user;
};

export const updateProfile = async (userId, data) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: selectFields,
  });
  return user;
};

// Returns the last 20 login/logout/failed events for this user
export const getLoginHistory = async (userId) => {
  const logs = await prisma.authAuditLog.findMany({
    where: { userId },
    orderBy: { timestamp: "desc" },
    take: 20,
    select: {
      id: true,
      action: true,
      ipAddress: true,
      userAgent: true,
      timestamp: true,
    },
  });
  return logs;
};

// "Active session" = user has a valid (non-expired) refresh token stored
export const getActiveSessions = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      refreshTokenHash: true,
      refreshTokenExpiresAt: true,
      lastLoginAt: true,
    },
  });

  if (!user || !user.refreshTokenHash) {
    return { sessions: [] };
  }

  const isExpired = user.refreshTokenExpiresAt
    ? user.refreshTokenExpiresAt < new Date()
    : true;

  // There is always at most 1 active session (single-device token model)
  const sessions = isExpired
    ? []
    : [
        {
          id: "current",
          label: "Current Session",
          lastActive: user.lastLoginAt,
          expiresAt: user.refreshTokenExpiresAt,
          isCurrent: true,
        },
      ];

  return { sessions };
};

// Terminate all sessions by wiping the refresh token
export const revokeAllSessions = async (userId) => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      refreshTokenHash: null,
      refreshTokenExpiresAt: null,
    },
  });
};

import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

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
  createdAt: true,
  updatedAt: true,
  role: {
    select: {
      id: true,
      name: true,
      displayName: true,
    },
  },
};

export const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: selectFields,
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

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

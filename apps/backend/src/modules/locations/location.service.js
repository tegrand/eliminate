import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

const locationSelect = {
  id: true,
  name: true,
  code: true,
  state: true,
  district: true,
  country: true,
  postalCode: true,
  description: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

export const createLocation = async (data) => {
  const existingCode = await prisma.location.findUnique({ where: { code: data.code } });
  if (existingCode) throw new AppError("A location with this code already exists", 409);

  const location = await prisma.location.create({
    data,
    select: locationSelect,
  });

  return location;
};

export const getLocations = async ({
  page = 1,
  limit = 10,
  search,
  sortBy = "createdAt",
  sortOrder = "desc",
}) => {
  const skip = (page - 1) * limit;
  const where = { deletedAt: null };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { code: { contains: search, mode: "insensitive" } },
      { state: { contains: search, mode: "insensitive" } },
      { district: { contains: search, mode: "insensitive" } },
      { country: { contains: search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.location.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { [sortBy]: sortOrder },
      select: locationSelect,
    }),
    prisma.location.count({ where }),
  ]);

  return {
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getLocationById = async (id) => {
  const location = await prisma.location.findFirst({
    where: { id, deletedAt: null },
    select: locationSelect,
  });
  if (!location) throw new AppError("Location not found", 404);
  return location;
};

export const updateLocation = async (id, data) => {
  const location = await prisma.location.findFirst({ where: { id, deletedAt: null } });
  if (!location) throw new AppError("Location not found", 404);

  if (data.code && data.code !== location.code) {
    const existingCode = await prisma.location.findUnique({ where: { code: data.code } });
    if (existingCode) throw new AppError("A location with this code already exists", 409);
  }

  const updatedLocation = await prisma.location.update({
    where: { id },
    data,
    select: locationSelect,
  });

  return updatedLocation;
};

export const deleteLocation = async (id) => {
  const location = await prisma.location.findFirst({ where: { id, deletedAt: null } });
  if (!location) throw new AppError("Location not found", 404);

  await prisma.location.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  return true;
};

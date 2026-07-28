import crypto from "crypto";

import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

const generateAgencyCode = () => {
  return `AGY-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
};

const agencySelect = {
  id: true,
  userId: true,
  agencyCode: true,
  agencyName: true,
  contactPerson: true,
  phone: true,
  alternatePhone: true,
  email: true,
  gstNumber: true,
  licenseNumber: true,
  addressLine1: true,
  addressLine2: true,
  city: true,
  state: true,
  country: true,
  postalCode: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  profileStatus: true,
  licenseUrl: true,
  gstCertificateUrl: true,
  panUrl: true,
  documents: {
    select: {
      id: true,
      documentType: true,
      documentUrl: true,
      fileName: true,
      status: true,
      remarks: true,
      updatedAt: true
    }
  },
  user: {
    select: {
      id: true,
      email: true,
      status: true,
      profileType: true,
    },
  },
};

export const createAgency = async (userId, data) => {
  const existingAgency = await prisma.agency.findUnique({
    where: { userId },
  });

  if (existingAgency) {
    throw new AppError("Agency profile already exists for this user", 409);
  }

  if (data.email) {
    const existingEmail = await prisma.agency.findFirst({
      where: { email: data.email },
    });
    if (existingEmail) {
      throw new AppError("An agency with this email already exists", 409);
    }
  }

  if (data.gstNumber) {
    const existingGst = await prisma.agency.findFirst({
      where: { gstNumber: data.gstNumber },
    });
    if (existingGst) {
      throw new AppError("An agency with this GST number already exists", 409);
    }
  }

  const agencyCode = generateAgencyCode();

  const agency = await prisma.agency.create({
    data: {
      ...data,
      userId,
      agencyCode,
    },
    select: agencySelect,
  });

  return agency;
};

export const getAgencies = async ({
  page = 1,
  limit = 10,
  search,
  status,
  sortBy = "createdAt",
  sortOrder = "desc",
}) => {
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
  };

  if (status) {
    where.profileStatus = status;
  }

  if (search) {
    where.OR = [
      { agencyName: { contains: search, mode: "insensitive" } },
      { contactPerson: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { agencyCode: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.agency.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { [sortBy]: sortOrder },
      select: agencySelect,
    }),
    prisma.agency.count({ where }),
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

export const getAgencyById = async (id) => {
  const agency = await prisma.agency.findFirst({
    where: { id, deletedAt: null },
    select: agencySelect,
  });

  if (!agency) {
    throw new AppError("Agency not found", 404);
  }

  return agency;
};

export const updateAgency = async (id, data) => {
  const agency = await prisma.agency.findFirst({
    where: { id, deletedAt: null },
  });

  if (!agency) {
    throw new AppError("Agency not found", 404);
  }

  if (data.email && data.email !== agency.email) {
    const existingEmail = await prisma.agency.findFirst({
      where: { email: data.email, id: { not: id } },
    });
    if (existingEmail) {
      throw new AppError("An agency with this email already exists", 409);
    }
  }

  if (data.gstNumber && data.gstNumber !== agency.gstNumber) {
    const existingGst = await prisma.agency.findFirst({
      where: { gstNumber: data.gstNumber, id: { not: id } },
    });
    if (existingGst) {
      throw new AppError("An agency with this GST number already exists", 409);
    }
  }

  const updatedAgency = await prisma.agency.update({
    where: { id },
    data,
    select: agencySelect,
  });

  return updatedAgency;
};

export const updateAgencyStatus = async (id, status) => {
  const agency = await prisma.agency.findFirst({
    where: { id, deletedAt: null },
  });

  if (!agency) {
    throw new AppError("Agency not found", 404);
  }

  const updatedAgency = await prisma.agency.update({
    where: { id },
    data: { profileStatus: status },
    select: agencySelect,
  });

  return updatedAgency;
};

export const deleteAgency = async (id) => {
  const agency = await prisma.agency.findFirst({
    where: { id, deletedAt: null },
  });

  if (!agency) {
    throw new AppError("Agency not found", 404);
  }

  await prisma.agency.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return true;
};

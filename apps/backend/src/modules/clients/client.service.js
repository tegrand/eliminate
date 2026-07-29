import crypto from "crypto";

import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

const generateClientCode = () => {
  return `CLI-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
};

const clientSelect = {
  id: true,
  userId: true,
  clientCode: true,
  clientType: true,
  companyName: true,
  contactPerson: true,
  phone: true,
  alternatePhone: true,
  email: true,
  gstNumber: true,
  addressLine1: true,
  addressLine2: true,
  city: true,
  state: true,
  country: true,
  postalCode: true,
  notes: true,
  profileStatus: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      email: true,
      status: true,
      profileType: true,
    },
  },
};

export const createClient = async (userId, data) => {
  const existingClient = await prisma.client.findUnique({
    where: { userId },
  });

  if (existingClient) {
    throw new AppError("Client profile already exists for this user", 409);
  }

  if (data.email) {
    const existingEmail = await prisma.client.findFirst({
      where: { email: data.email },
    });
    if (existingEmail) {
      throw new AppError("A client with this email already exists", 409);
    }
  }

  if (data.gstNumber) {
    const existingGst = await prisma.client.findFirst({
      where: { gstNumber: data.gstNumber },
    });
    if (existingGst) {
      throw new AppError("A client with this GST number already exists", 409);
    }
  }

  const clientCode = generateClientCode();

  const client = await prisma.client.create({
    data: {
      ...data,
      userId,
      clientCode,
    },
    select: clientSelect,
  });

  return client;
};

export const getClients = async ({
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
      { companyName: { contains: search, mode: "insensitive" } },
      { contactPerson: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { clientCode: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.client.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { [sortBy]: sortOrder },
      select: clientSelect,
    }),
    prisma.client.count({ where }),
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

export const getClientById = async (id) => {
  const client = await prisma.client.findFirst({
    where: { id, deletedAt: null },
    select: clientSelect,
  });

  if (!client) {
    throw new AppError("Client not found", 404);
  }

  return client;
};

export const updateClient = async (id, data) => {
  const client = await prisma.client.findFirst({
    where: { id, deletedAt: null },
  });

  if (!client) {
    throw new AppError("Client not found", 404);
  }

  if (data.email && data.email !== client.email) {
    const existingEmail = await prisma.client.findFirst({
      where: { email: data.email, id: { not: id } },
    });
    if (existingEmail) {
      throw new AppError("A client with this email already exists", 409);
    }
  }

  if (data.gstNumber && data.gstNumber !== client.gstNumber) {
    const existingGst = await prisma.client.findFirst({
      where: { gstNumber: data.gstNumber, id: { not: id } },
    });
    if (existingGst) {
      throw new AppError("A client with this GST number already exists", 409);
    }
  }

  const updatedClient = await prisma.client.update({
    where: { id },
    data,
    select: clientSelect,
  });

  return updatedClient;
};

export const updateClientStatus = async (id, status) => {
  const client = await prisma.client.findFirst({
    where: { id, deletedAt: null },
  });

  if (!client) {
    throw new AppError("Client not found", 404);
  }

  const updatedClient = await prisma.client.update({
    where: { id },
    data: { profileStatus: status },
    select: clientSelect,
  });

  return updatedClient;
};

export const deleteClient = async (id) => {
  const client = await prisma.client.findFirst({
    where: { id, deletedAt: null },
  });

  if (!client) {
    throw new AppError("Client not found", 404);
  }

  await prisma.client.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return true;
};

export const getClientByUserId = async (userId) => {
  const client = await prisma.client.findUnique({
    where: { userId },
    select: {
      ...clientSelect,
      user: {
        select: {
          id: true,
          email: true,
          status: true,
          profileType: true,
          avatar: true,
        },
      },
    }
  });

  if (!client) {
    throw new AppError("Client profile not found", 404);
  }

  return client;
};

export const updateClientByUserId = async (userId, data) => {
  const client = await prisma.client.findUnique({
    where: { userId },
  });

  if (!client) {
    throw new AppError("Client profile not found", 404);
  }

  if (data.email && data.email !== client.email) {
    const existingEmail = await prisma.client.findFirst({
      where: { email: data.email, id: { not: client.id } },
    });
    if (existingEmail) {
      throw new AppError("A client with this email already exists", 409);
    }
  }
  
  // Extract user fields
  const { avatar, ...clientData } = data;

  const [updatedClient] = await prisma.$transaction([
    prisma.client.update({
      where: { id: client.id },
      data: clientData,
      select: {
        ...clientSelect,
        user: {
          select: {
            id: true,
            email: true,
            status: true,
            profileType: true,
            avatar: true,
          },
        },
      },
    }),
    ...(avatar ? [
      prisma.user.update({
        where: { id: userId },
        data: { avatar },
      })
    ] : [])
  ]);

  return updatedClient;
};

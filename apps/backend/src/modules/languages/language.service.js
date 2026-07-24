import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

const languageSelect = {
  id: true,
  name: true,
  code: true,
  description: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

export const createLanguage = async (data) => {
  const existingName = await prisma.language.findUnique({ where: { name: data.name } });
  if (existingName) throw new AppError("A language with this name already exists", 409);

  const existingCode = await prisma.language.findUnique({ where: { code: data.code } });
  if (existingCode) throw new AppError("A language with this code already exists", 409);

  const language = await prisma.language.create({
    data,
    select: languageSelect,
  });

  return language;
};

export const getLanguages = async ({
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
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.language.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { [sortBy]: sortOrder },
      select: languageSelect,
    }),
    prisma.language.count({ where }),
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

export const getLanguageById = async (id) => {
  const language = await prisma.language.findFirst({
    where: { id, deletedAt: null },
    select: languageSelect,
  });
  if (!language) throw new AppError("Language not found", 404);
  return language;
};

export const updateLanguage = async (id, data) => {
  const language = await prisma.language.findFirst({ where: { id, deletedAt: null } });
  if (!language) throw new AppError("Language not found", 404);

  if (data.name && data.name !== language.name) {
    const existingName = await prisma.language.findUnique({ where: { name: data.name } });
    if (existingName) throw new AppError("A language with this name already exists", 409);
  }

  if (data.code && data.code !== language.code) {
    const existingCode = await prisma.language.findUnique({ where: { code: data.code } });
    if (existingCode) throw new AppError("A language with this code already exists", 409);
  }

  const updatedLanguage = await prisma.language.update({
    where: { id },
    data,
    select: languageSelect,
  });

  return updatedLanguage;
};

export const deleteLanguage = async (id) => {
  const language = await prisma.language.findFirst({ where: { id, deletedAt: null } });
  if (!language) throw new AppError("Language not found", 404);

  await prisma.language.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  return true;
};

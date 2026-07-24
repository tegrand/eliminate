import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

const categorySelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

export const createCategory = async (data) => {
  const existingName = await prisma.category.findUnique({ where: { name: data.name } });
  if (existingName) throw new AppError("A category with this name already exists", 409);

  const existingSlug = await prisma.category.findUnique({ where: { slug: data.slug } });
  if (existingSlug) throw new AppError("A category with this slug already exists", 409);

  const category = await prisma.category.create({
    data,
    select: categorySelect,
  });

  return category;
};

export const getCategories = async ({
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
      { slug: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { [sortBy]: sortOrder },
      select: categorySelect,
    }),
    prisma.category.count({ where }),
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

export const getCategoryById = async (id) => {
  const category = await prisma.category.findFirst({
    where: { id, deletedAt: null },
    select: categorySelect,
  });
  if (!category) throw new AppError("Category not found", 404);
  return category;
};

export const updateCategory = async (id, data) => {
  const category = await prisma.category.findFirst({ where: { id, deletedAt: null } });
  if (!category) throw new AppError("Category not found", 404);

  if (data.name && data.name !== category.name) {
    const existingName = await prisma.category.findUnique({ where: { name: data.name } });
    if (existingName) throw new AppError("A category with this name already exists", 409);
  }

  if (data.slug && data.slug !== category.slug) {
    const existingSlug = await prisma.category.findUnique({ where: { slug: data.slug } });
    if (existingSlug) throw new AppError("A category with this slug already exists", 409);
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data,
    select: categorySelect,
  });

  return updatedCategory;
};

export const deleteCategory = async (id) => {
  const category = await prisma.category.findFirst({ where: { id, deletedAt: null } });
  if (!category) throw new AppError("Category not found", 404);

  await prisma.category.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  return true;
};

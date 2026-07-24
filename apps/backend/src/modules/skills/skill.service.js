import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

const skillSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

export const createSkill = async (data) => {
  const existingName = await prisma.skill.findUnique({ where: { name: data.name } });
  if (existingName) throw new AppError("A skill with this name already exists", 409);

  const existingSlug = await prisma.skill.findUnique({ where: { slug: data.slug } });
  if (existingSlug) throw new AppError("A skill with this slug already exists", 409);

  const skill = await prisma.skill.create({
    data,
    select: skillSelect,
  });

  return skill;
};

export const getSkills = async ({
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
    prisma.skill.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { [sortBy]: sortOrder },
      select: skillSelect,
    }),
    prisma.skill.count({ where }),
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

export const getSkillById = async (id) => {
  const skill = await prisma.skill.findFirst({
    where: { id, deletedAt: null },
    select: skillSelect,
  });
  if (!skill) throw new AppError("Skill not found", 404);
  return skill;
};

export const updateSkill = async (id, data) => {
  const skill = await prisma.skill.findFirst({ where: { id, deletedAt: null } });
  if (!skill) throw new AppError("Skill not found", 404);

  if (data.name && data.name !== skill.name) {
    const existingName = await prisma.skill.findUnique({ where: { name: data.name } });
    if (existingName) throw new AppError("A skill with this name already exists", 409);
  }

  if (data.slug && data.slug !== skill.slug) {
    const existingSlug = await prisma.skill.findUnique({ where: { slug: data.slug } });
    if (existingSlug) throw new AppError("A skill with this slug already exists", 409);
  }

  const updatedSkill = await prisma.skill.update({
    where: { id },
    data,
    select: skillSelect,
  });

  return updatedSkill;
};

export const deleteSkill = async (id) => {
  const skill = await prisma.skill.findFirst({ where: { id, deletedAt: null } });
  if (!skill) throw new AppError("Skill not found", 404);

  await prisma.skill.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  return true;
};

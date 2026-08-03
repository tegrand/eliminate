import crypto from "crypto";
import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

const jobRequirementSelect = {
  id: true,
  requirementCode: true,
  clientId: true,
  title: true,
  description: true,
  categoryId: true,
  locationId: true,
  requiredWorkers: true,
  startDate: true,
  endDate: true,
  startTime: true,
  endTime: true,
  salaryType: true,
  salaryAmount: true,
  priority: true,
  status: true,
  assignedCount: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  client: {
    select: {
      id: true,
      clientCode: true,
      contactPerson: true,
    },
  },
  category: {
    select: {
      id: true,
      name: true,
    },
  },
  location: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },
};

const generateRequirementCode = () => {
  return `REQ-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
};

const validateRelations = async (clientId, categoryId, locationId) => {
  if (clientId) {
    const client = await prisma.client.findUnique({ where: { id: clientId, deletedAt: null } });
    if (!client) throw new AppError("Client not found", 404);
  }
  
  if (categoryId) {
    const category = await prisma.category.findUnique({ where: { id: categoryId, deletedAt: null } });
    if (!category) throw new AppError("Category not found", 404);
  }

  if (locationId) {
    const location = await prisma.location.findUnique({ where: { id: locationId, deletedAt: null } });
    if (!location) throw new AppError("Location not found", 404);
  }
};

export const createJobRequirement = async (data) => {
  await validateRelations(data.clientId, data.categoryId, data.locationId);

  const requirementCode = generateRequirementCode();
  const { requiredSkillIds, ...restData } = data;

  const createData = {
    ...restData,
    requirementCode,
  };

  delete createData.requiredSkillIds;

  if (requiredSkillIds && requiredSkillIds.length > 0) {
    createData.requiredSkills = {
      create: requiredSkillIds.map((skillId) => ({
        skill: { connect: { id: skillId } },
        proficiencyLevel: "BEGINNER", // Default or extract from a detailed object later
        isMandatory: true,
      })),
    };
  }

  return await prisma.jobRequirement.create({
    data: createData,
    select: jobRequirementSelect,
  });
};

export const getJobRequirement = async (id) => {
  const requirement = await prisma.jobRequirement.findUnique({
    where: { id, deletedAt: null },
    select: jobRequirementSelect,
  });

  if (!requirement) throw new AppError("Job requirement not found", 404);

  return requirement;
};

export const listJobRequirements = async (query) => {
  const { page, limit, search, sortBy, sortOrder, clientId, categoryId, locationId, status, priority } = query;
  
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
  };

  if (search) {
    where.OR = [
      { requirementCode: { contains: search, mode: "insensitive" } },
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (clientId) where.clientId = clientId;
  if (categoryId) where.categoryId = categoryId;
  if (locationId) where.locationId = locationId;
  if (status) where.status = status;
  if (priority) where.priority = priority;

  const [data, total] = await Promise.all([
    prisma.jobRequirement.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      select: jobRequirementSelect,
    }),
    prisma.jobRequirement.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateJobRequirement = async (id, data) => {
  const existing = await prisma.jobRequirement.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existing) throw new AppError("Job requirement not found", 404);

  if (existing.startDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(existing.startDate);
    startDate.setHours(0, 0, 0, 0);

    if (startDate <= today) {
      throw new AppError("Cannot edit a job that has already started", 400);
    }
  }

  // Validate relationships if they are being updated
  await validateRelations(null, data.categoryId, data.locationId);

  const { requiredSkillIds, ...updateData } = data;
  delete updateData.requiredSkillIds;

  if (requiredSkillIds) {
    updateData.requiredSkills = {
      deleteMany: {},
      create: requiredSkillIds.map((skillId) => ({
        skill: { connect: { id: skillId } },
        proficiencyLevel: "BEGINNER",
        isMandatory: true,
      })),
    };
  }

  return await prisma.jobRequirement.update({
    where: { id },
    data: updateData,
    select: jobRequirementSelect,
  });
};

export const deleteJobRequirement = async (id) => {
  const existing = await prisma.jobRequirement.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existing) throw new AppError("Job requirement not found", 404);

  if (existing.startDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(existing.startDate);
    startDate.setHours(0, 0, 0, 0);

    if (startDate <= today) {
      throw new AppError("Cannot delete a job that has already started", 400);
    }
  }

  await prisma.jobRequirement.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return true;
};

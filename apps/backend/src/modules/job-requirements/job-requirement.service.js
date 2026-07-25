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
  notes: true,
  createdAt: true,
  updatedAt: true,
  client: {
    select: {
      id: true,
      clientCode: true,
      companyName: true,
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

  return await prisma.jobRequirement.create({
    data: {
      ...data,
      requirementCode,
    },
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

  // Validate relationships if they are being updated
  await validateRelations(null, data.categoryId, data.locationId);

  return await prisma.jobRequirement.update({
    where: { id },
    data,
    select: jobRequirementSelect,
  });
};

export const deleteJobRequirement = async (id) => {
  const existing = await prisma.jobRequirement.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existing) throw new AppError("Job requirement not found", 404);

  await prisma.jobRequirement.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return true;
};

export const applyForJob = async (jobId, userId, notes) => {
  const worker = await prisma.worker.findFirst({
    where: { userId, deletedAt: null }
  });
  if (!worker) throw new AppError("Worker profile not found", 404);

  const job = await prisma.jobRequirement.findUnique({
    where: { id: jobId, deletedAt: null }
  });
  if (!job) throw new AppError("Job requirement not found", 404);

  const existingApp = await prisma.jobApplication.findUnique({
    where: {
      jobRequirementId_workerId: {
        jobRequirementId: jobId,
        workerId: worker.id
      }
    }
  });
  if (existingApp) throw new AppError("You have already applied for this job", 400);

  return await prisma.jobApplication.create({
    data: {
      jobRequirementId: jobId,
      workerId: worker.id,
      notes
    }
  });
};

import prisma from "../../../config/prisma.js";
import AppError from "../../../utils/appError.js";

// Ensure worker is verified before accessing marketplace
const ensureVerified = async (userId) => {
  const worker = await prisma.worker.findUnique({ where: { userId } });
  if (!worker || worker.profileStatus !== "APPROVED") {
    throw new AppError("Only verified workers can access the marketplace", 403);
  }
  return worker;
};

export const getMarketplaceJobs = async (userId, filters = {}) => {
  const worker = await ensureVerified(userId);

  const { skillId, locationId, minWage, duration } = filters;

  const query = {
    status: "OPEN",
    deletedAt: null,
    applications: { none: { workerId: worker.id } },
    savedBy: { none: { workerId: worker.id } },
    ignoredBy: { none: { workerId: worker.id } },
  };

  if (skillId) {
    query.requiredSkills = { some: { skillId } };
  }
  if (locationId) {
    query.locationId = locationId;
  }
  if (minWage) {
    query.salaryAmount = { gte: parseFloat(minWage) };
  }
  if (duration) {
    query.duration = duration;
  }

  const jobs = await prisma.jobRequirement.findMany({
    where: query,
    include: {
      client: {
        select: {
          companyName: true,
          firstName: true,
          lastName: true,
          profilePhoto: true,
          rating: true
        }
      },
      category: true,
      location: true,
      requiredSkills: { include: { skill: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 50 // limit to 50 for now
  });

  return jobs;
};

export const applyForJob = async (userId, jobRequirementId) => {
  const worker = await ensureVerified(userId);

  const job = await prisma.jobRequirement.findFirst({
    where: { id: jobRequirementId, status: "OPEN" }
  });

  if (!job) {
    throw new AppError("Job not found or no longer open", 404);
  }

  // Create application
  const application = await prisma.jobApplication.create({
    data: {
      jobRequirementId,
      workerId: worker.id,
      status: "APPLIED"
    }
  });

  return application;
};

export const saveJob = async (userId, jobRequirementId) => {
  const worker = await ensureVerified(userId);

  const saved = await prisma.savedJob.create({
    data: {
      jobRequirementId,
      workerId: worker.id
    }
  });

  return saved;
};

export const ignoreJob = async (userId, jobRequirementId) => {
  const worker = await ensureVerified(userId);

  const ignored = await prisma.ignoredJob.create({
    data: {
      jobRequirementId,
      workerId: worker.id
    }
  });

  return ignored;
};

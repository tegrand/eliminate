import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";
import crypto from "crypto";

const generateRequirementCode = () => {
  return `REQ-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
};

export const createJobRequirement = async (clientId, data) => {
  // Extract relations
  const { requiredSkills, requiredLanguages, ...requirementData } = data;

  const jobRequirement = await prisma.jobRequirement.create({
    data: {
      ...requirementData,
      clientId,
      requirementCode: generateRequirementCode(),
      status: "OPEN", // As per design, directly submit as OPEN for this flow
      requiredSkills: requiredSkills
        ? {
            create: requiredSkills.map((skill) => ({
              skillId: skill.skillId,
              experienceYears: skill.experienceYears,
              proficiencyLevel: skill.proficiencyLevel,
              isMandatory: skill.isMandatory,
            })),
          }
        : undefined,
      requiredLanguages: requiredLanguages
        ? {
            create: requiredLanguages.map((lang) => ({
              languageId: lang.languageId,
              proficiencyLevel: lang.proficiencyLevel,
              isMandatory: lang.isMandatory,
            })),
          }
        : undefined,
    },
    include: {
      requiredSkills: { include: { skill: true } },
      requiredLanguages: { include: { language: true } },
      category: true,
      location: true,
    },
  });

  return jobRequirement;
};

export const getJobRequirements = async (clientId, query) => {
  const { status, locationId, page = 1, limit = 10 } = query;
  
  const where = {
    clientId,
    deletedAt: null,
  };
  
  if (status) where.status = status;
  if (locationId) where.locationId = locationId;

  const skip = (page - 1) * limit;

  const [total, data] = await Promise.all([
    prisma.jobRequirement.count({ where }),
    prisma.jobRequirement.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        location: true,
      },
    }),
  ]);

  return { total, data, page: Number(page), limit: Number(limit) };
};

export const getJobRequirementById = async (id, clientId) => {
  const jobRequirement = await prisma.jobRequirement.findFirst({
    where: { id, clientId, deletedAt: null },
    include: {
      requiredSkills: { include: { skill: true } },
      requiredLanguages: { include: { language: true } },
      category: true,
      location: true,
      applications: {
        include: {
          worker: {
            include: { user: true }
          }
        }
      }
    },
  });

  if (!jobRequirement) {
    throw new AppError("Job requirement not found", 404);
  }

  return jobRequirement;
};

export const updateJobRequirement = async (id, clientId, data) => {
  const existingJob = await getJobRequirementById(id, clientId);

  if (existingJob.status === "CANCELLED" || existingJob.status === "CLOSED" || existingJob.status === "COMPLETED") {
    throw new AppError("Cannot edit a job requirement in its current status", 400);
  }

  if (["PARTIALLY_FILLED", "FILLED"].includes(existingJob.status)) {
    // Restricted editing
    if (data.startDate || data.locationId || data.salaryAmount) {
      throw new AppError("Cannot edit start date, location, or salary after workers are assigned", 400);
    }
  }

  const { requiredSkills, requiredLanguages, ...updateData } = data;

  // For complex relation updates, usually we delete and recreate or use a transaction.
  // For simplicity, we only update the main requirement fields here.
  const updatedJob = await prisma.jobRequirement.update({
    where: { id },
    data: updateData,
  });

  return updatedJob;
};

export const cancelJobRequirement = async (id, clientId, reason) => {
  const existingJob = await getJobRequirementById(id, clientId);

  if (existingJob.status === "CANCELLED" || existingJob.status === "CLOSED" || existingJob.status === "COMPLETED") {
    throw new AppError("Job requirement cannot be cancelled in its current status", 400);
  }

  const requiresReason = ["PARTIALLY_FILLED", "FILLED", "IN_PROGRESS"].includes(existingJob.status);
  
  if (requiresReason && !reason) {
    throw new AppError("A cancellation reason is required for jobs with assigned workers", 400);
  }

  const updatedJob = await prisma.jobRequirement.update({
    where: { id },
    data: {
      status: "CANCELLED",
      cancellationReason: reason,
    },
  });

  return updatedJob;
};

export const deleteJobRequirement = async (id, clientId) => {
  const existingJob = await getJobRequirementById(id, clientId);

  if (!["DRAFT", "OPEN"].includes(existingJob.status)) {
    throw new AppError("Only DRAFT or OPEN requirements can be deleted", 400);
  }

  // Soft delete
  await prisma.jobRequirement.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const closeJobRequirement = async (id, clientId) => {
  const existingJob = await getJobRequirementById(id, clientId);

  if (existingJob.status === "CANCELLED" || existingJob.status === "COMPLETED") {
    throw new AppError("Job requirement cannot be closed in its current status", 400);
  }

  const updatedJob = await prisma.jobRequirement.update({
    where: { id },
    data: { status: "COMPLETED" },
  });

  return updatedJob;
};

export const reopenJobRequirement = async (id, clientId) => {
  const existingJob = await getJobRequirementById(id, clientId);

  if (!["CANCELLED", "COMPLETED"].includes(existingJob.status)) {
    throw new AppError("Only cancelled or completed requirements can be reopened", 400);
  }

  const updatedJob = await prisma.jobRequirement.update({
    where: { id },
    data: { 
      status: "OPEN",
      cancellationReason: null, // Clear cancellation reason if any
    },
  });

  return updatedJob;
};

export const duplicateJobRequirement = async (id, clientId) => {
  const existingJob = await getJobRequirementById(id, clientId);

  const {
    id: _id,
    requirementCode: _requirementCode,
    status: _status,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    deletedAt: _deletedAt,
    cancellationReason: _cancellationReason,
    assignedCount: _assignedCount,
    requiredSkills,
    requiredLanguages,
    category,
    location,
    ...jobData
  } = existingJob;

  const newRequirementCode = generateRequirementCode();

  const newJob = await prisma.jobRequirement.create({
    data: {
      ...jobData,
      title: `${jobData.title} (Copy)`,
      clientId,
      requirementCode: newRequirementCode,
      status: "DRAFT",
      requiredSkills: requiredSkills && requiredSkills.length > 0
        ? {
            create: requiredSkills.map((rs) => ({
              skillId: rs.skillId,
              experienceYears: rs.experienceYears,
              proficiencyLevel: rs.proficiencyLevel,
              isMandatory: rs.isMandatory,
            })),
          }
        : undefined,
      requiredLanguages: requiredLanguages && requiredLanguages.length > 0
        ? {
            create: requiredLanguages.map((rl) => ({
              languageId: rl.languageId,
              proficiencyLevel: rl.proficiencyLevel,
              isMandatory: rl.isMandatory,
            })),
          }
        : undefined,
    },
    include: {
      requiredSkills: { include: { skill: true } },
      requiredLanguages: { include: { language: true } },
      category: true,
      location: true,
    },
  });

  return newJob;
};

export const requestWorkerReplacement = async (jobRequirementId, applicationId, clientId, reason) => {
  // Verify job requirement belongs to client
  await getJobRequirementById(jobRequirementId, clientId);

  const application = await prisma.jobApplication.findUnique({
    where: { id: applicationId },
  });

  if (!application || application.jobRequirementId !== jobRequirementId) {
    throw new AppError("Application not found for this job requirement", 404);
  }

  if (application.status !== "ACCEPTED") {
    throw new AppError("Can only request replacement for currently assigned workers", 400);
  }

  const updatedApplication = await prisma.jobApplication.update({
    where: { id: applicationId },
    data: {
      status: "REPLACEMENT_REQUESTED",
      notes: reason ? `${application.notes ? application.notes + '\n' : ''}Replacement Request: ${reason}` : application.notes,
    },
  });

  return updatedApplication;
};

export const requestWorkerRemoval = async (jobRequirementId, applicationId, clientId, reason) => {
  // Verify job requirement belongs to client
  await getJobRequirementById(jobRequirementId, clientId);

  const application = await prisma.jobApplication.findUnique({
    where: { id: applicationId },
  });

  if (!application || application.jobRequirementId !== jobRequirementId) {
    throw new AppError("Application not found for this job requirement", 404);
  }

  if (application.status !== "ACCEPTED") {
    throw new AppError("Can only request removal for currently assigned workers", 400);
  }

  const updatedApplication = await prisma.jobApplication.update({
    where: { id: applicationId },
    data: {
      status: "REMOVAL_REQUESTED",
      notes: reason ? `${application.notes ? application.notes + '\n' : ''}Removal Request: ${reason}` : application.notes,
    },
  });

  return updatedApplication;
};

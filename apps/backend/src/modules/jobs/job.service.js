import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

const checkIndependentWorker = async (userId) => {
  const worker = await prisma.worker.findUnique({
    where: { userId }
  });

  if (!worker) {
    throw new AppError("Worker profile not found", 404);
  }

  const activeAgencyWorker = await prisma.agencyWorker.findFirst({
    where: { workerId: worker.id, status: "ACTIVE" }
  });

  if (activeAgencyWorker) {
    throw new AppError("Agency workers cannot browse or apply for public jobs", 403);
  }

  return worker;
};

export const getPublicJobs = async (userId, { page = 1, limit = 10, search }) => {
  await checkIndependentWorker(userId);

  const skip = (page - 1) * limit;
  const where = {
    status: "OPEN",
    deletedAt: null
  };

  if (search) {
    where.title = { contains: search, mode: "insensitive" };
  }

  const [items, total] = await Promise.all([
    prisma.jobRequirement.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: {
        client: { select: { companyName: true, contactPerson: true } },
        location: { select: { name: true, district: true, state: true } },
        category: { select: { name: true } }
      }
    }),
    prisma.jobRequirement.count({ where })
  ]);

  return {
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getSavedJobs = async (userId) => {
  const worker = await checkIndependentWorker(userId);

  const savedJobs = await prisma.savedJob.findMany({
    where: { workerId: worker.id },
    include: {
      jobRequirement: {
        include: {
          client: { select: { companyName: true } },
          location: { select: { name: true, district: true } }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return savedJobs;
};

export const toggleSaveJob = async (userId, jobId) => {
  const worker = await checkIndependentWorker(userId);

  const job = await prisma.jobRequirement.findUnique({
    where: { id: jobId }
  });

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  const existingSave = await prisma.savedJob.findUnique({
    where: { jobRequirementId_workerId: { jobRequirementId: jobId, workerId: worker.id } }
  });

  if (existingSave) {
    await prisma.savedJob.delete({ where: { id: existingSave.id } });
    return { saved: false };
  } else {
    await prisma.savedJob.create({
      data: {
        jobRequirementId: jobId,
        workerId: worker.id
      }
    });
    return { saved: true };
  }
};

export const getApplications = async (userId) => {
  const worker = await checkIndependentWorker(userId);

  const applications = await prisma.jobApplication.findMany({
    where: { workerId: worker.id },
    include: {
      jobRequirement: {
        include: {
          client: { select: { companyName: true } },
          location: { select: { name: true, district: true } }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return applications;
};

export const applyForJob = async (userId, jobId, data) => {
  const worker = await checkIndependentWorker(userId);

  const job = await prisma.jobRequirement.findUnique({
    where: { id: jobId }
  });

  if (!job || job.status !== "OPEN") {
    throw new AppError("Job is not open for applications", 400);
  }

  const existingApp = await prisma.jobApplication.findUnique({
    where: { jobRequirementId_workerId: { jobRequirementId: jobId, workerId: worker.id } }
  });

  if (existingApp && existingApp.status !== "WITHDRAWN") {
    throw new AppError("You have already applied for this job", 400);
  }

  if (existingApp && existingApp.status === "WITHDRAWN") {
    return prisma.jobApplication.update({
      where: { id: existingApp.id },
      data: { status: "APPLIED", notes: data?.notes, appliedAt: new Date() }
    });
  }

  return prisma.jobApplication.create({
    data: {
      jobRequirementId: jobId,
      workerId: worker.id,
      notes: data?.notes
    }
  });
};

export const withdrawApplication = async (userId, jobId) => {
  const worker = await checkIndependentWorker(userId);

  const existingApp = await prisma.jobApplication.findUnique({
    where: { jobRequirementId_workerId: { jobRequirementId: jobId, workerId: worker.id } }
  });

  if (!existingApp) {
    throw new AppError("Application not found", 404);
  }

  return prisma.jobApplication.update({
    where: { id: existingApp.id },
    data: { status: "WITHDRAWN" }
  });
};

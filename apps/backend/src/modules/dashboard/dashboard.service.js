import crypto from "crypto";
import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

export const getWorkerDashboard = async (userId) => {
  let worker = await prisma.worker.findUnique({
    where: { userId },
    include: {
      agencies: {
        where: { status: "ACTIVE" },
        include: { agency: true },
        take: 1
      },
    }
  });

  if (!worker) {
    // Auto-heal: create the worker profile if missing
    worker = await prisma.worker.create({
      data: {
        userId,
        workerCode: `WRK-${crypto.randomBytes(4).toString("hex").toUpperCase()}`
      },
      include: {
        agencies: {
          include: { agency: true }
        },
      }
    });
  }

  // Calculate Profile Completion %
  const fieldsToCheck = [
    'firstName', 'lastName', 'phone', 'gender', 'dateOfBirth', 'profilePhoto', 'joiningDate'
  ];
  const filledFields = fieldsToCheck.filter(field => worker[field]);
  const profileCompletion = Math.round((filledFields.length / fieldsToCheck.length) * 100);

  const currentAgency = worker.agencies[0]?.agency || null;

  // No fake data as per request
  const activeJob = null;
  const upcomingJobs = [];
  const todayAttendance = null;
  const pendingPayments = null;
  const topStats = {
    totalCompletedWork: 0,
    totalRevenue: "₹0",
    pendingAmount: "₹0",
    totalHoursLogged: "0 hrs"
  };
  const notifications = [];
  const recentActivities = [];

  return {
    profile: {
      completion: profileCompletion,
      status: worker.employmentStatus,
      currentAgency: currentAgency ? currentAgency.agencyName : "Independent Worker",
    },
    activeJob,
    upcomingJobs,
    todayAttendance,
    pendingPayments,
    notifications,
    recentActivities,
    topStats
  };
};

export const getSuperAdminDashboard = async () => {
  // Placeholder for when we move Super Admin stats to backend
  // For now, returning empty so frontend uses its hardcoded stats
  return {
    message: "Super Admin dashboard data would go here"
  };
};

export const getClientDashboard = async (userId) => {
  let client = await prisma.client.findUnique({
    where: { userId },
  });

  if (!client) {
    // Auto-heal: create the client profile if missing
    client = await prisma.client.create({
      data: {
        userId,
        clientCode: `CLI-${crypto.randomBytes(4).toString("hex").toUpperCase()}`
      }
    });
  }

  // Get active requirements
  const activeRequirements = await prisma.jobRequirement.count({
    where: {
      clientId: client.id,
      status: { in: ["OPEN", "PARTIALLY_FILLED"] }
    }
  });

  // Get assigned workers
  const jobRequirements = await prisma.jobRequirement.findMany({
    where: { clientId: client.id },
    select: { assignedCount: true }
  });
  const assignedWorkers = jobRequirements.reduce((sum, req) => sum + (req.assignedCount || 0), 0);

  // Get upcoming jobs
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingJobsCount = await prisma.jobRequirement.count({
    where: {
      clientId: client.id,
      startDate: { gte: today },
      status: { notIn: ["CANCELLED", "COMPLETED", "DRAFT"] }
    }
  });

  // Recent activities
  const recentActivitiesList = await prisma.jobRequirement.findMany({
    where: { clientId: client.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      title: true,
      status: true,
      createdAt: true
    }
  });

  const recentActivities = recentActivitiesList.map(req => ({
    id: req.id,
    title: `Requirement "${req.title}" is now ${req.status}`,
    type: "REQUIREMENT_UPDATE",
    timestamp: req.createdAt
  }));

  // Notifications
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  return {
    topStats: {
      activeRequirements,
      assignedWorkers,
      upcomingJobs: upcomingJobsCount,
      pendingPayments: "₹0"
    },
    recentActivities,
    notifications,
    upcomingJobs: [],
    activeJob: null
  };
};

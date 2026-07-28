import crypto from "crypto";
import prisma from "../../config/prisma.js";

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
    worker = await prisma.worker.create({
      data: {
        userId,
        workerCode: `WRK-${crypto.randomBytes(4).toString("hex").toUpperCase()}`
      },
      include: {
        agencies: { include: { agency: true } },
      }
    });
  }

  const fieldsToCheck = ['firstName', 'lastName', 'phone', 'gender', 'dateOfBirth', 'profilePhoto', 'joiningDate'];
  const filledFields = fieldsToCheck.filter(field => worker[field]);
  const profileCompletion = Math.round((filledFields.length / fieldsToCheck.length) * 100);
  const currentAgency = worker.agencies[0]?.agency || null;

  return {
    profile: {
      completion: profileCompletion,
      status: worker.employmentStatus,
      currentAgency: currentAgency ? currentAgency.agencyName : "Independent Worker",
    },
    activeJob: null,
    upcomingJobs: [],
    todayAttendance: null,
    pendingPayments: null,
    notifications: [],
    recentActivities: [],
    topStats: {
      totalCompletedWork: 0,
      totalRevenue: "₹0",
      pendingAmount: "₹0",
      totalHoursLogged: "0 hrs"
    }
  };
};

export const getSuperAdminDashboard = async () => {
  const [
    totalWorkers,
    totalClients,
    totalAgencies,
    activeRequirements,
    openRequirements,
    completedRequirements,
    totalApplications
  ] = await Promise.all([
    prisma.worker.count({ where: { deletedAt: null } }),
    prisma.client.count({ where: { deletedAt: null } }),
    prisma.agency.count({ where: { deletedAt: null } }),
    prisma.jobRequirement.count({ where: { deletedAt: null, status: { in: ["OPEN", "PARTIALLY_FILLED"] } } }),
    prisma.jobRequirement.count({ where: { deletedAt: null, status: "OPEN" } }),
    prisma.jobRequirement.count({ where: { deletedAt: null, status: "COMPLETED" } }),
    prisma.jobApplication.count(),
  ]);

  return {
    topStats: {
      totalWorkers,
      totalClients,
      totalAgencies,
      activeRequirements,
      openRequirements,
      completedRequirements,
      totalApplications,
    }
  };
};

export const getClientDashboard = async (userId) => {
  let client = await prisma.client.findUnique({ where: { userId } });

  if (!client) {
    client = await prisma.client.create({
      data: {
        userId,
        clientCode: `CLI-${crypto.randomBytes(4).toString("hex").toUpperCase()}`
      }
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Run all DB queries in parallel for performance
  const [
    activeRequirements,
    openRequirements,
    ongoingJobs,
    completedJobs,
    allRequirementsForWorkers,
    upcomingJobsCount,
    recentActivitiesList,
    notifications
  ] = await Promise.all([
    // Active = OPEN + PARTIALLY_FILLED
    prisma.jobRequirement.count({
      where: { clientId: client.id, deletedAt: null, status: { in: ["OPEN", "PARTIALLY_FILLED"] } }
    }),
    // Open = only OPEN
    prisma.jobRequirement.count({
      where: { clientId: client.id, deletedAt: null, status: "OPEN" }
    }),
    // Ongoing = PARTIALLY_FILLED (workers assigned, job running)
    prisma.jobRequirement.count({
      where: { clientId: client.id, deletedAt: null, status: "PARTIALLY_FILLED" }
    }),
    // Completed jobs
    prisma.jobRequirement.count({
      where: { clientId: client.id, deletedAt: null, status: "COMPLETED" }
    }),
    // For counting assigned workers
    prisma.jobRequirement.findMany({
      where: { clientId: client.id, deletedAt: null },
      select: { assignedCount: true }
    }),
    // Upcoming = future start date, not cancelled/completed/draft
    prisma.jobRequirement.count({
      where: {
        clientId: client.id,
        deletedAt: null,
        startDate: { gte: today },
        status: { notIn: ["CANCELLED", "COMPLETED", "DRAFT"] }
      }
    }),
    // Recent activities from requirements (last 8)
    prisma.jobRequirement.findMany({
      where: { clientId: client.id, deletedAt: null },
      orderBy: { updatedAt: "desc" },
      take: 8,
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        assignedCount: true,
        requiredWorkers: true,
        createdAt: true,
        updatedAt: true,
        location: { select: { name: true } },
        category: { select: { name: true } }
      }
    }),
    // Notifications (last 6)
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 6
    })
  ]);

  const assignedWorkers = allRequirementsForWorkers.reduce((sum, r) => sum + (r.assignedCount || 0), 0);

  // Map activities with richer info
  const recentActivities = recentActivitiesList.map(req => ({
    id: req.id,
    title: req.title,
    status: req.status,
    priority: req.priority,
    assignedCount: req.assignedCount,
    requiredWorkers: req.requiredWorkers,
    location: req.location?.name || null,
    category: req.category?.name || null,
    timestamp: req.updatedAt,
    createdAt: req.createdAt
  }));

  return {
    topStats: {
      activeRequirements,
      openRequirements,
      assignedWorkers,
      ongoingJobs,
      completedJobs,
      upcomingJobs: upcomingJobsCount,
      pendingPayments: "₹0"   // payment module pending
    },
    recentActivities,
    notifications,
  };
};

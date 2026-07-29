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
      reviews: true,
      assignments: { where: { status: "COMPLETED" } }
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
        reviews: true,
        assignments: { where: { status: "COMPLETED" } }
      }
    });
  }

  const fieldsToCheck = ['firstName', 'lastName', 'phone', 'gender', 'dateOfBirth', 'profilePhoto', 'joiningDate'];
  const filledFields = fieldsToCheck.filter(field => worker[field]);
  const profileCompletion = Math.round((filledFields.length / fieldsToCheck.length) * 100);
  const currentAgency = worker.agencies[0]?.agency || null;

  const totalReviews = worker.reviews?.length || 0;
  const averageRating = totalReviews > 0 
    ? (worker.reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews).toFixed(1)
    : 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch assignments, attendance, payments
  const [activeJobs, upcomingJobs, attendanceRecords, payments, notificationsList] = await Promise.all([
    prisma.assignmentWorker.findMany({
      where: {
        workerId: worker.id,
        status: "ACTIVE",
        assignment: {
          startDate: { lte: new Date() },
          endDate: { gte: today }
        }
      },
      include: {
        assignment: { include: { siteLocation: true } }
      },
      take: 1
    }),
    prisma.assignmentWorker.findMany({
      where: {
        workerId: worker.id,
        status: "ACTIVE",
        assignment: {
          startDate: { gt: new Date() }
        }
      },
      include: {
        assignment: { include: { siteLocation: true } }
      },
      take: 2,
      orderBy: { assignment: { startDate: 'asc' } }
    }),
    prisma.workerAttendance.findMany({
      where: { workerId: worker.id }
    }),
    prisma.workerPayment.findMany({
      where: { workerId: worker.id }
    }),
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ]);

  const activeJob = activeJobs.length > 0 ? {
    title: activeJobs[0].assignment.title,
    location: activeJobs[0].assignment.siteLocation?.name || "Multiple / On-site",
    date: activeJobs[0].assignment.startDate,
    duration: "Ongoing"
  } : null;

  const upcomingJobsMapped = upcomingJobs.map(job => ({
    id: job.id,
    title: job.assignment.title,
    date: job.assignment.startDate,
    location: job.assignment.siteLocation?.name || "Multiple / On-site"
  }));

  const totalHoursLogged = attendanceRecords.reduce((sum, rec) => sum + (rec.totalHours || 0), 0);
  const presentCount = attendanceRecords.filter(rec => rec.status === 'PRESENT').length;
  const absentCount = attendanceRecords.filter(rec => rec.status === 'ABSENT').length;
  const onLeaveCount = attendanceRecords.filter(rec => rec.status === 'ON_LEAVE').length;

  const totalRevenue = payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingAmount = payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + (p.amount || 0), 0);

  return {
    profile: {
      completion: profileCompletion,
      status: worker.employmentStatus,
      verificationStatus: worker.profileStatus,
      currentAgency: currentAgency ? currentAgency.agencyName : "Independent Worker",
      currentAgencyId: currentAgency ? currentAgency.id : null,
      averageRating: parseFloat(averageRating),
      totalReviews,
      completedJobs: worker.assignments?.length || 0
    },
    activeJob,
    upcomingJobs: upcomingJobsMapped,
    todayAttendance: null,
    pendingPayments: pendingAmount > 0 ? `₹${pendingAmount}` : null,
    notifications: notificationsList,
    recentActivities: [],
    topStats: {
      totalCompletedWork: worker.assignments?.length || 0,
      totalRevenue: totalRevenue > 0 ? `₹${totalRevenue}` : "₹0",
      pendingAmount: pendingAmount > 0 ? `₹${pendingAmount}` : "₹0",
      totalHoursLogged: `${totalHoursLogged} hrs`,
      attendanceSummary: {
        present: presentCount,
        absent: absentCount,
        onLeave: onLeaveCount
      }
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

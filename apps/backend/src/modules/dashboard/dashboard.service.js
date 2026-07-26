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

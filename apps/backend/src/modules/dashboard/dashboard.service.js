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

  // Mocked Data for unbuilt modules
  const activeJob = {
    title: "Senior Plumber - Highrise Construction",
    client: "BuildTech Corp",
    location: "Downtown Site A",
    shift: "08:00 AM - 05:00 PM"
  };

  const upcomingJobs = [
    { id: 1, title: "Electrical Maintenance", date: "Tommorow, 09:00 AM", location: "Central Mall" },
    { id: 2, title: "HVAC Inspection", date: "May 25, 10:00 AM", location: "Tech Park Block B" }
  ];

  const todayAttendance = {
    status: "Checked In",
    timeIn: "07:55 AM",
    timeOut: null,
    totalHours: "3.5 hrs (so far)"
  };

  const pendingPayments = {
    amount: "₹12,450",
    dueDate: "May 30, 2025"
  };

  const notifications = [
    { id: 1, text: "Your timesheet for last week was approved.", time: "2 hours ago", type: "success" },
    { id: 2, text: "New shift assigned for tomorrow.", time: "5 hours ago", type: "info" }
  ];

  const recentActivities = [
    { id: 1, action: "Checked in at Downtown Site A", time: "Today, 07:55 AM" },
    { id: 2, action: "Completed task: Pipe Fitting", time: "Yesterday, 04:30 PM" }
  ];

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
    recentActivities
  };
};

export const getSuperAdminDashboard = async () => {
  // Placeholder for when we move Super Admin stats to backend
  // For now, returning empty so frontend uses its hardcoded stats
  return {
    message: "Super Admin dashboard data would go here"
  };
};

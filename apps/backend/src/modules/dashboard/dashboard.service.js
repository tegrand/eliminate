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
      reviews: true
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
        reviews: true
      }
    });
  }

  const fieldsToCheck = [
    'firstName', 'lastName', 'phone', 'dateOfBirth', 'profilePhoto', 
    'addressLine1', 'totalExperienceYears', 'expectedDailyWage', 'joiningDate'
  ];
  const filledFieldsCount = fieldsToCheck.filter(field => worker[field] !== null && worker[field] !== undefined && worker[field] !== '').length;
  
  const totalRequired = fieldsToCheck.length + 1; 
  const hasDocuments = worker.documents && worker.documents.length > 0;
  const currentFilled = filledFieldsCount + (hasDocuments ? 1 : 0);
  
  const profileCompletion = Math.round((currentFilled / totalRequired) * 100);
  const currentAgency = worker.agencies && worker.agencies.length > 0 ? worker.agencies[0].agency : null;

  const totalReviews = worker.reviews?.length || 0;
  const averageRating = totalReviews > 0 
    ? (worker.reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews).toFixed(1)
    : 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [attendanceRecords] = await Promise.all([
    prisma.workerAttendance.findMany({
      where: { workerId: worker.id }
    })
  ]);

  const totalHoursLogged = attendanceRecords.reduce((sum, rec) => sum + (rec.totalHours || 0), 0);
  const presentCount = attendanceRecords.filter(rec => rec.status === 'PRESENT').length;
  const absentCount = attendanceRecords.filter(rec => rec.status === 'ABSENT').length;
  const onLeaveCount = attendanceRecords.filter(rec => rec.status === 'ON_LEAVE').length;

  const getEmptyMonthlyData = () => [
    { name: 'Jan', value: 0 }, { name: 'Feb', value: 0 }, { name: 'Mar', value: 0 },
    { name: 'Apr', value: 0 }, { name: 'May', value: 0 }, { name: 'Jun', value: 0 },
    { name: 'Jul', value: 0 }, { name: 'Aug', value: 0 }, { name: 'Sep', value: 0 },
    { name: 'Oct', value: 0 }, { name: 'Nov', value: 0 }, { name: 'Dec', value: 0 }
  ];

  const chartData = {
    lineData: getEmptyMonthlyData(),
    donutData: [
      { name: 'Completed', value: 0 },
      { name: 'Active', value: 0 }
    ],
    donutTotal: 0
  };

  return {
    profile: {
      completion: profileCompletion,
      status: worker.employmentStatus,
      verificationStatus: worker.profileStatus,
      currentAgency: currentAgency ? currentAgency.agencyName : "Independent Worker",
      currentAgencyId: currentAgency ? currentAgency.id : null,
      averageRating: parseFloat(averageRating),
      totalReviews,
      completedJobs: 0
    },
    activeJob: null,
    upcomingJobs: [],
    completedJobs: [],
    todayAttendance: null,
    pendingPayments: null,
    recentActivities: [],
    topStats: {
      totalCompletedWork: 0,
      totalRevenue: "₹0",
      pendingAmount: "₹0",
      totalHoursLogged: `${totalHoursLogged} hrs`,
      activeAssignments: 0,
      attendanceSummary: {
        present: presentCount,
        absent: absentCount,
        onLeave: onLeaveCount
      }
    },
    chartData
  };
};

export const getSuperAdminDashboard = async () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);

  const [
    totalWorkers,
    totalClients,
    totalAgencies,
    recentUsers,
    usersThisYear
  ] = await Promise.all([
    prisma.worker.count({ where: { deletedAt: null } }),
    prisma.client.count({ where: { deletedAt: null } }),
    prisma.agency.count({ where: { deletedAt: null } }),
    prisma.user.findMany({
      where: { deletedAt: null, profileType: { not: "SUPER_ADMIN" } },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, email: true, profileType: true, status: true, createdAt: true, firstName: true, lastName: true }
    }),
    prisma.user.findMany({
      where: { deletedAt: null, createdAt: { gte: startOfYear }, profileType: { not: "SUPER_ADMIN" } },
      select: { createdAt: true, profileType: true }
    })
  ]);

  const getEmptyMonthlyData = () => [
    { name: 'Jan', value: 0 }, { name: 'Feb', value: 0 }, { name: 'Mar', value: 0 },
    { name: 'Apr', value: 0 }, { name: 'May', value: 0 }, { name: 'Jun', value: 0 },
    { name: 'Jul', value: 0 }, { name: 'Aug', value: 0 }, { name: 'Sep', value: 0 },
    { name: 'Oct', value: 0 }, { name: 'Nov', value: 0 }, { name: 'Dec', value: 0 }
  ];

  const monthlyRegistrations = getEmptyMonthlyData();
  usersThisYear.forEach(u => {
    const d = new Date(u.createdAt);
    monthlyRegistrations[d.getMonth()].value += 1;
  });

  const chartData = {
    lineData: monthlyRegistrations,
    donutData: [
      { name: 'Workers', value: totalWorkers },
      { name: 'Clients', value: totalClients },
      { name: 'Agencies', value: totalAgencies }
    ],
    donutTotal: totalWorkers + totalClients + totalAgencies
  };

  return {
    topStats: {
      totalWorkers,
      totalClients,
      totalAgencies,
      activeRequirements: 0,
      openRequirements: 0,
      completedRequirements: 0,
      totalApplications: 0,
      totalUsers: totalWorkers + totalClients + totalAgencies
    },
    recentUsers,
    chartData
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



  const getEmptyMonthlyData = () => [
    { name: 'Jan', value: 0 }, { name: 'Feb', value: 0 }, { name: 'Mar', value: 0 },
    { name: 'Apr', value: 0 }, { name: 'May', value: 0 }, { name: 'Jun', value: 0 },
    { name: 'Jul', value: 0 }, { name: 'Aug', value: 0 }, { name: 'Sep', value: 0 },
    { name: 'Oct', value: 0 }, { name: 'Nov', value: 0 }, { name: 'Dec', value: 0 }
  ];

  const chartData = {
    lineData: getEmptyMonthlyData(),
    donutData: [
      { name: 'Completed', value: 0 },
      { name: 'Active', value: 0 }
    ],
    donutTotal: 0
  };

  return {
    topStats: {
      totalSpent: "₹0",
      activeRequirements: 0,
      openRequirements: 0,
      assignedWorkers: 0,
      ongoingJobs: 0,
      completedJobs: 0,
      upcomingJobs: 0,
      pendingRequests: 0,
      pendingPayments: "₹0"
    },
    recentActivities: [],
    completedJobsList: [],
    chartData
  };
};

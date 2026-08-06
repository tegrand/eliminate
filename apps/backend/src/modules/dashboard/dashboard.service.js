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

  const fieldsToCheck = [
    'firstName', 'lastName', 'phone', 'dateOfBirth', 'profilePhoto', 
    'addressLine1', 'totalExperienceYears', 'expectedDailyWage', 'joiningDate'
  ];
  const filledFieldsCount = fieldsToCheck.filter(field => worker[field] !== null && worker[field] !== undefined && worker[field] !== '').length;
  
  // We consider documents as one "field" to be checked. If they have at least 1 document, it counts.
  const totalRequired = fieldsToCheck.length + 1; 
  const hasDocuments = worker.documents && worker.documents.length > 0;
  const currentFilled = filledFieldsCount + (hasDocuments ? 1 : 0);
  
  const profileCompletion = Math.round((currentFilled / totalRequired) * 100);
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
          status: "ACTIVE"
        }
      },
      include: {
        assignment: true
      },
      take: 1
    }),
    prisma.assignmentWorker.findMany({
      where: {
        workerId: worker.id,
        status: "ACTIVE",
        assignment: {
          startDate: { gt: new Date() },
          status: "ACTIVE"
        }
      },
      include: {
        assignment: true
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
    location: "Multiple / On-site",
    date: activeJobs[0].assignment.startDate,
    duration: "Ongoing"
  } : null;

  const upcomingJobsMapped = upcomingJobs.map(job => ({
    id: job.id,
    title: job.assignment.title,
    date: job.assignment.startDate,
    location: "Multiple / On-site"
  }));

  const totalHoursLogged = attendanceRecords.reduce((sum, rec) => sum + (rec.totalHours || 0), 0);
  const presentCount = attendanceRecords.filter(rec => rec.status === 'PRESENT').length;
  const absentCount = attendanceRecords.filter(rec => rec.status === 'ABSENT').length;
  const onLeaveCount = attendanceRecords.filter(rec => rec.status === 'ON_LEAVE').length;

  const completedAssignments = await prisma.assignmentWorker.findMany({
    where: {
      workerId: worker.id,
      assignment: { status: 'COMPLETED' }
    },
    include: { assignment: true }
  });

  const completedAssignmentsAmount = completedAssignments.reduce((sum, aw) => sum + (Number(aw.assignment.agreedRate) || 0), 0);

  const totalRevenue = payments.filter(p => p.status === 'COMPLETED').reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingPaymentsAmount = payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + (p.amount || 0), 0);
  
  const pendingAmount = pendingPaymentsAmount + Math.max(0, completedAssignmentsAmount - (totalRevenue + pendingPaymentsAmount));

  const getEmptyMonthlyData = () => [
    { name: 'Jan', value: 0 }, { name: 'Feb', value: 0 }, { name: 'Mar', value: 0 },
    { name: 'Apr', value: 0 }, { name: 'May', value: 0 }, { name: 'Jun', value: 0 },
    { name: 'Jul', value: 0 }, { name: 'Aug', value: 0 }, { name: 'Sep', value: 0 },
    { name: 'Oct', value: 0 }, { name: 'Nov', value: 0 }, { name: 'Dec', value: 0 }
  ];

  const currentYear = today.getFullYear();
  const monthlyRevenue = getEmptyMonthlyData();
  payments.filter(p => p.status === 'COMPLETED').forEach(p => {
    const date = new Date(p.createdAt); // Or p.paymentDate
    if (date.getFullYear() === currentYear) {
      monthlyRevenue[date.getMonth()].value += (p.amount || 0) / 1000; // in thousands (k)
    }
  });

  const chartData = {
    lineData: monthlyRevenue,
    donutData: [
      { name: 'Completed', value: worker.assignments?.length || 0 },
      { name: 'Active', value: activeJobs.length > 0 ? 1 : 0 }
    ],
    donutTotal: (worker.assignments?.length || 0) + (activeJobs.length > 0 ? 1 : 0)
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
      activeAssignments: activeJobs.length,
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
    activeRequirements,
    openRequirements,
    completedRequirements,
    totalApplications,
    recentUsers,
    usersThisYear
  ] = await Promise.all([
    prisma.worker.count({ where: { deletedAt: null } }),
    prisma.client.count({ where: { deletedAt: null } }),
    prisma.agency.count({ where: { deletedAt: null } }),
    prisma.jobRequirement.count({ where: { deletedAt: null, status: { in: ["OPEN", "PARTIALLY_FILLED"] } } }),
    prisma.jobRequirement.count({ where: { deletedAt: null, status: "OPEN" } }),
    prisma.jobRequirement.count({ where: { deletedAt: null, status: "COMPLETED" } }),
    prisma.jobApplication.count(),
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
      activeRequirements,
      openRequirements,
      completedRequirements,
      totalApplications,
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
    notifications,
    pendingHiringRequests,
    totalSpentResult,
    completedJobsList
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
    }),
    // Pending Hiring Requests
    prisma.hiringRequest.count({
      where: { clientId: client.id, status: "PENDING" }
    }),
    // Total spent
    prisma.paymentTransaction.aggregate({
      where: {
        status: "SUCCESS",
        hiringRequest: {
          clientId: client.id
        }
      },
      _sum: {
        amount: true
      }
    }),
    // Completed Jobs List (last 5)
    prisma.assignment.findMany({
      where: { clientId: client.id, status: "COMPLETED" },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        agreedRate: true,
        updatedAt: true,
        _count: {
          select: { assignedWorkers: true }
        }
      }
    })
  ]);

  const totalSpentAmt = totalSpentResult?._sum?.amount ? parseFloat(totalSpentResult._sum.amount.toString()) : 0;
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
    createdAt: req.createdAt
  }));

  const getEmptyMonthlyData = () => [
    { name: 'Jan', value: 0 }, { name: 'Feb', value: 0 }, { name: 'Mar', value: 0 },
    { name: 'Apr', value: 0 }, { name: 'May', value: 0 }, { name: 'Jun', value: 0 },
    { name: 'Jul', value: 0 }, { name: 'Aug', value: 0 }, { name: 'Sep', value: 0 },
    { name: 'Oct', value: 0 }, { name: 'Nov', value: 0 }, { name: 'Dec', value: 0 }
  ];

  const currentYear = today.getFullYear();
  const monthlyExpenditure = getEmptyMonthlyData();
  
  // We approximate expenditure based on job requirements for the client
  // Since there is no payment table for clients yet, we will count the number of jobs posted per month.
  // We'll scale this for demo purposes or just show raw counts in the graph
  const allReqs = await prisma.jobRequirement.findMany({
    where: { clientId: client.id, deletedAt: null },
    select: { createdAt: true }
  });
  
  allReqs.forEach(req => {
    const d = new Date(req.createdAt);
    if (d.getFullYear() === currentYear) {
      monthlyExpenditure[d.getMonth()].value += 1;
    }
  });

  const chartData = {
    lineData: monthlyExpenditure,
    donutData: [
      { name: 'Completed', value: completedJobs },
      { name: 'Active', value: activeRequirements }
    ],
    donutTotal: completedJobs + activeRequirements
  };

  return {
    topStats: {
      totalSpent: totalSpentAmt > 0 ? `₹${totalSpentAmt}` : "₹0",
      activeRequirements,
      openRequirements,
      assignedWorkers,
      ongoingJobs,
      completedJobs,
      upcomingJobs: upcomingJobsCount,
      pendingRequests: pendingHiringRequests,
      pendingPayments: "₹0"   // payment module pending
    },
    recentActivities,
    notifications,
    completedJobsList,
    chartData
  };
};

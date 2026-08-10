import crypto from "crypto";

import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

const generateWorkerCode = () => {
  return `WRK-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
};

const workerSelect = {
  id: true,
  userId: true,
  workerCode: true,
  firstName: true,
  lastName: true,
  phone: true,
  gender: true,
  dateOfBirth: true,
  profilePhoto: true,
  addressLine1: true,
  city: true,
  district: true,
  state: true,
  travelDistance: true,
  jobType: true,
  totalExperienceYears: true,
  employmentStatus: true,
  joiningDate: true,
  notes: true,
  expectedDailyWage: true,

  createdAt: true,
  updatedAt: true,
  profileStatus: true,
  documents: {
    select: {
      id: true,
      documentType: true,
      documentUrl: true,
      fileName: true,
      status: true,
      remarks: true,
      updatedAt: true
    }
  },
  skills: {
    select: {
      id: true,
      proficiencyLevel: true,
      isPrimary: true,
      experienceYears: true,
      skill: { select: { id: true, name: true, slug: true } }
    },
    orderBy: [{ isPrimary: "desc" }]
  },
  languages: {
    select: {
      id: true,
      proficiencyLevel: true,
      language: { select: { id: true, name: true } }
    }
  },
  user: {
    select: {
      id: true,
      email: true,
      status: true,
      profileType: true,
      firstName: true,
      lastName: true,
      avatar: true,
    },
  },
  reviews: {
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      reviewer: {
        select: {
          contactPerson: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  }
};

export const createWorker = async (userId, data) => {
  // Assuming authorization middleware handles basic access control,
  // we ensure here that the 1:1 relationship is preserved.
  const existingWorker = await prisma.worker.findUnique({
    where: { userId },
  });

  if (existingWorker) {
    throw new AppError("Worker profile already exists for this user", 409);
  }

  const workerCode = generateWorkerCode();

  const worker = await prisma.worker.create({
    data: {
      ...data,
      userId,
      workerCode,
    },
    select: workerSelect,
  });

  return worker;
};

export const getWorkers = async ({
  page = 1,
  limit = 10,
  search,
  status,
  sortBy = "createdAt",
  sortOrder = "desc",
  view,
  user,
}) => {
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
  };

  if (user?.profileType === "AGENCY") {
    const agencyUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { agency: true }
    });
    if (agencyUser?.agency) {
      where.agencies = {
        some: { agencyId: agencyUser.agency.id }
      };
    }
  }

  if (status) {
    where.profileStatus = status;
  }

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { workerCode: { contains: search, mode: "insensitive" } },
    ];
  }

  const [items, total, feeSetting] = await Promise.all([
    prisma.worker.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { [sortBy]: sortOrder },
      select: workerSelect,
    }),
    prisma.worker.count({ where }),
    prisma.systemSetting.findUnique({ where: { key: "platform_fee_percentage" } })
  ]);

  const platformFeePercentage = feeSetting && !isNaN(parseFloat(feeSetting.value)) ? parseFloat(feeSetting.value) : 0;

  const adjustedItems = items.map(worker => {
    if (worker.expectedDailyWage && platformFeePercentage > 0) {
      const wage = parseFloat(worker.expectedDailyWage);
      if (!isNaN(wage)) {
        worker.baseExpectedDailyWage = worker.expectedDailyWage;
        worker.platformFee = String(Math.round(wage * platformFeePercentage / 100));
        worker.expectedDailyWage = String(Math.round(wage + (wage * platformFeePercentage / 100)));
      }
    } else {
      worker.baseExpectedDailyWage = worker.expectedDailyWage;
      worker.platformFee = "0";
    }
    return worker;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const workerIds = adjustedItems.map(w => w.id);
  const todayAttendances = await prisma.workerAttendance.findMany({
    where: {
      workerId: { in: workerIds },
      date: today
    }
  });

  const attendanceMap = todayAttendances.reduce((acc, curr) => {
    acc[curr.workerId] = { status: curr.status, checkOutTime: curr.checkOutTime };
    return acc;
  }, {});

  const finalItems = adjustedItems.map(worker => {
    const att = attendanceMap[worker.id];
    worker.presentToday = att?.status === "PRESENT" && !att?.checkOutTime;
    return worker;
  });

  return {
    items: finalItems,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getWorkerById = async (id, user) => {
  const worker = await prisma.worker.findFirst({
    where: { id, deletedAt: null },
    select: workerSelect,
  });

  if (!worker) {
    throw new AppError("Worker not found", 404);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayAttendance = await prisma.workerAttendance.findFirst({
    where: {
      workerId: worker.id,
      date: today
    }
  });

  worker.presentToday = todayAttendance?.status === "PRESENT" && !todayAttendance?.checkOutTime;

  // RBAC Ownership Check
  if (user?.profileType === "WORKER" && worker.userId !== user.id) {
    throw new AppError("Forbidden: You cannot access another worker's profile.", 403);
  }

  // Only apply commission if user viewing is NOT the worker themselves
  if (user?.profileType !== "WORKER" || worker.userId !== user.id) {
    const feeSetting = await prisma.systemSetting.findUnique({ where: { key: "platform_fee_percentage" } });
    const platformFeePercentage = feeSetting && !isNaN(parseFloat(feeSetting.value)) ? parseFloat(feeSetting.value) : 0;
    
    if (worker.expectedDailyWage && platformFeePercentage > 0) {
      const wage = parseFloat(worker.expectedDailyWage);
      if (!isNaN(wage)) {
        worker.baseExpectedDailyWage = worker.expectedDailyWage;
        worker.platformFee = String(Math.round(wage * platformFeePercentage / 100));
        worker.expectedDailyWage = String(Math.round(wage + (wage * platformFeePercentage / 100)));
      }
    } else {
      worker.baseExpectedDailyWage = worker.expectedDailyWage;
      worker.platformFee = "0";
    }
  } else {
    // If worker viewing their own profile, still pass the base and calculated fee for display, but keep expectedDailyWage as base
    const feeSetting = await prisma.systemSetting.findUnique({ where: { key: "platform_fee_percentage" } });
    const platformFeePercentage = feeSetting && !isNaN(parseFloat(feeSetting.value)) ? parseFloat(feeSetting.value) : 0;
    
    if (worker.expectedDailyWage && platformFeePercentage > 0) {
      const wage = parseFloat(worker.expectedDailyWage);
      if (!isNaN(wage)) {
        worker.baseExpectedDailyWage = worker.expectedDailyWage;
        worker.platformFee = String(Math.round(wage * platformFeePercentage / 100));
      }
    } else {
      worker.baseExpectedDailyWage = worker.expectedDailyWage;
      worker.platformFee = "0";
    }
  }

  return worker;
};

export const updateWorker = async (id, data, user) => {
  const worker = await prisma.worker.findFirst({
    where: { id, deletedAt: null },
  });

  if (!worker) {
    throw new AppError("Worker not found", 404);
  }

  // RBAC Ownership Check
  if (user?.profileType === "WORKER" && worker.userId !== user.id) {
    throw new AppError("Forbidden: You cannot update another worker's profile.", 403);
  }

  const updatedWorker = await prisma.worker.update({
    where: { id },
    data,
    select: workerSelect,
  });

  return updatedWorker;
};

export const updateWorkerStatus = async (id, status) => {
  const worker = await prisma.worker.findFirst({
    where: { id, deletedAt: null },
  });

  if (!worker) {
    throw new AppError("Worker not found", 404);
  }

  const updatedWorker = await prisma.worker.update({
    where: { id },
    data: { profileStatus: status },
    select: workerSelect,
  });
  
  // Optionally sync with User status
  // let userStatus = "PENDING";
  // if (status === "APPROVED") userStatus = "ACTIVE";
  // else if (status === "REJECTED") userStatus = "REJECTED";
  // else if (status === "SUSPENDED") userStatus = "SUSPENDED";
  // 
  // await prisma.user.update({
  //   where: { id: worker.userId },
  //   data: { status: userStatus }
  // });

  return updatedWorker;
};

export const deleteWorker = async (id) => {
  const worker = await prisma.worker.findFirst({
    where: { id, deletedAt: null },
  });

  if (!worker) {
    throw new AppError("Worker not found", 404);
  }

  await prisma.worker.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return true;
};

export const getMyWorkerProfile = async (userId) => {
  const worker = await prisma.worker.findFirst({
    where: { userId, deletedAt: null },
    select: workerSelect,
  });

  if (!worker) {
    throw new AppError("Worker profile not found", 404);
  }

  return worker;
};

export const updateMyWorkerProfile = async (userId, data) => {
  const worker = await prisma.worker.findFirst({
    where: { userId, deletedAt: null },
  });

  if (!worker) {
    throw new AppError("Worker profile not found", 404);
  }

  const updatedWorker = await prisma.worker.update({
    where: { id: worker.id },
    data,
    select: workerSelect,
  });

  return updatedWorker;
};

export const getMyAgencies = async (userId) => {
  const worker = await getMyWorkerProfile(userId);
  
  const agencyWorkers = await prisma.agencyWorker.findMany({
    where: { workerId: worker.id },
    include: {
      agency: true
    },
    orderBy: { createdAt: 'desc' }
  });
  
  const invitations = agencyWorkers.filter(aw => aw.status === "INVITED");
  const activeAgencyWorker = agencyWorkers.find(aw => aw.status === "ACTIVE");
  
  return {
    invitations: invitations.map(inv => ({
      id: inv.id,
      agencyId: inv.agencyId,
      agencyName: inv.agency.agencyName,
      agencyCode: inv.agency.agencyCode,
      invitedAt: inv.createdAt
    })),
    activeAgency: activeAgencyWorker ? {
      id: activeAgencyWorker.id,
      agencyId: activeAgencyWorker.agencyId,
      agencyName: activeAgencyWorker.agency.agencyName,
      agencyCode: activeAgencyWorker.agency.agencyCode,
      contactPerson: activeAgencyWorker.agency.contactPerson,
      phone: activeAgencyWorker.agency.phone,
      email: activeAgencyWorker.agency.email,
      joinedAt: activeAgencyWorker.assignedAt
    } : null
  };
};

export const acceptAgencyInvitation = async (userId, agencyId) => {
  const worker = await getMyWorkerProfile(userId);
  
  // Check if already active in another agency
  const activeAgencyWorker = await prisma.agencyWorker.findFirst({
    where: { workerId: worker.id, status: "ACTIVE" }
  });
  
  if (activeAgencyWorker) {
    throw new AppError("You must leave your current agency before joining another", 400);
  }
  
  // Check if invitation exists
  const invitation = await prisma.agencyWorker.findUnique({
    where: { agencyId_workerId: { agencyId, workerId: worker.id } }
  });
  
  if (!invitation || invitation.status !== "INVITED") {
    throw new AppError("No valid invitation found for this agency", 404);
  }
  
  // Accept invitation
  await prisma.agencyWorker.update({
    where: { id: invitation.id },
    data: { 
      status: "ACTIVE",
      assignedAt: new Date()
    }
  });
  
  return getMyAgencies(userId);
};

export const rejectAgencyInvitation = async (userId, agencyId) => {
  const worker = await getMyWorkerProfile(userId);
  
  const invitation = await prisma.agencyWorker.findUnique({
    where: { agencyId_workerId: { agencyId, workerId: worker.id } }
  });
  
  if (!invitation || invitation.status !== "INVITED") {
    throw new AppError("No valid invitation found for this agency", 404);
  }
  
  // Reject invitation
  await prisma.agencyWorker.update({
    where: { id: invitation.id },
    data: { status: "REJECTED" }
  });
  
  return getMyAgencies(userId);
};

export const leaveAgency = async (userId, agencyId) => {
  const worker = await getMyWorkerProfile(userId);
  
  const activeAgencyWorker = await prisma.agencyWorker.findUnique({
    where: { agencyId_workerId: { agencyId, workerId: worker.id } }
  });
  
  if (!activeAgencyWorker || activeAgencyWorker.status !== "ACTIVE") {
    throw new AppError("You are not active in this agency", 400);
  }
  
  // Request to leave agency
  await prisma.agencyWorker.update({
    where: { id: activeAgencyWorker.id },
    data: { status: "LEAVE_REQUESTED" }
  });
  
  return getMyAgencies(userId);
};

import * as hiringRequestService from "../hiring-requests/hiring-request.service.js";

export const getMyJobInvitations = async (userId) => {
  const worker = await getMyWorkerProfile(userId);
  return prisma.hiringRequest.findMany({
    where: { targetWorkerId: worker.id, status: 'PENDING' },
    include: {
      client: true,
      agency: true,
      jobRequirement: true
    }
  });
};

export const acceptJobInvitation = async (userId, id, user) => {
  const worker = await getMyWorkerProfile(userId);
  const req = await prisma.hiringRequest.findFirst({ where: { id, targetWorkerId: worker.id, status: 'PENDING' } });
  if (!req) throw new AppError('Invitation not found', 404);

  // Call the actual service that handles all the assignment creation logic
  return hiringRequestService.updateHiringRequestStatus(id, 'ACCEPTED', user);
};

export const rejectJobInvitation = async (userId, id, user) => {
  const worker = await getMyWorkerProfile(userId);
  const req = await prisma.hiringRequest.findFirst({ where: { id, targetWorkerId: worker.id, status: 'PENDING' } });
  if (!req) throw new AppError('Invitation not found', 404);
  
  return hiringRequestService.updateHiringRequestStatus(id, 'REJECTED', user);
};

export const getWorkerAvailability = async (workerId) => {
  const worker = await prisma.worker.findUnique({ where: { id: workerId } });
  if (!worker) throw new AppError("Worker not found", 404);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Based on user request, having active assignments should not make the worker "Not Available"
  // So we return an empty array here instead of the actual booked dates.
  /*
  const activeAssignments = await prisma.assignmentWorker.findMany({
    where: {
      workerId,
      status: "ACTIVE",
      assignment: {
        status: "ACTIVE",
        endDate: { gte: today }
      }
    },
    include: {
      assignment: {
        select: {
          startDate: true,
          endDate: true,
          title: true
        }
      }
    }
  });

  const bookedDates = activeAssignments
    .filter(a => a.assignment.startDate && a.assignment.endDate)
    .map(a => ({
      startDate: a.assignment.startDate,
      endDate: a.assignment.endDate,
      title: a.assignment.title
    }));
  */

  return [];
};


export const createAgencyWorkerSingle = async (userId, data) => {
  const agencyUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { agency: true }
  });

  if (!agencyUser?.agency) {
    throw new AppError("Agency profile not found", 404);
  }

  const worker = await prisma.worker.create({
    data: {
      workerCode: generateWorkerCode(),
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      expectedDailyWage: data.expectedDailyWage,
      jobType: data.skill,
      city: data.city,
      district: data.district,
      state: data.state,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      addressLine1: data.addressLine1,
      totalExperienceYears: data.totalExperienceYears,
      joiningDate: data.joiningDate,
      profileStatus: "APPROVED",
      agencies: {
        create: {
          agencyId: agencyUser.agency.id,
          status: "ACTIVE"
        }
      }
    },
    select: workerSelect,
  });

  return worker;
};

export const createAgencyWorkerBulk = async (userId, workersData) => {
  const agencyUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { agency: true }
  });

  if (!agencyUser?.agency) {
    throw new AppError("Agency profile not found", 404);
  }

  const createdWorkers = [];
  
  for (const data of workersData) {
    const worker = await prisma.worker.create({
      data: {
        workerCode: generateWorkerCode(),
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        expectedDailyWage: data.expectedDailyWage,
        jobType: data.skill,
        city: data.city,
        district: data.district,
        state: data.state,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        addressLine1: data.addressLine1,
        totalExperienceYears: data.totalExperienceYears,
        joiningDate: data.joiningDate,
        profileStatus: "APPROVED",
        agencies: {
          create: {
            agencyId: agencyUser.agency.id,
            status: "ACTIVE"
          }
        }
      },
    });
    createdWorkers.push(worker);
  }

  return { count: createdWorkers.length };
};


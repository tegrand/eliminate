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
  employmentStatus: true,
  joiningDate: true,
  notes: true,
  addressLine1: true,
  addressLine2: true,
  city: true,
  state: true,
  country: true,
  postalCode: true,
  emergencyContactName: true,
  emergencyContactPhone: true,
  emergencyContactRelation: true,
  experienceYears: true,
  expectedSalary: true,
  preferredLocations: true,
  aadhaarNumber: true,
  panNumber: true,
  bankAccountNumber: true,
  bankIfsc: true,
  bankName: true,
  resumeUrl: true,
  aadhaarUrl: true,
  panUrl: true,
  bankPassbookUrl: true,
  experienceCertificates: true,
  skillCertificates: true,
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
    },
  },
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
}) => {
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
  };

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

  const [items, total] = await Promise.all([
    prisma.worker.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { [sortBy]: sortOrder },
      select: workerSelect,
    }),
    prisma.worker.count({ where }),
  ]);

  return {
    items,
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

  // RBAC Ownership Check
  if (user?.profileType === "WORKER" && worker.userId !== user.id) {
    throw new AppError("Forbidden: You cannot access another worker's profile.", 403);
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
\ n e x p o r t   c o n s t   g e t M y J o b I n v i t a t i o n s   =   a s y n c   ( u s e r I d )   = >   { \ n     c o n s t   w o r k e r   =   a w a i t   g e t M y W o r k e r P r o f i l e ( u s e r I d ) ; \ n     r e t u r n   p r i s m a . h i r i n g R e q u e s t . f i n d M a n y ( { \ n         w h e r e :   {   t a r g e t W o r k e r I d :   w o r k e r . i d ,   s t a t u s :   ' P E N D I N G '   } , \ n         i n c l u d e :   { \ n             c l i e n t :   t r u e , \ n             a g e n c y :   t r u e , \ n             j o b R e q u i r e m e n t :   t r u e \ n         } \ n     } ) ; \ n } ; \ n \ n e x p o r t   c o n s t   a c c e p t J o b I n v i t a t i o n   =   a s y n c   ( u s e r I d ,   i d )   = >   { \ n     c o n s t   w o r k e r   =   a w a i t   g e t M y W o r k e r P r o f i l e ( u s e r I d ) ; \ n     c o n s t   r e q   =   a w a i t   p r i s m a . h i r i n g R e q u e s t . f i n d F i r s t ( {   w h e r e :   {   i d ,   t a r g e t W o r k e r I d :   w o r k e r . i d ,   s t a t u s :   ' P E N D I N G '   }   } ) ; \ n     i f   ( ! r e q )   t h r o w   n e w   A p p E r r o r ( ' I n v i t a t i o n   n o t   f o u n d ' ,   4 0 4 ) ; \ n     r e t u r n   p r i s m a . h i r i n g R e q u e s t . u p d a t e ( {   w h e r e :   {   i d   } ,   d a t a :   {   s t a t u s :   ' A C C E P T E D '   }   } ) ; \ n } ; \ n \ n e x p o r t   c o n s t   r e j e c t J o b I n v i t a t i o n   =   a s y n c   ( u s e r I d ,   i d )   = >   { \ n     c o n s t   w o r k e r   =   a w a i t   g e t M y W o r k e r P r o f i l e ( u s e r I d ) ; \ n     c o n s t   r e q   =   a w a i t   p r i s m a . h i r i n g R e q u e s t . f i n d F i r s t ( {   w h e r e :   {   i d ,   t a r g e t W o r k e r I d :   w o r k e r . i d ,   s t a t u s :   ' P E N D I N G '   }   } ) ; \ n     i f   ( ! r e q )   t h r o w   n e w   A p p E r r o r ( ' I n v i t a t i o n   n o t   f o u n d ' ,   4 0 4 ) ; \ n     r e t u r n   p r i s m a . h i r i n g R e q u e s t . u p d a t e ( {   w h e r e :   {   i d   } ,   d a t a :   {   s t a t u s :   ' R E J E C T E D '   }   } ) ; \ n } ; \ n  
 
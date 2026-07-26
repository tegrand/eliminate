import { z } from "zod";

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const createWorkerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100, "First name is too long"),
  lastName: z.string().trim().min(1, "Last name is required").max(100, "Last name is too long"),
  phone: z.string().trim().regex(phoneRegex, "Invalid phone number format").optional(),
  gender: z.string().trim().min(1, "Gender is required").max(50).optional(),
  dateOfBirth: z.coerce.date().max(new Date(), "Birth date cannot be in the future").optional(),
  joiningDate: z.coerce.date().optional(),
  notes: z.string().trim().max(2000, "Notes are too long").optional(),
}).strict("Unknown fields are not allowed");

export const updateWorkerSchema = z.object({
  firstName: z.string().trim().min(1, "First name cannot be empty").max(100, "First name is too long").optional(),
  lastName: z.string().trim().min(1, "Last name cannot be empty").max(100, "Last name is too long").optional(),
  phone: z.string().trim().regex(phoneRegex, "Invalid phone number format").optional(),
  gender: z.string().trim().min(1, "Gender cannot be empty").max(50).optional(),
  dateOfBirth: z.coerce.date().max(new Date(), "Birth date cannot be in the future").optional(),
  joiningDate: z.coerce.date().optional(),
  notes: z.string().trim().max(2000, "Notes are too long").optional(),
  employmentStatus: z.enum(["ACTIVE", "BUSY", "INACTIVE", "ON_LEAVE", "TERMINATED"]).optional(),
  
  // Profile Additions
  addressLine1: z.string().trim().optional(),
  addressLine2: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  country: z.string().trim().optional(),
  postalCode: z.string().trim().optional(),
  emergencyContactName: z.string().trim().optional(),
  emergencyContactPhone: z.string().trim().optional(),
  emergencyContactRelation: z.string().trim().optional(),
  
  experienceYears: z.number().int().min(0).optional().nullable(),
  expectedSalary: z.string().trim().optional(),
  preferredLocations: z.array(z.string()).optional().nullable(),
  
  aadhaarNumber: z.string().trim().optional(),
  panNumber: z.string().trim().optional(),
  bankAccountNumber: z.string().trim().optional(),
  bankIfsc: z.string().trim().optional(),
  bankName: z.string().trim().optional(),
  
  resumeUrl: z.string().url().optional().nullable(),
  aadhaarUrl: z.string().url().optional().nullable(),
  panUrl: z.string().url().optional().nullable(),
  bankPassbookUrl: z.string().url().optional().nullable(),
  experienceCertificates: z.any().optional().nullable(),
  skillCertificates: z.any().optional().nullable(),
}).strict("Unknown fields are not allowed").refine(
  (data) => Object.keys(data).length > 0,
  "Update payload cannot be empty"
);

export const workerIdParamSchema = z.object({
  id: z.string().uuid("Invalid worker ID format"),
});

export const listWorkersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  status: z.enum(["ACTIVE", "BUSY", "INACTIVE", "ON_LEAVE", "TERMINATED"]).optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "firstName", "lastName", "joiningDate"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
}).strict("Unknown query parameters are not allowed");

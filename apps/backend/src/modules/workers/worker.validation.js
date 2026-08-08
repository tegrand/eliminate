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
  lastName: z.string().trim().max(100, "Last name is too long").optional().nullable(),
  phone: z.string().trim().regex(phoneRegex, "Invalid phone number format").optional(),
  gender: z.string().trim().min(1, "Gender cannot be empty").max(50).optional(),
  dateOfBirth: z.coerce.date().max(new Date(), "Birth date cannot be in the future").optional(),
  addressLine1: z.string().trim().max(500, "Address is too long").optional(),
  totalExperienceYears: z.coerce.number().min(0, "Experience cannot be negative").max(100, "Invalid experience years").optional(),
  joiningDate: z.coerce.date().optional(),
  notes: z.string().trim().max(2000, "Notes are too long").optional(),
  employmentStatus: z.enum(["ACTIVE", "BUSY", "INACTIVE", "ON_LEAVE", "TERMINATED"]).optional(),
  
  city: z.string().trim().max(100).optional().nullable(),
  district: z.string().trim().max(100).optional().nullable(),
  state: z.string().trim().max(100).optional().nullable(),
  travelDistance: z.coerce.number().min(1).max(500).optional().nullable(),
  jobType: z.string().trim().max(50).optional().nullable(),

  expectedDailyWage: z.string().trim().optional(),
}).strict("Unknown fields are not allowed").refine(
  (data) => Object.keys(data).length > 0,
  "Update payload cannot be empty"
);

export const workerIdParamSchema = z.object({
  id: z.string().uuid("Invalid worker ID format"),
});

export const updateWorkerStatusSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "SUSPENDED"], {
    errorMap: () => ({ message: "Invalid status value" })
  })
}).strict();

export const listWorkersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "SUSPENDED", "ALL"]).optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "firstName", "lastName", "joiningDate"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  view: z.string().optional(),
}).strict("Unknown query parameters are not allowed");



export const createAgencyWorkerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().max(100).optional().nullable(),
  phone: z.string().trim().regex(phoneRegex, "Invalid phone number format").optional().nullable(),
  expectedDailyWage: z.coerce.string().optional().nullable(),
  skill: z.string().optional().nullable(),
  city: z.string().trim().max(100).optional().nullable(),
  district: z.string().trim().max(100).optional().nullable(),
  state: z.string().trim().max(100).optional().nullable(),
  gender: z.string().trim().max(50).optional().nullable(),
  dateOfBirth: z.coerce.date().max(new Date(), "Birth date cannot be in the future").optional().nullable(),
  addressLine1: z.string().trim().max(500).optional().nullable(),
  totalExperienceYears: z.coerce.number().min(0).max(100).optional().nullable(),
  joiningDate: z.coerce.date().optional().nullable(),
}).strict();

export const createAgencyWorkerBulkSchema = z.object({
  workers: z.array(createAgencyWorkerSchema).min(1, "At least one worker is required"),
});

import { z } from "zod";

const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Standard E.164 phone number format

export const createWorkerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  phone: z.string().trim().regex(phoneRegex, "Invalid phone number format").optional(),
  gender: z.string().trim().max(20).optional(),
  dateOfBirth: z.coerce
    .date()
    .max(new Date(), "Birth date cannot be in the future")
    .optional(),
  joiningDate: z.coerce.date().optional(),
  notes: z.string().trim().max(2000).optional(),
}).strict("Unknown fields are not allowed");

export const updateWorkerSchema = createWorkerSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Update payload cannot be empty",
  });

export const workerIdParamSchema = z.object({
  id: z.string().uuid("Invalid Worker ID format"),
});

export const listWorkersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "ON_LEAVE", "TERMINATED"]).optional(),
  sortBy: z.enum([
    "createdAt",
    "updatedAt",
    "firstName",
    "lastName",
    "joiningDate",
  ]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
}).strict("Unknown query parameters are not allowed");

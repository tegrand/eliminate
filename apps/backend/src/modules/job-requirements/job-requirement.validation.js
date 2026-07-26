import { z } from "zod";

const timeFormatRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const baseSchema = {
  clientId: z.string().uuid("Invalid client ID format"),
  title: z.string().trim().min(3).max(255),
  description: z.string().trim().max(5000).optional().nullable(),
  categoryId: z.string().uuid("Invalid category ID format").optional().nullable(),
  locationId: z.string().uuid("Invalid location ID format").optional().nullable(),
  requiredWorkers: z.number().int().min(1, "At least 1 worker is required").default(1),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  startTime: z.string().regex(timeFormatRegex, "Invalid time format (HH:mm)").optional().nullable(),
  endTime: z.string().regex(timeFormatRegex, "Invalid time format (HH:mm)").optional().nullable(),
  salaryType: z.enum(["HOURLY", "DAILY", "MONTHLY", "FIXED"]).optional().nullable(),
  salaryAmount: z.number().min(0, "Salary amount cannot be negative").optional().nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  status: z.enum(["DRAFT", "OPEN", "PARTIALLY_FILLED", "FILLED", "COMPLETED", "CANCELLED"]).default("DRAFT"),
  notes: z.string().trim().max(2000).optional().nullable(),
};

export const createJobRequirementSchema = z.object(baseSchema).strict("Unknown fields are not allowed")
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    { message: "End date cannot be before start date", path: ["endDate"] }
  )
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        // Compare HH:mm strings directly
        return data.endTime > data.startTime;
      }
      return true;
    },
    { message: "End time must be after start time", path: ["endTime"] }
  );

export const updateJobRequirementSchema = z.object({
  title: baseSchema.title.optional(),
  description: baseSchema.description,
  categoryId: baseSchema.categoryId,
  locationId: baseSchema.locationId,
  requiredWorkers: baseSchema.requiredWorkers.optional(),
  startDate: baseSchema.startDate,
  endDate: baseSchema.endDate,
  startTime: baseSchema.startTime,
  endTime: baseSchema.endTime,
  salaryType: baseSchema.salaryType,
  salaryAmount: baseSchema.salaryAmount,
  priority: baseSchema.priority.optional(),
  status: baseSchema.status.optional(),
  notes: baseSchema.notes,
}).strict("Unknown fields are not allowed")
  .refine(
    (data) => Object.keys(data).length > 0,
    "Update payload cannot be empty"
  )
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    { message: "End date cannot be before start date", path: ["endDate"] }
  )
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return data.endTime > data.startTime;
      }
      return true;
    },
    { message: "End time must be after start time", path: ["endTime"] }
  );

export const jobRequirementIdParamSchema = z.object({
  id: z.string().uuid("Invalid job requirement ID format"),
});

export const jobRequirementListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "title", "startDate", "priority", "status"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  clientId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  locationId: z.string().uuid().optional(),
  status: z.enum(["DRAFT", "OPEN", "PARTIALLY_FILLED", "FILLED", "COMPLETED", "CANCELLED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
});

import { z } from "zod";

export const createHiringRequestSchema = z.object({
  targetAgencyId: z.string().uuid("Invalid agency ID").optional(),
  targetWorkerId: z.string().uuid("Invalid worker ID").optional(),
  jobRequirementId: z.string().uuid("Invalid job requirement ID").optional(),
  title: z.string().trim().min(1, "Title is required").max(100),
  description: z.string().trim().max(1000).optional(),
  proposedRate: z.number().min(0).optional(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  notes: z.string().trim().max(1000).optional(),
  location: z.string().trim().max(500).optional(),
  phoneNumber: z.string().trim().max(20).optional(),
}).refine(data => data.targetAgencyId || data.targetWorkerId, {
  message: "Either targetAgencyId or targetWorkerId must be provided",
  path: ["targetAgencyId"]
});

export const updateHiringRequestStatusSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED", "CANCELLED"], { required_error: "Status is required" }),
});

export const hiringRequestIdParamSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
});

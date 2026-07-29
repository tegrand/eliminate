import { z } from "zod";

export const assignWorkerSchema = z.object({
  workerId: z.string().uuid("Invalid worker ID"),
});

export const updateAssignmentStatusSchema = z.object({
  status: z.enum(["ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"], { required_error: "Status is required" }),
});

export const assignmentIdParamSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
});

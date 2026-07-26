import { z } from "zod";

export const assignWorkerSchema = z.object({
  agencyId: z.string().uuid("Invalid agency ID format"),
  workerId: z.string().uuid("Invalid worker ID format"),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
  notes: z.string().trim().max(1000).optional(),
}).strict("Unknown fields are not allowed");

export const updateAssignmentSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
  notes: z.string().trim().max(1000).optional(),
}).strict("Unknown fields are not allowed").refine(
  (data) => Object.keys(data).length > 0,
  "Update payload cannot be empty"
);

export const deleteAssignmentSchema = z.object({
  agencyId: z.string().uuid("Invalid agency ID format"),
  workerId: z.string().uuid("Invalid worker ID format"),
});

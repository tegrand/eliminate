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

export const markAssignmentAttendanceSchema = z.object({
  workerId: z.string().uuid("Invalid worker ID"),
  status: z.enum(["PRESENT", "ABSENT", "HALF_DAY", "ON_LEAVE"]),
  date: z.coerce.date().optional(),
}).strict();

export const checkoutAssignmentAttendanceSchema = z.object({
  workerId: z.string().uuid("Invalid worker ID"),
  date: z.coerce.date().optional(),
}).strict();

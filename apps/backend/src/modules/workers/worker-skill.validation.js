import { z } from "zod";

export const assignSkillSchema = z.object({
  workerId: z.string().uuid("Invalid worker ID format"),
  skillId: z.string().uuid("Invalid skill ID format"),
  experienceYears: z.number().int().min(0).max(60).optional().nullable(),
  proficiencyLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]),
  isPrimary: z.boolean().optional(),
}).strict("Unknown fields are not allowed");

export const updateWorkerSkillSchema = z.object({
  experienceYears: z.number().int().min(0).max(60).optional().nullable(),
  proficiencyLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]).optional(),
  isPrimary: z.boolean().optional(),
}).strict("Unknown fields are not allowed").refine(
  (data) => Object.keys(data).length > 0,
  "Update payload cannot be empty"
);

export const deleteWorkerSkillSchema = z.object({
  workerId: z.string().uuid("Invalid worker ID format"),
  skillId: z.string().uuid("Invalid skill ID format"),
});

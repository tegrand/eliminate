import { z } from "zod";

export const assignLanguageSchema = z.object({
  workerId: z.string().uuid("Invalid worker ID format").optional(),
  languageId: z.string().uuid("Invalid language ID format"),
  proficiencyLevel: z.enum(["BASIC", "CONVERSATIONAL", "PROFESSIONAL", "NATIVE"]),
  canRead: z.boolean().optional(),
  canWrite: z.boolean().optional(),
  canSpeak: z.boolean().optional(),
  isPrimary: z.boolean().optional(),
}).strict("Unknown fields are not allowed");

export const updateWorkerLanguageSchema = z.object({
  proficiencyLevel: z.enum(["BASIC", "CONVERSATIONAL", "PROFESSIONAL", "NATIVE"]).optional(),
  canRead: z.boolean().optional(),
  canWrite: z.boolean().optional(),
  canSpeak: z.boolean().optional(),
  isPrimary: z.boolean().optional(),
}).strict("Unknown fields are not allowed").refine(
  (data) => Object.keys(data).length > 0,
  "Update payload cannot be empty"
);

export const deleteWorkerLanguageSchema = z.object({
  workerId: z.string().uuid("Invalid worker ID format"),
  languageId: z.string().uuid("Invalid language ID format"),
});

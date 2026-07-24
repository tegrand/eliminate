import { z } from "zod";

export const createLanguageSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  code: z.string().trim().toUpperCase().regex(/^[A-Z0-9-]+$/, "Code must contain only uppercase letters, numbers, and hyphens").min(2).max(20),
  description: z.string().trim().max(1000).optional(),
  isActive: z.boolean().optional(),
}).strict("Unknown fields are not allowed");

export const updateLanguageSchema = z.object({
  name: z.string().trim().min(1, "Name cannot be empty").max(100).optional(),
  code: z.string().trim().toUpperCase().regex(/^[A-Z0-9-]+$/, "Code must contain only uppercase letters, numbers, and hyphens").min(2).max(20).optional(),
  description: z.string().trim().max(1000).optional(),
  isActive: z.boolean().optional(),
}).strict("Unknown fields are not allowed").refine(
  (data) => Object.keys(data).length > 0,
  "Update payload cannot be empty"
);

export const languageIdParamSchema = z.object({
  id: z.string().uuid("Invalid language ID format"),
});

export const listLanguagesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "name", "code"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
}).strict("Unknown query parameters are not allowed");

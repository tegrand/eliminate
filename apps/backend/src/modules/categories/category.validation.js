import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens").min(1).max(100),
  description: z.string().trim().max(1000).optional(),
  isActive: z.boolean().optional(),
}).strict("Unknown fields are not allowed");

export const updateCategorySchema = z.object({
  name: z.string().trim().min(1, "Name cannot be empty").max(100).optional(),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens").min(1).max(100).optional(),
  description: z.string().trim().max(1000).optional(),
  isActive: z.boolean().optional(),
}).strict("Unknown fields are not allowed").refine(
  (data) => Object.keys(data).length > 0,
  "Update payload cannot be empty"
);

export const categoryIdParamSchema = z.object({
  id: z.string().uuid("Invalid category ID format"),
});

export const listCategoriesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "name", "slug"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
}).strict("Unknown query parameters are not allowed");

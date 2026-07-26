import { z } from "zod";

export const categorySchema = z.object({
  code: z.string().min(1, "Category Code is required"),
  name: z.string().min(1, "Category Name is required"),
  description: z.string().optional(),
  status: z.string().min(1, "Status is required"),
});

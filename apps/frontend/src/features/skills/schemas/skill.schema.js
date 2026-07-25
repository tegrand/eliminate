import { z } from "zod";

export const skillSchema = z.object({
  code: z.string().min(1, "Skill Code is required"),
  name: z.string().min(1, "Skill Name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  status: z.string().min(1, "Status is required"),
});

import { z } from "zod";

export const jobRequirementFilterSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  client: z.string().optional(),
  priority: z.string().optional(),
  dateRange: z.string().optional(),
});

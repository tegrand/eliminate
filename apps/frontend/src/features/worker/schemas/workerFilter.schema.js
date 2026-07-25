import { z } from "zod";

export const workerFilterSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  agency: z.string().optional(),
  skill: z.string().optional(),
});

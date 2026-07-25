import { z } from "zod";

export const clientFilterSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  district: z.string().optional(),
});

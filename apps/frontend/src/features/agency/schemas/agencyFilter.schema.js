import { z } from "zod";

export const agencyFilterSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  district: z.string().optional(),
});

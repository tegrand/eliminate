import { z } from "zod";

export const locationSchema = z.object({
  code: z.string().min(1, "Location Code is required"),
  name: z.string().min(1, "Location Name is required"),
  district: z.string().min(1, "District is required"),
  state: z.string().min(1, "State is required"),
  status: z.string().min(1, "Status is required"),
});

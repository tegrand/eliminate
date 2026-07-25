import { z } from "zod";

export const languageSchema = z.object({
  code: z.string().min(1, "Language Code is required"),
  name: z.string().min(1, "Language Name is required"),
  status: z.string().min(1, "Status is required"),
});

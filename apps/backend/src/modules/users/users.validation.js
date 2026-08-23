import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name cannot be empty").max(100).optional(),
  lastName: z.string().max(100).optional().nullable(),
  phone: z.string().min(1, "Phone number cannot be empty").max(20).optional(),
  avatar: z.string().optional(),
  timezone: z.string().min(1, "Timezone cannot be empty").max(50).optional(),
  language: z.string().min(2, "Language must be at least 2 characters").max(10).optional(),
}).strict("Unknown fields are not allowed");

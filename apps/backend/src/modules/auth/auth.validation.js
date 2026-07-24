import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),

  profileType: z.enum(["CLIENT", "AGENCY", "WORKER"]),

  role: z.enum(["CLIENT", "AGENCY", "WORKER"]),
});

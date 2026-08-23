import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const passwordMessage = "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address").transform((e) => e.toLowerCase().trim()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100)
    .regex(passwordRegex, passwordMessage),
  accountType: z.enum(["SUPER_ADMIN", "CLIENT", "AGENCY", "WORKER"]),
  contactPerson: z.string().trim().optional(),
  phone: z.string().optional(),
  
  // Worker fields
  fullName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  primarySkill: z.string().optional(),
  expectedDailyWage: z.string().optional(),
  jobType: z.string().optional(),
  experience: z.coerce.number().optional(),
  skill: z.string().optional(),
  language: z.string().optional(),
  addressLine1: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  travelDistance: z.coerce.number().optional(),

  // Agency fields
  agencyName: z.string().optional(),
  ownerName: z.string().optional(),
  addressLine1: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").transform((e) => e.toLowerCase().trim()),
  password: z
    .string()
    .min(1, "Password is required"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100)
    .regex(passwordRegex, passwordMessage),
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").transform((e) => e.toLowerCase().trim()),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const resendVerificationSchema = z.object({
  email: z.string().email("Invalid email address").transform((e) => e.toLowerCase().trim()),
});

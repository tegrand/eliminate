import { z } from "zod";

// Client Signup Schema
export const clientSignupSchema = z.object({
  clientType: z.enum(["INDIVIDUAL", "COMPANY"]).default("INDIVIDUAL"),
  companyName: z.string().optional(),
  contactPerson: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: "You must accept terms and conditions" }) }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.clientType === "COMPANY" && (!data.companyName || data.companyName.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Company name is required for company accounts",
  path: ["companyName"],
});

// Agency Multi-Step Schema
export const agencyStep1Schema = z.object({
  agencyName: z.string().min(2, "Agency name is required"),
  ownerName: z.string().min(2, "Owner name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const agencyStep2Schema = z.object({
  addressLine1: z.string().min(5, "Address is required"),
  district: z.string().min(2, "District is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Valid 6-digit pincode is required"),
  gstNumber: z.string().optional(),
  licenseNumber: z.string().optional(),
});

// Worker Multi-Step Schema
export const workerStep1Schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], { errorMap: () => ({ message: "Select gender" }) }),
});

export const workerStep2Schema = z.object({
  houseName: z.string().min(2, "House / Address name is required"),
  district: z.string().min(2, "District is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Valid 6-digit pincode is required"),
});

export const workerStep3Schema = z.object({
  primarySkill: z.string().min(2, "Primary skill is required"),
  experienceYears: z.string().min(1, "Experience years is required"),
  preferredCategory: z.string().min(2, "Category preference is required"),
  expectedSalary: z.string().min(1, "Expected salary is required"),
});

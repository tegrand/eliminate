import { z } from "zod";

export const workerSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  gender: z.string().min(1, "Gender is required"),
  dateOfBirth: z.string().optional(),
  
  phone: z.string().min(10, "Valid phone number is required"),
  alternatePhone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  pinCode: z.string().optional(),
  
  agency: z.string().min(1, "Agency is required"),
  primarySkill: z.string().min(1, "Primary Skill is required"),
  secondarySkill: z.string().optional(),
  joiningDate: z.string().min(1, "Joining Date is required"),
  status: z.string().min(1, "Status is required"),
  salary: z.string().optional(),
  
  emergencyContactName: z.string().optional(),
  emergencyRelationship: z.string().optional(),
  emergencyContactNumber: z.string().optional(),
});

import { z } from "zod";

export const agencySchema = z.object({
  agencyName: z.string().min(1, "Agency Name is required"),
  registrationNumber: z.string().optional(),
  taxId: z.string().optional(),
  contactPerson: z.string().min(1, "Contact Person is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  pinCode: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
  status: z.string().min(1, "Status is required"),
});

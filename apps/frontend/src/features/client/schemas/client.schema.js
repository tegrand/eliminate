import { z } from "zod";

export const clientSchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  industry: z.string().optional(),
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
  
  billingCycle: z.string().optional(),
  paymentTerms: z.string().optional(),
  billingAddress: z.string().optional(),
  
  status: z.string().min(1, "Status is required"),
  notes: z.string().optional(),
});

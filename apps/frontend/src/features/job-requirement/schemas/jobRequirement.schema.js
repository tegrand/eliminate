import { z } from "zod";

export const jobRequirementSchema = z.object({
  jobTitle: z.string().min(1, "Job Title is required"),
  priority: z.string().min(1, "Priority is required"),
  status: z.string().min(1, "Status is required"),
  clientId: z.string().min(1, "Client is required"),
  contactPersonId: z.string().optional(),
  requiredWorkers: z.coerce.number().min(1, "At least 1 worker is required"),
  jobDescription: z.string().optional(),
  skills: z.array(z.string()).optional(),
  startDate: z.string().min(1, "Start Date is required"),
  endDate: z.string().optional(),
  workingHours: z.string().optional(),
  notes: z.string().optional(),
});

import { z } from "zod";

const baseJobRequirementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150),
  description: z.string().optional(),
  categoryId: z.string().uuid("Invalid category ID").optional(),
  locationId: z.string().uuid("Invalid location ID").optional(),
  requiredWorkers: z.number().int().min(1, "Minimum 1 worker required").max(1000, "Maximum 1000 workers allowed").default(1),
  startDate: z.string().datetime({ message: "Invalid start date format" }).optional(),
  endDate: z.string().datetime({ message: "Invalid end date format" }).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  shift: z.enum(["MORNING", "EVENING", "NIGHT", "FLEXIBLE"]).optional(),
  salaryType: z.enum(["HOURLY", "DAILY", "MONTHLY", "FIXED"]).optional(),
  salaryAmount: z.number().positive("Salary must be positive").optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  notes: z.string().optional(),
  genderPreference: z.string().optional(),
  experienceRequired: z.string().optional(),
  duration: z.string().optional(),
  requiredSkills: z
    .array(
      z.object({
        skillId: z.string().uuid("Invalid skill ID"),
        experienceYears: z.number().int().min(0).optional(),
        proficiencyLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]),
        isMandatory: z.boolean().default(true),
      })
    )
    .optional(),
  requiredLanguages: z
    .array(
      z.object({
        languageId: z.string().uuid("Invalid language ID"),
        proficiencyLevel: z.enum(["BASIC", "CONVERSATIONAL", "PROFESSIONAL", "NATIVE"]),
        isMandatory: z.boolean().default(true),
      })
    )
    .optional(),
});

export const createJobRequirementSchema = baseJobRequirementSchema.refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.endDate) >= new Date(data.startDate);
    }
    return true;
  },
  {
    message: "End date must be greater than or equal to start date",
    path: ["endDate"],
  }
);

export const updateJobRequirementSchema = baseJobRequirementSchema.partial().extend({
  status: z.enum(["DRAFT", "OPEN", "PARTIALLY_FILLED", "FILLED", "COMPLETED", "CANCELLED"]).optional(),
  cancellationReason: z.string().optional(),
});

export const cancelJobRequirementSchema = z.object({
  cancellationReason: z.string().min(5, "Reason must be at least 5 characters"),
});

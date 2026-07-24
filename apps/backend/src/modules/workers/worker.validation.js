import { z } from "zod";

export const createWorkerSchema = z.object({
  userId: z.string().uuid("Invalid User ID"),
  firstName: z.string().min(1, "First name is required").max(100).optional(),
  lastName: z.string().min(1, "Last name is required").max(100).optional(),
  phone: z.string().max(20).optional(),
  gender: z.string().max(20).optional(),
  dateOfBirth: z.string().datetime().optional().or(z.date().optional()),
  addressLine1: z.string().max(255).optional(),
  addressLine2: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  profileImage: z.string().url("Invalid URL").optional(),
  bio: z.string().max(1000).optional(),
  isProfileCompleted: z.boolean().optional(),
}).strict("Unknown fields are not allowed");

export const updateWorkerSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100).optional(),
  lastName: z.string().min(1, "Last name is required").max(100).optional(),
  phone: z.string().max(20).optional(),
  gender: z.string().max(20).optional(),
  dateOfBirth: z.string().datetime().optional().or(z.date().optional()),
  addressLine1: z.string().max(255).optional(),
  addressLine2: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  profileImage: z.string().url("Invalid URL").optional(),
  bio: z.string().max(1000).optional(),
  isProfileCompleted: z.boolean().optional(),
}).strict("Unknown fields are not allowed");

import { z } from "zod";

const phoneRegex = /^\+?[1-9]\d{1,14}$/;
// Standard generalized GST format (15 characters alphanumeric)
const gstRegex = /^[A-Z0-9]{15}$/;
const postalCodeRegex = /^[A-Z0-9\s-]{3,10}$/i;

export const createClientSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required").max(200, "Company name is too long"),
  contactPerson: z.string().trim().min(1, "Contact person is required").max(100, "Contact person name is too long"),
  phone: z.string().trim().regex(phoneRegex, "Invalid phone number format").optional(),
  alternatePhone: z.string().trim().regex(phoneRegex, "Invalid alternate phone number format").optional(),
  email: z.string().trim().toLowerCase().email("Invalid email format").optional(),
  gstNumber: z.string().trim().toUpperCase().regex(gstRegex, "Invalid GST number format").optional(),
  addressLine1: z.string().trim().max(255).optional(),
  addressLine2: z.string().trim().max(255).optional(),
  city: z.string().trim().max(100).optional(),
  state: z.string().trim().max(100).optional(),
  country: z.string().trim().max(100).optional(),
  postalCode: z.string().trim().regex(postalCodeRegex, "Invalid postal code").optional(),
  notes: z.string().trim().max(2000, "Notes are too long").optional(),
}).strict("Unknown fields are not allowed");

export const updateClientSchema = z.object({
  companyName: z.string().trim().min(1, "Company name cannot be empty").max(200).optional(),
  contactPerson: z.string().trim().min(1, "Contact person cannot be empty").max(100).optional(),
  phone: z.string().trim().regex(phoneRegex, "Invalid phone number format").optional(),
  alternatePhone: z.string().trim().regex(phoneRegex, "Invalid alternate phone number format").optional(),
  email: z.string().trim().toLowerCase().email("Invalid email format").optional(),
  gstNumber: z.string().trim().toUpperCase().regex(gstRegex, "Invalid GST number format").optional(),
  addressLine1: z.string().trim().max(255).optional(),
  addressLine2: z.string().trim().max(255).optional(),
  city: z.string().trim().max(100).optional(),
  state: z.string().trim().max(100).optional(),
  country: z.string().trim().max(100).optional(),
  postalCode: z.string().trim().regex(postalCodeRegex, "Invalid postal code").optional(),
  notes: z.string().trim().max(2000, "Notes are too long").optional(),
}).strict("Unknown fields are not allowed").refine(
  (data) => Object.keys(data).length > 0,
  "Update payload cannot be empty"
);

export const clientIdParamSchema = z.object({
  id: z.string().uuid("Invalid client ID format"),
});

export const listClientsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "companyName", "contactPerson"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
}).strict("Unknown query parameters are not allowed");

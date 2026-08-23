import { Router } from "express";
import authenticate from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { listInvoices, getInvoiceById } from "./invoice.controller.js";

const router = Router();

// Protect all routes
router.use(authenticate);

// List all invoices (Super Admin and Client)
router.get("/", authorize("SUPER_ADMIN", "CLIENT"), listInvoices);

// Get specific invoice details
router.get("/:id", authorize("SUPER_ADMIN", "CLIENT"), getInvoiceById);

export default router;

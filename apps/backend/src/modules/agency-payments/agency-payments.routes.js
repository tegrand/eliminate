import { Router } from "express";
import authenticate from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import {
  getMyPayments,
  getPaymentSummary,
  getPaymentById,
  getAllAgencyPayouts,
  markPayoutAsPaid
} from "./agency-payments.controller.js";

const router = Router();

router.use(authenticate);

// Agency routes
router.get("/", getMyPayments);
router.get("/summary", getPaymentSummary);
router.get("/:id", getPaymentById);

// Admin routes
router.get("/admin/all", authorize("SUPER_ADMIN"), getAllAgencyPayouts);
router.patch("/admin/:id/pay", authorize("SUPER_ADMIN"), markPayoutAsPaid);

export default router;

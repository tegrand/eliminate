import { Router } from "express";
import authenticate from "../../middleware/auth.middleware.js";
import {
  getMyPayments,
  getPaymentSummary,
  getPaymentById
} from "./worker-payments.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", getMyPayments);
router.get("/summary", getPaymentSummary);
router.get("/:id", getPaymentById);

export default router;

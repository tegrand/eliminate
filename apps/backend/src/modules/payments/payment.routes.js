import express from "express";
import { Router } from "express";
import * as paymentController from "./payment.controller.js";
import authenticate from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";

const router = Router();

// Clients can create orders and verify payments
router.post("/create-order", authenticate, authorize("CLIENT"), paymentController.createOrder);
router.post("/verify", authenticate, authorize("CLIENT"), paymentController.verifyPayment);

// Webhook for Razorpay (No auth required, Razorpay calls this)
router.post("/webhook", express.raw({ type: 'application/json' }), paymentController.webhook);

export default router;

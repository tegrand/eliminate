import { Router } from "express";
import authenticate from "../../middleware/auth.middleware.js";
import {
  checkIn,
  checkOut,
  getHistory,
  getSummary,
  getLeaves,
  applyLeave,
  markStatus
} from "./worker-attendance.controller.js";

const router = Router();

router.use(authenticate);

// Attendance routes
router.post("/check-in", checkIn);
router.post("/check-out", checkOut);
router.post("/mark-status", markStatus);
router.get("/history", getHistory);
router.get("/summary", getSummary);

// Leave routes
router.get("/leaves", getLeaves);
router.post("/leaves", applyLeave);

export default router;

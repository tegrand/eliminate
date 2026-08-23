import { Router } from "express";
import authenticate from "../../middleware/auth.middleware.js";
import {
  getHistory,
  getSummary,
  getLeaves,
  applyLeave
} from "./worker-attendance.controller.js";

const router = Router();

router.use(authenticate);

// Read-only attendance history and leave routes
router.get("/history", getHistory);
router.get("/summary", getSummary);

// Leave routes
router.get("/leaves", getLeaves);
router.post("/leaves", applyLeave);

export default router;

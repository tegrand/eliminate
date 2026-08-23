import { Router } from "express";
import authenticate from "../../middleware/auth.middleware.js";
import {
  createComplaint,
  getComplaints,
  updateComplaintStatus
} from "./complaints.controller.js";
import { authorize } from "../../middleware/authorize.middleware.js";

const router = Router();

router.use(authenticate);

// Workers can create complaints against clients or agencies
// Clients can create complaints against workers or agencies
// Agencies can create complaints against workers or clients
router.post("/", createComplaint);

// View my complaints
router.get("/", getComplaints);

// Super admin can update status
router.patch(
  "/:id/status",
  authorize("SUPER_ADMIN"),
  updateComplaintStatus
);

export default router;

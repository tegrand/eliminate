import { Router } from "express";
import authenticate from "../../middleware/auth.middleware.js";
import { requirePermission } from "../../middleware/authorize.middleware.js";
import {
  getPublicJobs,
  getSavedJobs,
  toggleSaveJob,
  getApplications,
  applyForJob,
  withdrawApplication
} from "./job.controller.js";

const router = Router();

router.use(authenticate);
// Ensure only workers can access these specific routes if needed.
// For now, these use checkIndependentWorker inside the service which verifies the user is a worker.

router.get("/", getPublicJobs);
router.get("/saved", getSavedJobs);
router.post("/:jobId/save", toggleSaveJob);

router.get("/applications", getApplications);
router.post("/:jobId/apply", applyForJob);
router.post("/:jobId/withdraw", withdrawApplication);

export default router;

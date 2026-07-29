import { Router } from "express";
import {
  getMarketplaceJobs,
  applyForJob,
  saveJob,
  ignoreJob
} from "./worker-marketplace.controller.js";

import authenticate from "../../middleware/auth.middleware.js";

const router = Router();

// Apply authentication universally to all marketplace routes
router.use(authenticate);

// Get available marketplace jobs
router.get("/jobs", getMarketplaceJobs);

// Job Actions
router.post("/jobs/:id/apply", applyForJob);
router.post("/jobs/:id/save", saveJob);
router.post("/jobs/:id/ignore", ignoreJob);

export default router;

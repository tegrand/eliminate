import { Router } from "express";
import * as JobRequirementController from "./job-requirement.controller.js";
import {
  createJobRequirementSchema,
  updateJobRequirementSchema,
  cancelJobRequirementSchema,
} from "./job-requirement.validation.js";
import validate from "../../middleware/validate.middleware.js";
import authenticate from "../../middleware/auth.middleware.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

router
  .route("/")
  .post(validate(createJobRequirementSchema), JobRequirementController.createJobRequirement)
  .get(JobRequirementController.getJobRequirements);

router
  .route("/:id")
  .get(JobRequirementController.getJobRequirementById)
  .patch(validate(updateJobRequirementSchema), JobRequirementController.updateJobRequirement)
  .delete(JobRequirementController.deleteJobRequirement);

router
  .route("/:id/cancel")
  .post(validate(cancelJobRequirementSchema), JobRequirementController.cancelJobRequirement);

export default router;

import { Router } from "express";

import {
  createJobRequirement,
  listJobRequirements,
  getJobRequirement,
  updateJobRequirement,
  deleteJobRequirement,
} from "./job-requirement.controller.js";

import {
  createJobRequirementSchema,
  updateJobRequirementSchema,
  jobRequirementIdParamSchema,
  jobRequirementListQuerySchema,
} from "./job-requirement.validation.js";

import validate from "../../middleware/validate.middleware.js";
import authenticate from "../../middleware/auth.middleware.js";
import { requirePermission } from "../../middleware/authorize.middleware.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  requirePermission("job-requirement:create"),
  validate(createJobRequirementSchema),
  createJobRequirement
);

router.get(
  "/",
  requirePermission("job-requirement:read"),
  validate(jobRequirementListQuerySchema, "query"),
  listJobRequirements
);

router.get(
  "/:id",
  requirePermission("job-requirement:read"),
  validate(jobRequirementIdParamSchema, "params"),
  getJobRequirement
);

router.patch(
  "/:id",
  requirePermission("job-requirement:update"),
  validate(jobRequirementIdParamSchema, "params"),
  validate(updateJobRequirementSchema),
  updateJobRequirement
);

router.delete(
  "/:id",
  requirePermission("job-requirement:delete"),
  validate(jobRequirementIdParamSchema, "params"),
  deleteJobRequirement
);

export default router;

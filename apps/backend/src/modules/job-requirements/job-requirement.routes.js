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
import { authorize } from "../../middleware/authorize.middleware.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize("CLIENT", "SUPER_ADMIN", "AGENCY"),
  validate(createJobRequirementSchema),
  createJobRequirement
);

router.get(
  "/",
  validate(jobRequirementListQuerySchema, "query"),
  listJobRequirements
);

router.get(
  "/:id",
  validate(jobRequirementIdParamSchema, "params"),
  getJobRequirement
);

router.patch(
  "/:id",
  authorize("CLIENT", "SUPER_ADMIN", "AGENCY"),
  validate(jobRequirementIdParamSchema, "params"),
  validate(updateJobRequirementSchema),
  updateJobRequirement
);

router.delete(
  "/:id",
  authorize("CLIENT", "SUPER_ADMIN", "AGENCY"),
  validate(jobRequirementIdParamSchema, "params"),
  deleteJobRequirement
);

export default router;

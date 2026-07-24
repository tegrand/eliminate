import { Router } from "express";

import {
  assignWorker,
  getAgencyWorkers,
  updateAssignment,
  deleteAssignment,
} from "./agency-worker.controller.js";

import {
  assignWorkerSchema,
  updateAssignmentSchema,
  deleteAssignmentSchema,
} from "./agency-worker.validation.js";

import validate from "../../middleware/validate.middleware.js";
import authenticate from "../../middleware/auth.middleware.js";
import { requirePermission } from "../../middleware/authorize.middleware.js";

const router = Router();

router.use(authenticate);

router.post(
  "/agencies/:agencyId/workers",
  requirePermission("agency-worker:create"),
  validate(assignWorkerSchema),
  assignWorker
);

router.get(
  "/agencies/:agencyId/workers",
  requirePermission("agency-worker:read"),
  getAgencyWorkers
);

router.patch(
  "/agencies/:agencyId/workers/:workerId",
  requirePermission("agency-worker:update"),
  validate(deleteAssignmentSchema, "params"),
  validate(updateAssignmentSchema),
  updateAssignment
);

router.delete(
  "/agencies/:agencyId/workers/:workerId",
  requirePermission("agency-worker:delete"),
  validate(deleteAssignmentSchema, "params"),
  deleteAssignment
);

export default router;

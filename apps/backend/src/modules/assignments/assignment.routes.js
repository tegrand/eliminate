import { Router } from "express";

import {
  listAssignments,
  getAssignment,
  updateAssignmentStatus,
  assignWorker,
  removeWorker
} from "./assignment.controller.js";

import {
  updateAssignmentStatusSchema,
  assignmentIdParamSchema,
  assignWorkerSchema
} from "./assignment.validation.js";

import validate from "../../middleware/validate.middleware.js";
import authenticate from "../../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", listAssignments);

router.get(
  "/:id",
  validate(assignmentIdParamSchema, "params"),
  getAssignment
);

router.patch(
  "/:id/status",
  validate(assignmentIdParamSchema, "params"),
  validate(updateAssignmentStatusSchema),
  updateAssignmentStatus
);

router.post(
  "/:id/workers",
  validate(assignmentIdParamSchema, "params"),
  validate(assignWorkerSchema),
  assignWorker
);

router.delete(
  "/:id/workers/:workerId",
  validate(assignmentIdParamSchema, "params"),
  removeWorker
);

export default router;

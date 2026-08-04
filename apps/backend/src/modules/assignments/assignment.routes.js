import { Router } from "express";

import {
  listAssignments,
  getAssignment,
  getAssignmentAttendance,
  markAssignmentAttendance,
  checkoutAssignmentAttendance,
  updateAssignmentStatus,
  assignWorker,
  removeWorker
} from "./assignment.controller.js";

import {
  updateAssignmentStatusSchema,
  assignmentIdParamSchema,
  assignWorkerSchema,
  markAssignmentAttendanceSchema,
  checkoutAssignmentAttendanceSchema
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

router.get(
  "/:id/attendance",
  validate(assignmentIdParamSchema, "params"),
  getAssignmentAttendance
);

router.post(
  "/:id/attendance/checkout",
  validate(assignmentIdParamSchema, "params"),
  validate(checkoutAssignmentAttendanceSchema),
  checkoutAssignmentAttendance
);

router.post(
  "/:id/attendance",
  validate(assignmentIdParamSchema, "params"),
  validate(markAssignmentAttendanceSchema),
  markAssignmentAttendance
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

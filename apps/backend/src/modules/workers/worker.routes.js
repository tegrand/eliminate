import { Router } from "express";

import {
  createWorker,
  getWorkers,
  getWorkerById,
  updateWorker,
  deleteWorker,
  getMyWorkerProfile,
  updateMyWorkerProfile
} from "./worker.controller.js";

import {
  createWorkerSchema,
  updateWorkerSchema,
  workerIdParamSchema,
  listWorkersQuerySchema,
} from "./worker.validation.js";

import validate from "../../middleware/validate.middleware.js";
import authenticate from "../../middleware/auth.middleware.js";
import { requirePermission } from "../../middleware/authorize.middleware.js";

const router = Router();

// Apply authentication universally to all worker routes
router.use(authenticate);

router.post(
  "/",
  requirePermission("worker:create"),
  validate(createWorkerSchema),
  createWorker
);

router.get(
  "/",
  requirePermission("worker:read"),
  validate(listWorkersQuerySchema, "query"),
  getWorkers
);

// Worker fetching their own profile
router.get(
  "/my-profile",
  getMyWorkerProfile
);

// Worker updating their own profile
router.patch(
  "/my-profile",
  validate(updateWorkerSchema),
  updateMyWorkerProfile
);

router.get(
  "/:id",
  requirePermission("worker:read"),
  validate(workerIdParamSchema, "params"),
  getWorkerById
);

router.patch(
  "/:id",
  requirePermission("worker:update"),
  validate(updateWorkerSchema),
  updateWorker
);

router.delete(
  "/:id",
  requirePermission("worker:delete"),
  validate(workerIdParamSchema, "params"),
  deleteWorker
);

export default router;

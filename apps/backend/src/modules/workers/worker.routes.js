import { Router } from "express";

import {
  createWorker,
  getWorkers,
  getWorkerById,
  updateWorker,
  updateWorkerStatus,
  deleteWorker,
  getMyWorkerProfile,
  updateMyWorkerProfile,
  getMyAgencies,
  acceptAgencyInvitation,
  rejectAgencyInvitation,
  leaveAgency
} from "./worker.controller.js";

import {
  createWorkerSchema,
  updateWorkerSchema,
  workerIdParamSchema,
  listWorkersQuerySchema,
  updateWorkerStatusSchema,
} from "./worker.validation.js";

import validate from "../../middleware/validate.middleware.js";
import authenticate from "../../middleware/auth.middleware.js";
import { requirePermission, authorize } from "../../middleware/authorize.middleware.js";

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
  // Allow these roles instead of just checking a permission that might not be seeded
  authorize("SUPER_ADMIN", "CLIENT", "AGENCY"),
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

// Worker Agency Relationship Endpoints
router.get("/my-profile/agencies", getMyAgencies);
router.post("/my-profile/agencies/:agencyId/accept", acceptAgencyInvitation);
router.post("/my-profile/agencies/:agencyId/reject", rejectAgencyInvitation);
router.post("/my-profile/agencies/:agencyId/leave", leaveAgency);

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

router.patch(
  "/:id/status",
  requirePermission("worker:update"),
  validate(workerIdParamSchema, "params"),
  validate(updateWorkerStatusSchema),
  updateWorkerStatus
);

router.delete(
  "/:id",
  requirePermission("worker:delete"),
  validate(workerIdParamSchema, "params"),
  deleteWorker
);

export default router;

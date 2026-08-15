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
  leaveAgency,

  addAgencyWorkerSingle,
  addAgencyWorkerBulk,
  uploadResume,
  uploadDocument
} from "./worker.controller.js";

import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads", "documents");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
});
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });


import {
  createWorkerSchema,
  updateWorkerSchema,
  workerIdParamSchema,
  listWorkersQuerySchema,
  updateWorkerStatusSchema,
  createAgencyWorkerSchema,
  createAgencyWorkerBulkSchema
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

// Agency adding offline workers
router.post(
  "/agency/single",
  authorize("AGENCY"),
  validate(createAgencyWorkerSchema),
  addAgencyWorkerSingle
);

router.post(
  "/agency/bulk",
  authorize("AGENCY"),
  validate(createAgencyWorkerBulkSchema),
  addAgencyWorkerBulk
);

// Worker updating their own profile
router.patch(
  "/my-profile",
  validate(updateWorkerSchema),
  updateMyWorkerProfile
);

router.post(
  "/my-profile/resume",
  upload.single("file"),
  uploadResume
);

router.post(
  "/my-profile/documents",
  upload.single("file"),
  uploadDocument
);

// Worker Agency Relationship Endpoints
router.get("/my-profile/agencies", getMyAgencies);
router.post("/my-profile/agencies/:agencyId/accept", acceptAgencyInvitation);
router.post("/my-profile/agencies/:agencyId/reject", rejectAgencyInvitation);
router.post("/my-profile/agencies/:agencyId/leave", leaveAgency);



router.get(
  "/:id",
  authorize("SUPER_ADMIN", "CLIENT", "AGENCY", "WORKER"),
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

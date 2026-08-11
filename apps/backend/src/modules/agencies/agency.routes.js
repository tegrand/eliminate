import { Router } from "express";

import {
  createAgency,
  getAgencies,
  getAgencyById,
  updateAgency,
  updateAgencyStatus,
  deleteAgency,
  uploadAgencyDocument,
} from "./agency.controller.js";

import {
  createAgencySchema,
  updateAgencySchema,
  agencyIdParamSchema,
  listAgenciesQuerySchema,
  updateAgencyStatusSchema,
} from "./agency.validation.js";

import validate from "../../middleware/validate.middleware.js";
import authenticate from "../../middleware/auth.middleware.js";
import { requirePermission, authorize } from "../../middleware/authorize.middleware.js";

const router = Router();

// Apply authentication universally to all agency routes
router.use(authenticate);

import multer from "multer";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads", "documents");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
});
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post(
  "/upload-document",
  requirePermission("agency:update"),
  upload.single('file'),
  uploadAgencyDocument
);

router.post(
  "/",
  requirePermission("agency:create"),
  validate(createAgencySchema),
  createAgency
);

router.get(
  "/",
  authorize("SUPER_ADMIN", "CLIENT", "WORKER"),
  validate(listAgenciesQuerySchema, "query"),
  getAgencies
);

router.get(
  "/:id",
  requirePermission("agency:read"),
  validate(agencyIdParamSchema, "params"),
  getAgencyById
);

router.patch(
  "/:id",
  requirePermission("agency:update"),
  validate(agencyIdParamSchema, "params"),
  validate(updateAgencySchema),
  updateAgency
);

router.patch(
  "/:id/status",
  requirePermission("agency:update"),
  validate(agencyIdParamSchema, "params"),
  validate(updateAgencyStatusSchema),
  updateAgencyStatus
);

router.delete(
  "/:id",
  requirePermission("agency:delete"),
  validate(agencyIdParamSchema, "params"),
  deleteAgency
);

export default router;

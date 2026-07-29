import { Router } from "express";

import {
  createAgency,
  getAgencies,
  getAgencyById,
  updateAgency,
  updateAgencyStatus,
  deleteAgency,
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

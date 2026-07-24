import { Router } from "express";

import {
  createLocation,
  getLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
} from "./location.controller.js";

import {
  createLocationSchema,
  updateLocationSchema,
  locationIdParamSchema,
  listLocationsQuerySchema,
} from "./location.validation.js";

import validate from "../../middleware/validate.middleware.js";
import authenticate from "../../middleware/auth.middleware.js";
import { requirePermission } from "../../middleware/authorize.middleware.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  requirePermission("location:create"),
  validate(createLocationSchema),
  createLocation
);

router.get(
  "/",
  requirePermission("location:read"),
  validate(listLocationsQuerySchema, "query"),
  getLocations
);

router.get(
  "/:id",
  requirePermission("location:read"),
  validate(locationIdParamSchema, "params"),
  getLocationById
);

router.patch(
  "/:id",
  requirePermission("location:update"),
  validate(locationIdParamSchema, "params"),
  validate(updateLocationSchema),
  updateLocation
);

router.delete(
  "/:id",
  requirePermission("location:delete"),
  validate(locationIdParamSchema, "params"),
  deleteLocation
);

export default router;

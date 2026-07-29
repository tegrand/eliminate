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
  validate(createLocationSchema),
  createLocation
);

router.get(
  "/",
  validate(listLocationsQuerySchema, "query"),
  getLocations
);

router.get(
  "/:id",
  validate(locationIdParamSchema, "params"),
  getLocationById
);

router.patch(
  "/:id",
  requirePermission("location:update"), // keep update restricted
  validate(locationIdParamSchema, "params"),
  validate(updateLocationSchema),
  updateLocation
);

router.delete(
  "/:id",
  requirePermission("location:delete"), // keep delete restricted
  validate(locationIdParamSchema, "params"),
  deleteLocation
);

export default router;

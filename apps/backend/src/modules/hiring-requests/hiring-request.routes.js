import { Router } from "express";

import {
  createHiringRequest,
  listHiringRequests,
  getHiringRequest,
  updateHiringRequestStatus,
} from "./hiring-request.controller.js";

import {
  createHiringRequestSchema,
  updateHiringRequestStatusSchema,
  hiringRequestIdParamSchema,
} from "./hiring-request.validation.js";

import validate from "../../middleware/validate.middleware.js";
import authenticate from "../../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  validate(createHiringRequestSchema),
  createHiringRequest
);

router.get(
  "/",
  listHiringRequests
);

router.get(
  "/:id",
  validate(hiringRequestIdParamSchema, "params"),
  getHiringRequest
);

router.patch(
  "/:id/status",
  validate(hiringRequestIdParamSchema, "params"),
  validate(updateHiringRequestStatusSchema),
  updateHiringRequestStatus
);

export default router;

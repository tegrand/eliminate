import { Router } from "express";

import {
  createWorker,
  getWorkers,
  getWorkerById,
  updateWorker,
  deleteWorker,
} from "./worker.controller.js";

import { createWorkerSchema, updateWorkerSchema } from "./worker.validation.js";

import validate from "../../middleware/validate.middleware.js";
import authenticate from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";

const router = Router();

// All worker routes require authentication and SUPER_ADMIN role
router.use(authenticate, authorize("SUPER_ADMIN"));

router.post(
  "/",
  validate(createWorkerSchema),
  createWorker
);

router.get("/", getWorkers);

router.get("/:id", getWorkerById);

router.patch(
  "/:id",
  validate(updateWorkerSchema),
  updateWorker
);

router.delete("/:id", deleteWorker);

export default router;

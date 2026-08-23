import { Router } from "express";

import {
  assignLanguage,
  getWorkerLanguages,
  updateWorkerLanguage,
  deleteWorkerLanguage,
} from "./worker-language.controller.js";

import {
  assignLanguageSchema,
  updateWorkerLanguageSchema,
  deleteWorkerLanguageSchema,
} from "./worker-language.validation.js";

import validate from "../../middleware/validate.middleware.js";
import authenticate from "../../middleware/auth.middleware.js";
import { requirePermission, authorize } from "../../middleware/authorize.middleware.js";

const router = Router();

router.use(authenticate);

router.post(
  "/workers/:workerId/languages",
  authorize("SUPER_ADMIN", "AGENCY", "WORKER"),
  validate(assignLanguageSchema),
  assignLanguage
);

router.get(
  "/workers/:workerId/languages",
  authorize("SUPER_ADMIN", "AGENCY", "WORKER", "CLIENT"),
  getWorkerLanguages
);

router.patch(
  "/workers/:workerId/languages/:languageId",
  authorize("SUPER_ADMIN", "AGENCY", "WORKER"),
  validate(deleteWorkerLanguageSchema, "params"),
  validate(updateWorkerLanguageSchema),
  updateWorkerLanguage
);

router.delete(
  "/workers/:workerId/languages/:languageId",
  authorize("SUPER_ADMIN", "AGENCY", "WORKER"),
  validate(deleteWorkerLanguageSchema, "params"),
  deleteWorkerLanguage
);

export default router;

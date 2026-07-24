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
import { requirePermission } from "../../middleware/authorize.middleware.js";

const router = Router();

router.use(authenticate);

router.post(
  "/workers/:workerId/languages",
  requirePermission("worker-language:create"),
  validate(assignLanguageSchema),
  assignLanguage
);

router.get(
  "/workers/:workerId/languages",
  requirePermission("worker-language:read"),
  getWorkerLanguages
);

router.patch(
  "/workers/:workerId/languages/:languageId",
  requirePermission("worker-language:update"),
  validate(deleteWorkerLanguageSchema, "params"),
  validate(updateWorkerLanguageSchema),
  updateWorkerLanguage
);

router.delete(
  "/workers/:workerId/languages/:languageId",
  requirePermission("worker-language:delete"),
  validate(deleteWorkerLanguageSchema, "params"),
  deleteWorkerLanguage
);

export default router;

import { Router } from "express";

import {
  createLanguage,
  getLanguages,
  getLanguageById,
  updateLanguage,
  deleteLanguage,
} from "./language.controller.js";

import {
  createLanguageSchema,
  updateLanguageSchema,
  languageIdParamSchema,
  listLanguagesQuerySchema,
} from "./language.validation.js";

import validate from "../../middleware/validate.middleware.js";
import authenticate from "../../middleware/auth.middleware.js";
import { requirePermission, authorize } from "../../middleware/authorize.middleware.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  requirePermission("language:create"),
  validate(createLanguageSchema),
  createLanguage
);

router.get(
  "/",
  authorize("SUPER_ADMIN", "AGENCY", "WORKER", "CLIENT"),
  validate(listLanguagesQuerySchema, "query"),
  getLanguages
);

router.get(
  "/:id",
  authorize("SUPER_ADMIN", "AGENCY", "WORKER", "CLIENT"),
  validate(languageIdParamSchema, "params"),
  getLanguageById
);

router.patch(
  "/:id",
  requirePermission("language:update"),
  validate(languageIdParamSchema, "params"),
  validate(updateLanguageSchema),
  updateLanguage
);

router.delete(
  "/:id",
  requirePermission("language:delete"),
  validate(languageIdParamSchema, "params"),
  deleteLanguage
);

export default router;

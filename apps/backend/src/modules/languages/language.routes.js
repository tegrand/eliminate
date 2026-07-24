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
import { requirePermission } from "../../middleware/authorize.middleware.js";

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
  requirePermission("language:read"),
  validate(listLanguagesQuerySchema, "query"),
  getLanguages
);

router.get(
  "/:id",
  requirePermission("language:read"),
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

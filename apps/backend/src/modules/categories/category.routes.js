import { Router } from "express";

import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "./category.controller.js";

import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
  listCategoriesQuerySchema,
} from "./category.validation.js";

import validate from "../../middleware/validate.middleware.js";
import authenticate from "../../middleware/auth.middleware.js";
import { requirePermission } from "../../middleware/authorize.middleware.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  requirePermission("category:create"),
  validate(createCategorySchema),
  createCategory
);

router.get(
  "/",
  requirePermission("category:read"),
  validate(listCategoriesQuerySchema, "query"),
  getCategories
);

router.get(
  "/:id",
  requirePermission("category:read"),
  validate(categoryIdParamSchema, "params"),
  getCategoryById
);

router.patch(
  "/:id",
  requirePermission("category:update"),
  validate(categoryIdParamSchema, "params"),
  validate(updateCategorySchema),
  updateCategory
);

router.delete(
  "/:id",
  requirePermission("category:delete"),
  validate(categoryIdParamSchema, "params"),
  deleteCategory
);

export default router;

import { Router } from "express";

import {
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
} from "./skill.controller.js";

import {
  createSkillSchema,
  updateSkillSchema,
  skillIdParamSchema,
  listSkillsQuerySchema,
} from "./skill.validation.js";

import validate from "../../middleware/validate.middleware.js";
import authenticate from "../../middleware/auth.middleware.js";
import { requirePermission } from "../../middleware/authorize.middleware.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  requirePermission("skill:create"),
  validate(createSkillSchema),
  createSkill
);

router.get(
  "/",
  requirePermission("skill:read"),
  validate(listSkillsQuerySchema, "query"),
  getSkills
);

router.get(
  "/:id",
  requirePermission("skill:read"),
  validate(skillIdParamSchema, "params"),
  getSkillById
);

router.patch(
  "/:id",
  requirePermission("skill:update"),
  validate(skillIdParamSchema, "params"),
  validate(updateSkillSchema),
  updateSkill
);

router.delete(
  "/:id",
  requirePermission("skill:delete"),
  validate(skillIdParamSchema, "params"),
  deleteSkill
);

export default router;

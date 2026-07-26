import { Router } from "express";

import {
  assignSkill,
  getWorkerSkills,
  updateWorkerSkill,
  deleteWorkerSkill,
} from "./worker-skill.controller.js";

import {
  assignSkillSchema,
  updateWorkerSkillSchema,
  deleteWorkerSkillSchema,
} from "./worker-skill.validation.js";

import validate from "../../middleware/validate.middleware.js";
import authenticate from "../../middleware/auth.middleware.js";
import { requirePermission } from "../../middleware/authorize.middleware.js";

const router = Router();

router.use(authenticate);

router.post(
  "/workers/:workerId/skills",
  requirePermission("worker-skill:create"),
  validate(assignSkillSchema),
  assignSkill
);

router.get(
  "/workers/:workerId/skills",
  requirePermission("worker-skill:read"),
  getWorkerSkills
);

router.patch(
  "/workers/:workerId/skills/:skillId",
  requirePermission("worker-skill:update"),
  validate(deleteWorkerSkillSchema, "params"),
  validate(updateWorkerSkillSchema),
  updateWorkerSkill
);

router.delete(
  "/workers/:workerId/skills/:skillId",
  requirePermission("worker-skill:delete"),
  validate(deleteWorkerSkillSchema, "params"),
  deleteWorkerSkill
);

export default router;

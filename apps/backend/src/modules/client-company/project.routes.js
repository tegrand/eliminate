import { Router } from "express";
import { getProjects, postProject, patchProject, removeProject } from "./project.controller.js";
import authenticate from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { z } from "zod";
import validate from "../../middleware/validate.middleware.js";

const router = Router();
router.use(authenticate);

const projectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required").max(200),
  description: z.string().trim().max(2000).optional(),
  status: z.enum(["ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"]).optional(),
}).strict();

const projectUpdateSchema = projectSchema.partial().refine(d => Object.keys(d).length > 0, "Update cannot be empty");
const projectIdSchema = z.object({ id: z.string().uuid() });

router.get("/", authorize("CLIENT", "SUPER_ADMIN"), getProjects);
router.post("/", authorize("CLIENT"), validate(projectSchema), postProject);
router.patch("/:id", authorize("CLIENT", "SUPER_ADMIN"), validate(projectIdSchema, "params"), validate(projectUpdateSchema), patchProject);
router.delete("/:id", authorize("CLIENT", "SUPER_ADMIN"), validate(projectIdSchema, "params"), removeProject);

export default router;

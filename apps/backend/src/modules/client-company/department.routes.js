import { Router } from "express";
import { getDepartments, postDepartment, patchDepartment, removeDepartment } from "./department.controller.js";
import authenticate from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { z } from "zod";
import validate from "../../middleware/validate.middleware.js";

const router = Router();
router.use(authenticate);

const deptSchema = z.object({
  name: z.string().trim().min(1, "Department name is required").max(200),
}).strict();

const deptUpdateSchema = deptSchema.partial().refine(d => Object.keys(d).length > 0, "Update cannot be empty");
const idSchema = z.object({ id: z.string().uuid() });

router.get("/", authorize("CLIENT", "SUPER_ADMIN"), getDepartments);
router.post("/", authorize("CLIENT"), validate(deptSchema), postDepartment);
router.patch("/:id", authorize("CLIENT", "SUPER_ADMIN"), validate(idSchema, "params"), validate(deptUpdateSchema), patchDepartment);
router.delete("/:id", authorize("CLIENT", "SUPER_ADMIN"), validate(idSchema, "params"), removeDepartment);

export default router;

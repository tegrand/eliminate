import { Router } from "express";
import { getSites, postSite, patchSite, removeSite } from "./site-location.controller.js";
import authenticate from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { z } from "zod";
import validate from "../../middleware/validate.middleware.js";

const router = Router();
router.use(authenticate);

const siteSchema = z.object({
  name: z.string().trim().min(1, "Site name is required").max(200),
  address: z.string().trim().max(500).optional(),
  city: z.string().trim().max(100).optional(),
  state: z.string().trim().max(100).optional(),
  projectId: z.string().uuid().optional(),
}).strict();

const siteUpdateSchema = siteSchema.partial().refine(d => Object.keys(d).length > 0, "Update cannot be empty");
const idSchema = z.object({ id: z.string().uuid() });

router.get("/", authorize("CLIENT", "SUPER_ADMIN"), getSites);
router.post("/", authorize("CLIENT"), validate(siteSchema), postSite);
router.patch("/:id", authorize("CLIENT", "SUPER_ADMIN"), validate(idSchema, "params"), validate(siteUpdateSchema), patchSite);
router.delete("/:id", authorize("CLIENT", "SUPER_ADMIN"), validate(idSchema, "params"), removeSite);

export default router;

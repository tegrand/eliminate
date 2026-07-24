import { Router } from "express";

import { getProfile, updateProfile } from "./users.controller.js";
import { updateProfileSchema } from "./users.validation.js";

import validate from "../../middleware/validate.middleware.js";
import authenticate from "../../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/profile", getProfile);

router.patch(
  "/profile",
  validate(updateProfileSchema),
  updateProfile
);

export default router;

import { Router } from "express";

import {
  getProfile,
  updateProfile,
  getLoginHistory,
  getActiveSessions,
  revokeAllSessions,
} from "./users.controller.js";
import { updateProfileSchema } from "./users.validation.js";

import validate from "../../middleware/validate.middleware.js";
import authenticate from "../../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/profile", getProfile);
router.patch("/profile", validate(updateProfileSchema), updateProfile);

router.get("/login-history", getLoginHistory);
router.get("/sessions", getActiveSessions);
router.delete("/sessions", revokeAllSessions);

export default router;

import { Router } from "express";
import * as settingsController from "./settings.controller.js";
import authenticate from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";

const router = Router();

// Public settings accessible by anyone authenticated
router.get("/public", authenticate, settingsController.getPublicSettings);

// Everyone authenticated might need to read settings (like platform fee for calculations, although usually done backend side)
// But to be safe, let's allow SUPER_ADMIN only for now, and other services will fetch internally.
router.get("/", authenticate, authorize("SUPER_ADMIN"), settingsController.getSettings);
router.put("/", authenticate, authorize("SUPER_ADMIN"), settingsController.updateSettings);

export default router;

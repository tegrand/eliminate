import { Router } from "express";
import * as adController from "./advertisement.controller.js";
import authenticate from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";

const router = Router();

// Public authenticated route — any logged-in user can see active ads
router.get("/", authenticate, adController.getActiveAds);

// Super Admin only routes
router.get("/admin", authenticate, authorize("SUPER_ADMIN"), adController.getAllAds);
router.post("/", authenticate, authorize("SUPER_ADMIN"), adController.createAd);
router.put("/:id", authenticate, authorize("SUPER_ADMIN"), adController.updateAd);
router.patch("/:id/toggle", authenticate, authorize("SUPER_ADMIN"), adController.toggleAd);
router.delete("/:id", authenticate, authorize("SUPER_ADMIN"), adController.deleteAd);

export default router;

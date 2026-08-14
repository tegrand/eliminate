import { Router } from "express";
import * as adController from "./advertisement.controller.js";
import authenticate from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Setup Multer for image uploads
const uploadDir = path.join(process.cwd(), "uploads", "advertisements");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
});
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Public authenticated route — any logged-in user can see active ads
router.get("/", authenticate, adController.getActiveAds);

// Super Admin only routes
router.get("/admin", authenticate, authorize("SUPER_ADMIN"), adController.getAllAds);
router.post("/", authenticate, authorize("SUPER_ADMIN"), adController.createAd);
router.put("/:id", authenticate, authorize("SUPER_ADMIN"), adController.updateAd);
router.patch("/:id/toggle", authenticate, authorize("SUPER_ADMIN"), adController.toggleAd);
router.delete("/:id", authenticate, authorize("SUPER_ADMIN"), adController.deleteAd);
router.post("/upload-image", authenticate, authorize("SUPER_ADMIN"), upload.single('file'), adController.uploadImage);

export default router;

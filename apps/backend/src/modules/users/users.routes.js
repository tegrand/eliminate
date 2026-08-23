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

import { uploadAvatar } from "./users.controller.js";
import multer from "multer";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads", "avatars");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
});
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get("/login-history", getLoginHistory);
router.get("/sessions", getActiveSessions);
router.delete("/sessions", revokeAllSessions);

router.post("/avatar", upload.single('file'), uploadAvatar);

export default router;

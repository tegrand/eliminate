import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import authenticate from "../../middleware/auth.middleware.js";
import {
  getMyDocuments,
  uploadDocument,
  replaceDocument,
  deleteDocument
} from "./worker-documents.controller.js";

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads", "documents");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const router = Router();

router.use(authenticate);

router.get("/", getMyDocuments);
router.post("/", upload.single('file'), uploadDocument);
router.put("/:id", upload.single('file'), replaceDocument);
router.delete("/:id", deleteDocument);

export default router;

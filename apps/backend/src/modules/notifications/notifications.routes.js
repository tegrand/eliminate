import { Router } from "express";
import authenticate from "../../middleware/auth.middleware.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  testCreateNotification
} from "./notifications.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", getNotifications);
router.put("/read-all", markAllAsRead);
router.put("/:id/read", markAsRead);
router.post("/test", testCreateNotification);

export default router;

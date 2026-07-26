import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as notificationsService from "./notifications.service.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const result = await notificationsService.getNotifications(req.user.id);
  return ApiResponse.success(res, "Notifications retrieved", result, 200);
});

export const markAsRead = asyncHandler(async (req, res) => {
  await notificationsService.markAsRead(req.user.id, req.params.id);
  return ApiResponse.success(res, "Notification marked as read", null, 200);
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await notificationsService.markAllAsRead(req.user.id);
  return ApiResponse.success(res, "All notifications marked as read", null, 200);
});

// For testing/development only
export const testCreateNotification = asyncHandler(async (req, res) => {
  const { type, title, message, link } = req.body;
  const result = await notificationsService.createNotification(
    req.user.id,
    type || "SYSTEM",
    title || "Test Notification",
    message || "This is a test notification generated manually.",
    link
  );
  return ApiResponse.success(res, "Test notification created", result, 201);
});

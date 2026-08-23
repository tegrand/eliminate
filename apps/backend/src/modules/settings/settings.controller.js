import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as settingsService from "./settings.service.js";

export const getSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.getSettings();
  return ApiResponse.success(res, "Settings retrieved successfully", settings, 200);
});

export const getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.getPublicSettings();
  return ApiResponse.success(res, "Public settings retrieved successfully", settings, 200);
});

export const updateSettings = asyncHandler(async (req, res) => {
  // Only super admin should hit this route, this is enforced by middleware in routes
  const settings = await settingsService.updateSettings(req.body);
  return ApiResponse.success(res, "Settings updated successfully", settings, 200);
});

import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as usersService from "./users.service.js";

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await usersService.getProfile(req.user.id);
  return ApiResponse.success(res, "User profile fetched successfully", profile);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await usersService.updateProfile(req.user.id, req.validatedData);
  return ApiResponse.success(res, "User profile updated successfully", profile);
});

export const getLoginHistory = asyncHandler(async (req, res) => {
  const history = await usersService.getLoginHistory(req.user.id);
  return ApiResponse.success(res, "Login history fetched successfully", history);
});

export const getActiveSessions = asyncHandler(async (req, res) => {
  const data = await usersService.getActiveSessions(req.user.id);
  return ApiResponse.success(res, "Active sessions fetched successfully", data);
});

export const revokeAllSessions = asyncHandler(async (req, res) => {
  await usersService.revokeAllSessions(req.user.id);
  return ApiResponse.success(res, "All sessions revoked successfully", null);
});

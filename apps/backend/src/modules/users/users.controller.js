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

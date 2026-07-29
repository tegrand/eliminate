import * as marketplaceService from "./worker-marketplace.service.js";
import ApiResponse from "../../../utils/apiResponse.js";
import asyncHandler from "../../../utils/asyncHandler.js";

export const getMarketplaceJobs = asyncHandler(async (req, res) => {
  const result = await marketplaceService.getMarketplaceJobs(req.user.id, req.query);
  return ApiResponse.success(res, "Marketplace jobs retrieved", result, 200);
});

export const applyForJob = asyncHandler(async (req, res) => {
  const result = await marketplaceService.applyForJob(req.user.id, req.params.id);
  return ApiResponse.success(res, "Applied for job successfully", result, 201);
});

export const saveJob = asyncHandler(async (req, res) => {
  const result = await marketplaceService.saveJob(req.user.id, req.params.id);
  return ApiResponse.success(res, "Job saved successfully", result, 201);
});

export const ignoreJob = asyncHandler(async (req, res) => {
  const result = await marketplaceService.ignoreJob(req.user.id, req.params.id);
  return ApiResponse.success(res, "Job ignored successfully", result, 201);
});

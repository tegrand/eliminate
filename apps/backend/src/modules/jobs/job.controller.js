import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as jobService from "./job.service.js";

export const getPublicJobs = asyncHandler(async (req, res) => {
  const result = await jobService.getPublicJobs(req.user.id, req.query);
  return ApiResponse.success(res, "Public jobs retrieved successfully", result, 200);
});

export const getSavedJobs = asyncHandler(async (req, res) => {
  const result = await jobService.getSavedJobs(req.user.id);
  return ApiResponse.success(res, "Saved jobs retrieved successfully", result, 200);
});

export const toggleSaveJob = asyncHandler(async (req, res) => {
  const result = await jobService.toggleSaveJob(req.user.id, req.params.jobId);
  return ApiResponse.success(res, "Job save status updated", result, 200);
});

export const getApplications = asyncHandler(async (req, res) => {
  const result = await jobService.getApplications(req.user.id);
  return ApiResponse.success(res, "Applications retrieved successfully", result, 200);
});

export const applyForJob = asyncHandler(async (req, res) => {
  const result = await jobService.applyForJob(req.user.id, req.params.jobId, req.body);
  return ApiResponse.success(res, "Applied for job successfully", result, 200);
});

export const withdrawApplication = asyncHandler(async (req, res) => {
  const result = await jobService.withdrawApplication(req.user.id, req.params.jobId);
  return ApiResponse.success(res, "Application withdrawn successfully", result, 200);
});

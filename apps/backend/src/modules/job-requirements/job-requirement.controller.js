import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as jobRequirementService from "./job-requirement.service.js";

import prisma from "../../config/prisma.js";

export const createJobRequirement = asyncHandler(async (req, res) => {
  let { clientId, ...rest } = req.validatedData;
  
  if (req.user?.profileType === "CLIENT") {
    const client = await prisma.client.findUnique({ where: { userId: req.user.id } });
    if (client) {
      clientId = client.id;
    }
  }

  const jobRequirement = await jobRequirementService.createJobRequirement({ clientId, ...rest });
  return ApiResponse.success(res, "Job requirement created successfully", jobRequirement, 201);
});

export const listJobRequirements = asyncHandler(async (req, res) => {
  const result = await jobRequirementService.listJobRequirements(req.validatedData);
  return ApiResponse.success(res, "Job requirements retrieved successfully", result.data, 200, result.meta);
});

export const getJobRequirement = asyncHandler(async (req, res) => {
  const jobRequirement = await jobRequirementService.getJobRequirement(req.params.id);
  return ApiResponse.success(res, "Job requirement retrieved successfully", jobRequirement, 200);
});

export const updateJobRequirement = asyncHandler(async (req, res) => {
  const jobRequirement = await jobRequirementService.updateJobRequirement(req.params.id, req.validatedData);
  return ApiResponse.success(res, "Job requirement updated successfully", jobRequirement, 200);
});

export const deleteJobRequirement = asyncHandler(async (req, res) => {
  await jobRequirementService.deleteJobRequirement(req.params.id);
  return ApiResponse.success(res, "Job requirement deleted successfully", null, 200);
});

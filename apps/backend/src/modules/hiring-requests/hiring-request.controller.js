import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as hiringRequestService from "./hiring-request.service.js";

import prisma from "../../config/prisma.js";

export const createHiringRequest = asyncHandler(async (req, res) => {
  let clientId = req.validatedData.clientId;
  
  if (req.user?.profileType === "CLIENT") {
    const client = await prisma.client.findUnique({ where: { userId: req.user.id } });
    if (client) clientId = client.id;
  }

  const hiringRequest = await hiringRequestService.createHiringRequest(clientId, req.validatedData);
  return ApiResponse.success(res, "Hiring request sent successfully", hiringRequest, 201);
});

export const listHiringRequests = asyncHandler(async (req, res) => {
  const result = await hiringRequestService.listHiringRequests(req.validatedData || {}, req.user);
  return ApiResponse.success(res, "Hiring requests retrieved successfully", result, 200);
});

export const getHiringRequest = asyncHandler(async (req, res) => {
  const hiringRequest = await hiringRequestService.getHiringRequest(req.params.id, req.user);
  return ApiResponse.success(res, "Hiring request retrieved successfully", hiringRequest, 200);
});

export const updateHiringRequestStatus = asyncHandler(async (req, res) => {
  const { status } = req.validatedData;
  const hiringRequest = await hiringRequestService.updateHiringRequestStatus(req.params.id, status, req.user);
  return ApiResponse.success(res, `Hiring request ${status.toLowerCase()} successfully`, hiringRequest, 200);
});

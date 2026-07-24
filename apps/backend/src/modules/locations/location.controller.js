import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as locationService from "./location.service.js";

export const createLocation = asyncHandler(async (req, res) => {
  const location = await locationService.createLocation(req.validatedData);
  return ApiResponse.success(res, "Location created successfully", location, 201);
});

export const getLocations = asyncHandler(async (req, res) => {
  const result = await locationService.getLocations(req.query);
  return ApiResponse.success(res, "Locations retrieved successfully", result, 200);
});

export const getLocationById = asyncHandler(async (req, res) => {
  const location = await locationService.getLocationById(req.params.id);
  return ApiResponse.success(res, "Location retrieved successfully", location, 200);
});

export const updateLocation = asyncHandler(async (req, res) => {
  const location = await locationService.updateLocation(req.params.id, req.validatedData);
  return ApiResponse.success(res, "Location updated successfully", location, 200);
});

export const deleteLocation = asyncHandler(async (req, res) => {
  await locationService.deleteLocation(req.params.id);
  return ApiResponse.success(res, "Location deleted successfully", null, 200);
});

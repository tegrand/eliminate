import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import AppError from "../../shared/errors/app-error.js";
import * as agencyService from "./agency.service.js";

export const createAgency = asyncHandler(async (req, res) => {
  const agency = await agencyService.createAgency(req.user.id, req.validatedData);
  return ApiResponse.success(res, "Agency created successfully", agency, 201);
});

export const getAgencies = asyncHandler(async (req, res) => {
  const result = await agencyService.getAgencies(req.query);
  return ApiResponse.success(res, "Agencies retrieved successfully", result, 200);
});

export const getAgencyById = asyncHandler(async (req, res) => {
  const agency = await agencyService.getAgencyById(req.params.id);
  return ApiResponse.success(res, "Agency retrieved successfully", agency, 200);
});

export const updateAgency = asyncHandler(async (req, res) => {
  // Ensure that an AGENCY can only update their own profile
  if (req.user?.role?.name !== "SUPER_ADMIN") {
    const existingAgency = await agencyService.getAgencyById(req.params.id);
    if (existingAgency.userId !== req.user.id) {
      throw new AppError("Forbidden - You can only update your own agency profile", 403);
    }
  }

  const agency = await agencyService.updateAgency(req.params.id, req.validatedData);
  return ApiResponse.success(res, "Agency updated successfully", agency, 200);
});

export const updateAgencyStatus = asyncHandler(async (req, res) => {
  const agency = await agencyService.updateAgencyStatus(req.params.id, req.validatedData.status);
  return ApiResponse.success(res, "Agency status updated successfully", agency, 200);
});

export const deleteAgency = asyncHandler(async (req, res) => {
  await agencyService.deleteAgency(req.params.id);
  return ApiResponse.success(res, "Agency deleted successfully", null, 200);
});

export const uploadAgencyDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    return ApiResponse.error(res, "No file uploaded", 400);
  }
  const documentUrl = `/uploads/documents/${req.file.filename}`;
  return ApiResponse.success(res, "File uploaded successfully", { documentUrl }, 200);
});

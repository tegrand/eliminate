import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as languageService from "./language.service.js";

export const createLanguage = asyncHandler(async (req, res) => {
  const language = await languageService.createLanguage(req.validatedData);
  return ApiResponse.success(res, "Language created successfully", language, 201);
});

export const getLanguages = asyncHandler(async (req, res) => {
  const result = await languageService.getLanguages(req.query);
  return ApiResponse.success(res, "Languages retrieved successfully", result, 200);
});

export const getLanguageById = asyncHandler(async (req, res) => {
  const language = await languageService.getLanguageById(req.params.id);
  return ApiResponse.success(res, "Language retrieved successfully", language, 200);
});

export const updateLanguage = asyncHandler(async (req, res) => {
  const language = await languageService.updateLanguage(req.params.id, req.validatedData);
  return ApiResponse.success(res, "Language updated successfully", language, 200);
});

export const deleteLanguage = asyncHandler(async (req, res) => {
  await languageService.deleteLanguage(req.params.id);
  return ApiResponse.success(res, "Language deleted successfully", null, 200);
});

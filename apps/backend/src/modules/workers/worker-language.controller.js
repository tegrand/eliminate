import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as workerLanguageService from "./worker-language.service.js";

export const assignLanguage = asyncHandler(async (req, res) => {
  const payload = {
    ...req.validatedData,
    workerId: req.params.workerId,
    languageId: req.params.languageId,
  };
  const workerLanguage = await workerLanguageService.assignLanguage(payload);
  return ApiResponse.success(res, "Language assigned successfully", workerLanguage, 201);
});

export const getWorkerLanguages = asyncHandler(async (req, res) => {
  const languages = await workerLanguageService.getWorkerLanguages(req.params.workerId);
  return ApiResponse.success(res, "Worker languages retrieved successfully", languages, 200);
});

export const updateWorkerLanguage = asyncHandler(async (req, res) => {
  const workerLanguage = await workerLanguageService.updateWorkerLanguage(
    req.params.workerId,
    req.params.languageId,
    req.validatedData
  );
  return ApiResponse.success(res, "Worker language updated successfully", workerLanguage, 200);
});

export const deleteWorkerLanguage = asyncHandler(async (req, res) => {
  await workerLanguageService.deleteWorkerLanguage(req.params.workerId, req.params.languageId);
  return ApiResponse.success(res, "Worker language removed successfully", null, 200);
});

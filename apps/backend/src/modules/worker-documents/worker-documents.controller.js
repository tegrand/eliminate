import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as documentsService from "./worker-documents.service.js";

export const getMyDocuments = asyncHandler(async (req, res) => {
  const result = await documentsService.getMyDocuments(req.user.id);
  return ApiResponse.success(res, "Documents retrieved", result, 200);
});

export const uploadDocument = asyncHandler(async (req, res) => {
  const result = await documentsService.uploadDocument(req.user.id, req.file, req.body);
  return ApiResponse.success(res, "Document uploaded successfully", result, 201);
});

export const replaceDocument = asyncHandler(async (req, res) => {
  const result = await documentsService.replaceDocument(req.user.id, req.params.id, req.file);
  return ApiResponse.success(res, "Document replaced successfully", result, 200);
});

export const deleteDocument = asyncHandler(async (req, res) => {
  const result = await documentsService.deleteDocument(req.user.id, req.params.id);
  return ApiResponse.success(res, "Document deleted successfully", result, 200);
});

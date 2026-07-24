import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as workerService from "./worker.service.js";

export const createWorker = asyncHandler(async (req, res) => {
  const worker = await workerService.createWorker(req.validatedData);
  return ApiResponse.success(res, "Worker created successfully", worker, 201);
});

export const getWorkers = asyncHandler(async (req, res) => {
  const { page, limit, search, sortBy, sortOrder } = req.query;
  const result = await workerService.getWorkers({ page, limit, search, sortBy, sortOrder });
  return ApiResponse.success(res, "Workers retrieved successfully", result);
});

export const getWorkerById = asyncHandler(async (req, res) => {
  const worker = await workerService.getWorkerById(req.params.id);
  return ApiResponse.success(res, "Worker retrieved successfully", worker);
});

export const updateWorker = asyncHandler(async (req, res) => {
  const worker = await workerService.updateWorker(req.params.id, req.validatedData);
  return ApiResponse.success(res, "Worker updated successfully", worker);
});

export const deleteWorker = asyncHandler(async (req, res) => {
  await workerService.deleteWorker(req.params.id);
  return ApiResponse.success(res, "Worker deleted successfully", null);
});

import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as workerService from "./worker.service.js";

export const createWorker = asyncHandler(async (req, res) => {
  const worker = await workerService.createWorker(req.user.id, req.validatedData);
  return ApiResponse.success(res, "Worker created successfully", worker, 201);
});

export const getWorkers = asyncHandler(async (req, res) => {
  const result = await workerService.getWorkers(req.query);
  return ApiResponse.success(res, "Workers retrieved successfully", result, 200);
});

export const getMyWorkerProfile = asyncHandler(async (req, res) => {
  const worker = await workerService.getMyWorkerProfile(req.user.id);
  return ApiResponse.success(res, "Worker profile retrieved successfully", worker, 200);
});

export const updateMyWorkerProfile = asyncHandler(async (req, res) => {
  const worker = await workerService.updateMyWorkerProfile(req.user.id, req.validatedData);
  return ApiResponse.success(res, "Worker profile updated successfully", worker, 200);
});

export const getWorkerById = asyncHandler(async (req, res) => {
  const worker = await workerService.getWorkerById(req.params.id, req.user);
  return ApiResponse.success(res, "Worker retrieved successfully", worker, 200);
});

export const updateWorker = asyncHandler(async (req, res) => {
  const worker = await workerService.updateWorker(req.params.id, req.validatedData, req.user);
  return ApiResponse.success(res, "Worker updated successfully", worker, 200);
});

export const deleteWorker = asyncHandler(async (req, res) => {
  await workerService.deleteWorker(req.params.id);
  return ApiResponse.success(res, "Worker deleted successfully", null, 200);
});



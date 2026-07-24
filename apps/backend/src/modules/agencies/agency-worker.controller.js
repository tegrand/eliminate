import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as agencyWorkerService from "./agency-worker.service.js";

export const assignWorker = asyncHandler(async (req, res) => {
  const payload = {
    ...req.validatedData,
    agencyId: req.params.agencyId,
    workerId: req.validatedData.workerId || req.body.workerId,
  };
  const agencyWorker = await agencyWorkerService.assignWorker(payload);
  return ApiResponse.success(res, "Worker assigned successfully", agencyWorker, 201);
});

export const getAgencyWorkers = asyncHandler(async (req, res) => {
  const workers = await agencyWorkerService.getAgencyWorkers(req.params.agencyId);
  return ApiResponse.success(res, "Agency workers retrieved successfully", workers, 200);
});

export const updateAssignment = asyncHandler(async (req, res) => {
  const agencyWorker = await agencyWorkerService.updateAssignment(
    req.params.agencyId,
    req.params.workerId,
    req.validatedData
  );
  return ApiResponse.success(res, "Agency worker assignment updated successfully", agencyWorker, 200);
});

export const deleteAssignment = asyncHandler(async (req, res) => {
  await agencyWorkerService.deleteAssignment(req.params.agencyId, req.params.workerId);
  return ApiResponse.success(res, "Agency worker assignment removed successfully", null, 200);
});

import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as workerService from "./worker.service.js";

export const createWorker = asyncHandler(async (req, res) => {
  const worker = await workerService.createWorker(req.user.id, req.validatedData);
  return ApiResponse.success(res, "Worker created successfully", worker, 201);
});

export const getWorkers = asyncHandler(async (req, res) => {
  const result = await workerService.getWorkers({ ...req.query, user: req.user });
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

export const updateWorkerStatus = asyncHandler(async (req, res) => {
  const worker = await workerService.updateWorkerStatus(req.params.id, req.validatedData.status);
  return ApiResponse.success(res, "Worker status updated successfully", worker, 200);
});

export const deleteWorker = asyncHandler(async (req, res) => {
  await workerService.deleteWorker(req.params.id);
  return ApiResponse.success(res, "Worker deleted successfully", null, 200);
});
export const getMyAgencies = asyncHandler(async (req, res) => {
  const result = await workerService.getMyAgencies(req.user.id);
  return ApiResponse.success(res, "Agencies retrieved successfully", result, 200);
});

export const acceptAgencyInvitation = asyncHandler(async (req, res) => {
  const result = await workerService.acceptAgencyInvitation(req.user.id, req.params.agencyId);
  return ApiResponse.success(res, "Invitation accepted successfully", result, 200);
});

export const rejectAgencyInvitation = asyncHandler(async (req, res) => {
  const result = await workerService.rejectAgencyInvitation(req.user.id, req.params.agencyId);
  return ApiResponse.success(res, "Invitation rejected successfully", result, 200);
});

export const leaveAgency = asyncHandler(async (req, res) => {
  const result = await workerService.leaveAgency(req.user.id, req.params.agencyId);
  return ApiResponse.success(res, "Left agency successfully", result, 200);
});

export const getMyJobInvitations = asyncHandler(async (req, res) => {
  const result = await workerService.getMyJobInvitations(req.user.id);
  return ApiResponse.success(res, "Job invitations retrieved", result, 200);
});

export const acceptJobInvitation = asyncHandler(async (req, res) => {
  const result = await workerService.acceptJobInvitation(req.user.id, req.params.id, req.user);
  return ApiResponse.success(res, "Job invitation accepted", result, 200);
});

export const rejectJobInvitation = asyncHandler(async (req, res) => {
  const result = await workerService.rejectJobInvitation(req.user.id, req.params.id, req.user);
  return ApiResponse.success(res, "Job invitation rejected", result, 200);
});

export const getWorkerAvailability = asyncHandler(async (req, res) => {
  const result = await workerService.getWorkerAvailability(req.params.id);
  return ApiResponse.success(res, "Worker availability retrieved successfully", result, 200);
});


export const addAgencyWorkerSingle = asyncHandler(async (req, res) => {
  const worker = await workerService.createAgencyWorkerSingle(req.user.id, req.validatedData);
  return ApiResponse.success(res, "Worker added successfully", worker, 201);
});

export const addAgencyWorkerBulk = asyncHandler(async (req, res) => {
  const result = await workerService.createAgencyWorkerBulk(req.user.id, req.validatedData.workers);
  return ApiResponse.success(res, "Workers added successfully", result, 201);
});

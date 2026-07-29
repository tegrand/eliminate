import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as assignmentService from "./assignment.service.js";

export const listAssignments = asyncHandler(async (req, res) => {
  const result = await assignmentService.listAssignments(req.validatedData || {}, req.user);
  return ApiResponse.success(res, "Assignments retrieved successfully", result, 200);
});

export const getAssignment = asyncHandler(async (req, res) => {
  const assignment = await assignmentService.getAssignment(req.params.id, req.user);
  return ApiResponse.success(res, "Assignment retrieved successfully", assignment, 200);
});

export const updateAssignmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.validatedData;
  const assignment = await assignmentService.updateAssignmentStatus(req.params.id, status, req.user);
  return ApiResponse.success(res, "Assignment status updated successfully", assignment, 200);
});

export const assignWorker = asyncHandler(async (req, res) => {
  const { workerId } = req.validatedData;
  const assignmentWorker = await assignmentService.assignWorker(req.params.id, workerId, req.user);
  return ApiResponse.success(res, "Worker assigned successfully", assignmentWorker, 201);
});

export const removeWorker = asyncHandler(async (req, res) => {
  const { workerId } = req.params; // or from body
  const assignmentWorker = await assignmentService.removeWorker(req.params.id, workerId, req.user);
  return ApiResponse.success(res, "Worker removed successfully", assignmentWorker, 200);
});

import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as attendanceService from "./worker-attendance.service.js";

export const getHistory = asyncHandler(async (req, res) => {
  const result = await attendanceService.getHistory(req.user.id, req.query);
  return ApiResponse.success(res, "Attendance history retrieved", result, 200);
});

export const getSummary = asyncHandler(async (req, res) => {
  const result = await attendanceService.getSummary(req.user.id, req.query);
  return ApiResponse.success(res, "Attendance summary retrieved", result, 200);
});

export const getLeaves = asyncHandler(async (req, res) => {
  const result = await attendanceService.getLeaves(req.user.id);
  return ApiResponse.success(res, "Leaves retrieved successfully", result, 200);
});

export const applyLeave = asyncHandler(async (req, res) => {
  const result = await attendanceService.applyLeave(req.user.id, req.body);
  return ApiResponse.success(res, "Leave applied successfully", result, 201);
});

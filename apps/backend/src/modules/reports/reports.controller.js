import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as reportsService from "./reports.service.js";
import prisma from "../../config/prisma.js";
import AppError from "../../shared/errors/app-error.js";

const getClientId = async (userId) => {
  const client = await prisma.client.findUnique({ where: { userId } });
  if (!client) throw new AppError("Only clients can access these reports", 403);
  return client.id;
};

export const getWorkerHistory = asyncHandler(async (req, res) => {
  const clientId = await getClientId(req.user.id);
  const data = await reportsService.getWorkerHistory(clientId);
  return ApiResponse.success(res, "Worker History retrieved", data, 200);
});

export const getAgencyHistory = asyncHandler(async (req, res) => {
  const clientId = await getClientId(req.user.id);
  const data = await reportsService.getAgencyHistory(clientId);
  return ApiResponse.success(res, "Agency History retrieved", data, 200);
});

export const getJobHistory = asyncHandler(async (req, res) => {
  const clientId = await getClientId(req.user.id);
  const data = await reportsService.getJobHistory(clientId);
  return ApiResponse.success(res, "Job History retrieved", data, 200);
});

export const getAttendanceReport = asyncHandler(async (req, res) => {
  const clientId = await getClientId(req.user.id);
  const data = await reportsService.getAttendanceReport(clientId);
  return ApiResponse.success(res, "Attendance Report retrieved", data, 200);
});

export const getPaymentReport = asyncHandler(async (req, res) => {
  const clientId = await getClientId(req.user.id);
  const data = await reportsService.getPaymentReport(clientId);
  return ApiResponse.success(res, "Payment Report retrieved", data, 200);
});

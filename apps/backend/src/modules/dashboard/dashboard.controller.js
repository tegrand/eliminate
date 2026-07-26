import asyncHandler from "../../shared/helpers/async-handler.js";
import ApiResponse from "../../shared/responses/api-response.js";
import * as dashboardService from "./dashboard.service.js";
import AppError from "../../shared/errors/app-error.js";

export const getDashboardData = asyncHandler(async (req, res) => {
  const { profileType, id } = req.user;

  if (profileType === "WORKER") {
    const data = await dashboardService.getWorkerDashboard(id);
    return ApiResponse.success(res, "Worker dashboard retrieved successfully", data, 200);
  } 
  
  if (profileType === "SUPER_ADMIN") {
    const data = await dashboardService.getSuperAdminDashboard();
    return ApiResponse.success(res, "Admin dashboard retrieved successfully", data, 200);
  }

  // Fallback for CLIENT, AGENCY, etc. when built
  throw new AppError(`Dashboard for profile type ${profileType} is not implemented yet.`, 501);
});

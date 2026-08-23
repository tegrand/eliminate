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

  if (profileType === "CLIENT") {
    const data = await dashboardService.getClientDashboard(id);
    return ApiResponse.success(res, "Client dashboard retrieved successfully", data, 200);
  }

  if (profileType === "AGENCY") {
    const data = {
      topStats: {
        activeWorkers: 0,
        availableWorkers: 0,
        busyWorkers: 0,
        pendingRequests: 0,
        activeClientRequirements: 0,
        ongoingAssignments: 0,
        completedAssignments: 0,
      },
      recentActivities: [],
      attendance: [],
      chartData: {
        donutData: [
          { name: 'Active', value: 0 },
          { name: 'Available', value: 0 }
        ],
        donutTotal: 0
      }
    };
    return ApiResponse.success(res, "Agency dashboard retrieved successfully", data, 200);
  }

  // Fallback for others
  throw new AppError(`Dashboard for profile type ${profileType} is not implemented yet.`, 501);
});

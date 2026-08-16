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
    // Return empty mock data for now, frontend will use its fallbacks
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
        lineData: [
          { name: 'Jan', value: 0 }, { name: 'Feb', value: 0 }, { name: 'Mar', value: 0 },
          { name: 'Apr', value: 0 }, { name: 'May', value: 0 }, { name: 'Jun', value: 0 },
          { name: 'Jul', value: 0 }, { name: 'Aug', value: 0 }, { name: 'Sep', value: 0 },
          { name: 'Oct', value: 0 }, { name: 'Nov', value: 0 }, { name: 'Dec', value: 0 }
        ],
        donutData: [
          { name: 'Active', value: 0 },
          { name: 'Available', value: 0 }
        ],
        donutTotal: 0
      }
    };
    return ApiResponse.success(res, "Agency dashboard retrieved successfully", data, 200);
  }

  if (profileType === "PENDING_ROLE") {
    // Return empty mock data so UI doesn't crash before redirecting
    const data = { topStats: {}, recentActivities: [], chartData: {} };
    return ApiResponse.success(res, "Pending role dashboard", data, 200);
  }

  // Fallback for others
  throw new AppError(`Dashboard for profile type ${profileType} is not implemented yet.`, 501);
});

import api from "../../../api/axios";

export const dashboardApi = {
  getDashboardData: () => api.get("/dashboard"),
};

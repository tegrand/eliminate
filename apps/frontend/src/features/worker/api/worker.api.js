import api from "../../../api/axios";

export const workerApi = {
  getWorkers: async (params) => {
    const response = await api.get("/workers", { params });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get("/workers/me");
    return response.data;
  },
  updateMe: async (data) => {
    const response = await api.patch("/workers/me", data);
    return response.data;
  },
  getMyApplications: async () => {
    const response = await api.get("/workers/me/applications");
    return response.data;
  }
};

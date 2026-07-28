import api from "../../../api/axios";

export const workerApi = {
  getWorkers: async (params) => {
    const response = await api.get("/workers", { params });
    return response.data;
  },
  getWorkerById: async (id) => {
    const response = await api.get(`/workers/${id}`);
    return response.data;
  },
  updateWorkerStatus: async (id, status) => {
    const response = await api.patch(`/workers/${id}/status`, { status });
    return response.data;
  }
};

import api from "../../../api/axios";

export const workerApi = {
  getWorkers: async (params) => {
    const response = await api.get("/workers", { params });
    return response.data;
  }
};

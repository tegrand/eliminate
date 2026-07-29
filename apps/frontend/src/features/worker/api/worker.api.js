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
  getMyWorkerProfile: async () => {
    const response = await api.get("/workers/my-profile");
    return response.data;
  },
  updateWorkerStatus: async (id, status) => {
    const response = await api.patch(`/workers/${id}/status`, { status });
    return response.data;
  },
  
  // Skill Management
  getWorkerSkills: async (workerId) => {
    const response = await api.get(`/workers/${workerId}/skills`);
    return response.data;
  },
  assignSkill: async (workerId, data) => {
    const response = await api.post(`/workers/${workerId}/skills`, data);
    return response.data;
  },
  updateWorkerSkill: async (workerId, skillId, data) => {
    const response = await api.patch(`/workers/${workerId}/skills/${skillId}`, data);
    return response.data;
  },
  deleteWorkerSkill: async (workerId, skillId) => {
    const response = await api.delete(`/workers/${workerId}/skills/${skillId}`);
    return response.data;
  }
};

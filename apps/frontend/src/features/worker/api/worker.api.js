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
  updateMyWorkerProfile: async (data) => {
    const response = await api.patch("/workers/my-profile", data);
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
  },

  // Agency Relationship Management
  getMyAgencies: async () => {
    const response = await api.get("/workers/my-profile/agencies");
    return response.data;
  },
  acceptAgencyInvitation: async (agencyId) => {
    const response = await api.post(`/workers/my-profile/agencies/${agencyId}/accept`);
    return response.data;
  },
  rejectAgencyInvitation: async (agencyId) => {
    const response = await api.post(`/workers/my-profile/agencies/${agencyId}/reject`);
    return response.data;
  },
  leaveAgency: async (agencyId) => {
    const response = await api.post(`/workers/my-profile/agencies/${agencyId}/leave`);
    return response.data;
  },

  // Job Invitations Management
  getMyJobInvitations: async () => {
    const response = await api.get("/workers/my-profile/invitations");
    return response.data;
  },
  acceptJobInvitation: async (id) => {
    const response = await api.post(`/workers/my-profile/invitations/${id}/accept`);
    return response.data;
  },
  rejectJobInvitation: async (id) => {
    const response = await api.post(`/workers/my-profile/invitations/${id}/reject`);
    return response.data;
  },

  // Marketplace
  getMarketplaceJobs: async (filters = {}) => {
    const response = await api.get("/workers/marketplace/jobs", { params: filters });
    return response.data;
  },
  applyForMarketplaceJob: async (jobId) => {
    const response = await api.post(`/workers/marketplace/jobs/${jobId}/apply`);
    return response.data;
  },
  saveMarketplaceJob: async (jobId) => {
    const response = await api.post(`/workers/marketplace/jobs/${jobId}/save`);
    return response.data;
  },
  ignoreMarketplaceJob: async (jobId) => {
    const response = await api.post(`/workers/marketplace/jobs/${jobId}/ignore`);
    return response.data;
  }
};

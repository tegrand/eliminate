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
  getWorkerAvailability: async (id) => {
    const response = await api.get(`/workers/${id}/availability`);
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
  },

  // Assignments
  getMyAssignments: async (filters = {}) => {
    // Backend uses generic `/assignments` endpoint that filters by logged-in worker
    const response = await api.get("/assignments", { params: filters });
    return response.data;
  },

  // Attendance
  checkIn: async () => {
    const response = await api.post("/my-attendance/check-in");
    return response.data;
  },
  checkOut: async () => {
    const response = await api.post("/my-attendance/check-out");
    return response.data;
  },
  getAttendanceHistory: async (filters = {}) => {
    const response = await api.get("/my-attendance/history", { params: filters });
    return response.data;
  },
  getAttendanceSummary: async (filters = {}) => {
    const response = await api.get("/my-attendance/summary", { params: filters });
    return response.data;
  },

  // Complaints
  createComplaint: async (data) => {
    const response = await api.post("/complaints", data);
    return response.data;
  },
  getMyComplaints: async (filters = {}) => {
    const response = await api.get("/complaints", { params: filters });
    return response.data;
  },

  // Notifications
  getNotifications: async () => {
    const response = await api.get("/notifications");
    return response.data;
  },
  markNotificationRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },
  markAllNotificationsRead: async () => {
    const response = await api.put("/notifications/read-all");
    return response.data;
  },

  // Marketplace
  getMarketplaceJobs: async (filters = {}) => {
    const response = await api.get("/jobs", { params: filters });
    return response.data;
  },
  applyForMarketplaceJob: async (jobId) => {
    const response = await api.post(`/jobs/${jobId}/apply`);
    return response.data;
  },
  saveMarketplaceJob: async (jobId) => {
    const response = await api.post(`/jobs/${jobId}/save`);
    return response.data;
  },
  ignoreMarketplaceJob: async (jobId) => {
    // Missing backend implementation, but we'll return mock success for now
    return { success: true };
  }
};

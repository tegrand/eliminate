import api from "../../../api/axios";

export const jobRequirementApi = {
  getJobRequirements: async (params) => {
    const response = await api.get("/job-requirements", { params });
    return response.data;
  },

  createJobRequirement: async (data) => {
    const response = await api.post("/job-requirements", data);
    return response.data;
  },

  updateJobRequirement: async (id, data) => {
    const response = await api.patch(`/job-requirements/${id}`, data);
    return response.data;
  },

  closeJobRequirement: async (id) => {
    const response = await api.patch(`/job-requirements/${id}/close`);
    return response.data;
  },

  duplicateJobRequirement: async (id) => {
    const response = await api.post(`/job-requirements/${id}/duplicate`);
    return response.data;
  },

  reopenJobRequirement: async (id) => {
    const response = await api.patch(`/job-requirements/${id}/reopen`);
    return response.data;
  },

  deleteJobRequirement: async (id) => {
    const response = await api.delete(`/job-requirements/${id}`);
    return response.data;
  },

  getJobRequirementById: async (id) => {
    const response = await api.get(`/job-requirements/${id}`);
    return response.data;
  },

  requestWorkerReplacement: async (jobId, applicationId, reason) => {
    const response = await api.patch(`/job-requirements/${jobId}/applications/${applicationId}/request-replacement`, { reason });
    return response.data;
  },

  requestWorkerRemoval: async (jobId, applicationId, reason) => {
    const response = await api.patch(`/job-requirements/${jobId}/applications/${applicationId}/request-removal`, { reason });
    return response.data;
  }
};

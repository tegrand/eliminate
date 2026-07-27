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

  cancelJobRequirement: async (id, reason) => {
    const response = await api.patch(`/job-requirements/${id}/cancel`, { cancellationReason: reason });
    return response.data;
  },

  closeJobRequirement: async (id) => {
    const response = await api.patch(`/job-requirements/${id}/close`);
    return response.data;
  },

  duplicateJobRequirement: async (id) => {
    const response = await api.post(`/job-requirements/${id}/duplicate`);
    return response.data;
  }
};

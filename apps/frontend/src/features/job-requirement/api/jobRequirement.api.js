import api from "../../../api/axios";

export const jobRequirementApi = {
  getJobRequirements: async (params) => {
    const response = await api.get("/job-requirements", { params });
    return response.data;
  },
  getJobRequirement: async (id) => {
    const response = await api.get(`/job-requirements/${id}`);
    return response.data;
  },
  applyForJob: async (id, notes) => {
    const response = await api.post(`/job-requirements/${id}/apply`, { notes });
    return response.data;
  }
};

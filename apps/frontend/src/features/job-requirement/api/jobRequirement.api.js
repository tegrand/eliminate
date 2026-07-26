import api from "../../../api/axios";

export const jobRequirementApi = {
  getJobRequirements: async (params) => {
    const response = await api.get("/job-requirements", { params });
    return response.data;
  }
};

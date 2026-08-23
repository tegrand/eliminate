import api from "./axios";

export const skillsApi = {
  getSkills: async (params) => {
    const response = await api.get("/skills", { params });
    return response.data;
  },
  getSkillById: async (id) => {
    const response = await api.get(`/skills/${id}`);
    return response.data;
  }
};

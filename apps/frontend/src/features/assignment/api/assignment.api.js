import api from "../../../api/axios";

export const assignmentApi = {
  getAssignments: async (params) => {
    const response = await api.get("/assignments", { params });
    return response.data;
  }
};

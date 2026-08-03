import api from "../../../api/axios";

export const assignmentApi = {
  getAssignments: async (params) => {
    const response = await api.get("/assignments", { params });
    return response.data;
  },
  markAttendance: async (assignmentId, data) => {
    const response = await api.post(`/assignments/${assignmentId}/attendance`, data);
    return response.data;
  }
};

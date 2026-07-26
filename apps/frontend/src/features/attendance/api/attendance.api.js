import api from "../../../api/axios";

export const attendanceApi = {
  getAttendances: async (params) => {
    const response = await api.get("/attendances", { params });
    return response.data;
  }
};

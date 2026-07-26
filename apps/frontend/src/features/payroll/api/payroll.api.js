import api from "../../../api/axios";

export const payrollApi = {
  getPayrolls: async (params) => {
    const response = await api.get("/payrolls", { params });
    return response.data;
  }
};

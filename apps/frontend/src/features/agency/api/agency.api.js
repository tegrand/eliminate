import api from "../../../api/axios";

export const agencyApi = {
  getAgencies: async (params) => {
    const response = await api.get("/agencies", { params });
    return response.data;
  },
  
  getAgencyById: async (id) => {
    const response = await api.get(`/agencies/${id}`);
    return response.data;
  },
  
  createAgency: async (data) => {
    const response = await api.post("/agencies", data);
    return response.data;
  },
  
  updateAgency: async (id, data) => {
    const response = await api.patch(`/agencies/${id}`, data);
    return response.data;
  },

  updateAgencyStatus: async (id, status) => {
    const response = await api.patch(`/agencies/${id}/status`, { status });
    return response.data;
  },
  
  deleteAgency: async (id) => {
    const response = await api.delete(`/agencies/${id}`);
    return response.data;
  }
};

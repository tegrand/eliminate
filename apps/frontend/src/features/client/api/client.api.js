import api from "../../../api/axios";

export const clientApi = {
  getClients: async (params) => {
    const response = await api.get("/clients", { params });
    return response.data;
  },
  
  getClientById: async (id) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },
  
  createClient: async (data) => {
    const response = await api.post("/clients", data);
    return response.data;
  },
  
  updateClient: async (id, data) => {
    const response = await api.put(`/clients/${id}`, data);
    return response.data;
  },
  
  deleteClient: async (id) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get("/clients/me");
    return response.data;
  },

  updateMe: async (data) => {
    const response = await api.patch("/clients/me", data);
    return response.data;
  }
};

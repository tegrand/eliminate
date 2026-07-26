import api from "../../../api/axios";

export const authApi = {
  login: async (credentials) => {
    return api.post("/auth/login", credentials);
  },

  registerClient: async (data) => {
    const payload = { ...data, accountType: "CLIENT" };
    return api.post("/auth/register", payload);
  },

  registerAgency: async (data) => {
    const payload = { ...data, accountType: "AGENCY" };
    return api.post("/auth/register", payload);
  },

  registerWorker: async (data) => {
    const payload = { ...data, accountType: "WORKER" };
    return api.post("/auth/register", payload);
  },
  
  logout: async () => {
    return api.post("/auth/logout");
  },
  
  refreshSession: async () => {
    return api.post("/auth/refresh-token");
  },
  
  forgotPassword: async (data) => {
    return api.post("/auth/forgot-password", data);
  },
  
  resetPassword: async (data) => {
    return api.post("/auth/reset-password", data);
  }
};

import api from "../../../api/axios";

export const authApi = {
  login: async (credentials) => {
    // Placeholder API call ready for backend integration
    // return await api.post("/auth/login", credentials);
    console.log("authApi.login called with:", credentials);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            user: { id: "1", role: "admin", name: "Admin User", email: credentials.email },
          },
        });
      }, 1000);
    });
  },
  
  logout: async () => {
    // return await api.post("/auth/logout");
    console.log("authApi.logout called");
    return new Promise((resolve) => setTimeout(resolve, 500));
  },
  
  refreshSession: async () => {
    // return await api.post("/auth/refresh");
    console.log("authApi.refreshSession called");
    return new Promise((resolve) => setTimeout(resolve, 500));
  },
  
  forgotPassword: async (data) => {
    // return await api.post("/auth/forgot-password", data);
    console.log("authApi.forgotPassword called with:", data);
    return new Promise((resolve) => setTimeout(resolve, 1000));
  },
  
  resetPassword: async (data) => {
    // return await api.post("/auth/reset-password", data);
    console.log("authApi.resetPassword called with:", data);
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }
};

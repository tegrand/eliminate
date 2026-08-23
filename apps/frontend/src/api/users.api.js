import api from "./axios";

export const usersApi = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.patch("/users/profile", data),
  getLoginHistory: () => api.get("/users/login-history"),
  getActiveSessions: () => api.get("/users/sessions"),
  revokeAllSessions: () => api.delete("/users/sessions"),
  changePassword: (data) => api.patch("/auth/change-password", data),
  verifyPassword: (data) => api.post("/auth/verify-password", data),
  uploadAvatar: (data) => api.post("/users/avatar", data, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

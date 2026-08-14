import api from "./axios";

export const advertisementsApi = {
  // Get all active ads (for clients/workers)
  getActive: async () => {
    const res = await api.get("/advertisements");
    return res.data;
  },

  // Get all ads including inactive (super admin only)
  getAll: async () => {
    const res = await api.get("/advertisements/admin");
    return res.data;
  },

  // Create a new ad (super admin only)
  create: async (data) => {
    const res = await api.post("/advertisements", data);
    return res.data;
  },

  // Update an ad (super admin only)
  update: async (id, data) => {
    const res = await api.put(`/advertisements/${id}`, data);
    return res.data;
  },

  // Toggle active/inactive (super admin only)
  toggle: async (id) => {
    const res = await api.patch(`/advertisements/${id}/toggle`);
    return res.data;
  },

  // Delete an ad (super admin only)
  delete: async (id) => {
    const res = await api.delete(`/advertisements/${id}`);
    return res.data;
  },
};

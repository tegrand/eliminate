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

  // Get all ad packages
  getPackages: async () => {
    const res = await api.get("/advertisements/packages");
    return res.data;
  },

  // Create an ad package
  createPackage: async (data) => {
    const res = await api.post("/advertisements/packages", data);
    return res.data;
  },

  // Update an ad package
  updatePackage: async (id, data) => {
    const res = await api.put(`/advertisements/packages/${id}`, data);
    return res.data;
  },

  // Delete an ad package
  deletePackage: async (id) => {
    const res = await api.delete(`/advertisements/packages/${id}`);
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

  // Upload an image file for an ad
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/advertisements/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};

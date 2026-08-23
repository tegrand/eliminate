import api from "./axios";

export const settingsApi = {
  getPublicSettings: async () => {
    const res = await api.get('/settings/public');
    return res.data;
  }
};

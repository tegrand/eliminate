import api from "../../../api/axios";

export const categoryApi = {
  getCategories: async (params) => {
    const response = await api.get("/categories", { params });
    return response.data;
  },
  createCategory: async (data) => {
    const response = await api.post("/categories", data);
    return response.data;
  },
  updateCategory: async (id, data) => {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

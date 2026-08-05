import axiosInstance from "./axios";

const basePath = "/api/v1/reviews";

export const reviewsApi = {
  createReview: async (data) => {
    const response = await axiosInstance.post(basePath, data);
    return response.data;
  },
  
  getReviews: async (filters = {}) => {
    const response = await axiosInstance.get(basePath, { params: filters });
    return response.data;
  }
};

import axios from "axios";

// 1. Create the base Axios instance
// We use import.meta.env to access environment variables in Vite.
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  withCredentials: true, // Enables sending/receiving HttpOnly cookies automatically
  timeout: 30000, // 30-second timeout to prevent infinitely hanging requests
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 2. Request Interceptor
// Executes before the request is sent to the server.
axiosInstance.interceptors.request.use(
  (config) => {
    // TODO: Authentication
    // If utilizing JWT Bearer tokens from state/localStorage, attach them here:
    // const token = useAuthStore.getState().token;
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor
// Executes after the server responds, but before the response reaches the calling function.
axiosInstance.interceptors.response.use(
  (response) => {
    // Pass through successful responses unchanged
    return response;
  },
  async (error) => {
    // Standardize error structures if the backend sends inconsistent formats
    // const originalRequest = error.config;

    // TODO: 401 Unauthorized / Token Refresh
    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   try {
    //     // await refreshAccessToken();
    //     // return axiosInstance(originalRequest);
    //   } catch (refreshError) {
    //     // TODO: Trigger Global Logout
    //   }
    // }

    // TODO: 403 Forbidden
    // if (error.response?.status === 403) {
    //   // Trigger 'Permission Denied' notification or redirect
    // }

    return Promise.reject(error);
  }
);

export default axiosInstance;

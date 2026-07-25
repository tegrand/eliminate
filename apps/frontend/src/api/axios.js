import axios from "axios";

// 1. Create the base Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  withCredentials: true, // Enables sending/receiving HttpOnly cookies automatically
  timeout: 30000, 
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 2. Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip interception for the refresh token route to avoid infinite loops
    if (originalRequest.url.includes("/auth/refresh-token")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axiosInstance.post("/auth/refresh-token");
        const newToken = data.data.accessToken;
        
        // Update storage
        if (localStorage.getItem("accessToken")) {
          localStorage.setItem("accessToken", newToken);
        } else if (sessionStorage.getItem("accessToken")) {
          sessionStorage.setItem("accessToken", newToken);
        }

        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Dispatch custom event to let AuthProvider handle global logout
        window.dispatchEvent(new Event("auth:logout"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

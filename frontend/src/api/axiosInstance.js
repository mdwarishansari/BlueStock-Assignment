import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle specific error codes
      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          Cookies.remove("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          toast.error("Session expired. Please login again.");
          break;
        case 403:
          toast.error(data.message || "Access forbidden");
          break;
        case 404:
          toast.error(data.message || "Resource not found");
          break;
        case 409:
          toast.error(data.message || "Conflict error");
          break;
        case 422:
          toast.error(data.message || "Validation error");
          break;
        case 429:
          toast.error("Too many requests. Please try again later.");
          break;
        case 500:
          toast.error("Server error. Please try again later.");
          break;
        default:
          toast.error(data.message || "An error occurred");
      }
    } else if (error.request) {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error("An unexpected error occurred");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

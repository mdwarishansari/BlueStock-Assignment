import axios from "axios";
import { API_BASE_URL, TOKEN_KEY } from "../utils/constants";
import { toast } from "react-toastify";

/**
 * Create Axios instance with default config
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 * Add auth token to all requests
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log("📤 API Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle responses and errors globally
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log("📥 API Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  (error) => {
    // Log error in development
    if (import.meta.env.DEV) {
      console.error("❌ API Error:", {
        status: error.response?.status,
        url: error.config?.url,
        message: error.response?.data?.message || error.message,
      });
    }

    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - Clear token and redirect to login
          localStorage.removeItem(TOKEN_KEY);

          // Only show toast if not already on login page
          if (!window.location.pathname.includes("/login")) {
            toast.error("Session expired. Please login again.");
            window.location.href = "/login";
          }
          break;

        case 403:
          toast.error(data.message || "Access forbidden");
          break;

        case 404:
          toast.error(data.message || "Resource not found");
          break;

        case 409:
          toast.error(data.message || "Conflict - Resource already exists");
          break;

        case 422:
          // Validation errors
          if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach((err) => {
              toast.error(err.msg || err.message);
            });
          } else {
            toast.error(data.message || "Validation error");
          }
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
      // Request made but no response received
      toast.error("Network error. Please check your connection.");
    } else {
      // Something else happened
      toast.error(error.message || "An unexpected error occurred");
    }

    return Promise.reject(error);
  }
);

/**
 * Helper function to set auth token
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

/**
 * Helper function to get auth token
 */
export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Helper function to clear auth token
 */
export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  delete axiosInstance.defaults.headers.common["Authorization"];
};

export default axiosInstance;

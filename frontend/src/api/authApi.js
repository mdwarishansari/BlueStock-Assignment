import axiosInstance from "./axiosInstance";

export const authApi = {
  // Register new user
  register: async (userData) => {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await axiosInstance.get("/auth/verify-email", {
      params: { token },
    });
    return response.data;
  },

  // Verify mobile OTP
  verifyMobile: async (data) => {
    const response = await axiosInstance.post("/auth/verify-mobile", data);
    return response.data;
  },

  // Resend OTP
  resendOTP: async (userId) => {
    const response = await axiosInstance.post("/auth/resend-otp", {
      user_id: userId,
    });
    return response.data;
  },

  // Request password reset
  forgotPassword: async (email) => {
    const response = await axiosInstance.post("/auth/forgot-password", {
      email,
    });
    return response.data;
  },

  // Reset password
  resetPassword: async (data) => {
    const response = await axiosInstance.post("/auth/reset-password", data);
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await axiosInstance.get("/auth/profile");
    return response.data;
  },

  // Update user profile
  updateProfile: async (data) => {
    const response = await axiosInstance.put("/auth/profile", data);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  },
};

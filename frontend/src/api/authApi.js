import axiosInstance from "./axiosInstance";
import { API_ENDPOINTS } from "../utils/constants";

/**
 * Authentication API Service
 */
const authApi = {
  /**
   * Register new user
   */
  register: async (userData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  },

  /**
   * Login user
   */
  login: async (credentials) => {
    const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, credentials);
    return response.data;
  },

  /**
   * Verify email
   */
  verifyEmail: async (token) => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.VERIFY_EMAIL}?token=${token}`
    );
    return response.data;
  },

  /**
   * Verify mobile OTP
   */
  verifyMobile: async (otpData) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.VERIFY_MOBILE,
      otpData
    );
    return response.data;
  },

  /**
   * Resend OTP
   */
  resendOTP: async (userId) => {
    const response = await axiosInstance.post(API_ENDPOINTS.RESEND_OTP, {
      user_id: userId,
    });
    return response.data;
  },

  /**
   * Get user profile
   */
  getProfile: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.PROFILE);
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData) => {
    const response = await axiosInstance.put(
      API_ENDPOINTS.UPDATE_PROFILE,
      profileData
    );
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async () => {
    const response = await axiosInstance.post(API_ENDPOINTS.LOGOUT);
    return response.data;
  },
};

export default authApi;

import axiosInstance from "./axiosInstance";
import { API_ENDPOINTS } from "../utils/constants";

/**
 * Company API Service
 */
const companyApi = {
  /**
   * Register company profile
   */
  registerCompany: async (companyData) => {
    // If companyData is FormData, send as-is
    // Otherwise, convert to FormData if files are present
    const response = await axiosInstance.post(
      API_ENDPOINTS.COMPANY_REGISTER,
      companyData,
      {
        headers: {
          "Content-Type":
            companyData instanceof FormData
              ? "multipart/form-data"
              : "application/json",
        },
      }
    );
    return response.data;
  },

  /**
   * Get company profile
   */
  getCompanyProfile: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.COMPANY_PROFILE);
    return response.data;
  },

  /**
   * Update company profile
   */
  updateCompanyProfile: async (companyData) => {
    const response = await axiosInstance.put(
      API_ENDPOINTS.COMPANY_UPDATE,
      companyData,
      {
        headers: {
          "Content-Type":
            companyData instanceof FormData
              ? "multipart/form-data"
              : "application/json",
        },
      }
    );
    return response.data;
  },

  /**
   * Upload company logo
   */
  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append("logo", file);

    const response = await axiosInstance.post(
      API_ENDPOINTS.UPLOAD_LOGO,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  /**
   * Upload company banner
   */
  uploadBanner: async (file) => {
    const formData = new FormData();
    formData.append("banner", file);

    const response = await axiosInstance.post(
      API_ENDPOINTS.UPLOAD_BANNER,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  /**
   * Delete company logo
   */
  deleteLogo: async () => {
    const response = await axiosInstance.delete(API_ENDPOINTS.DELETE_LOGO);
    return response.data;
  },

  /**
   * Delete company banner
   */
  deleteBanner: async () => {
    const response = await axiosInstance.delete(API_ENDPOINTS.DELETE_BANNER);
    return response.data;
  },
};

export default companyApi;

import axiosInstance from "./axiosInstance";

export const companyApi = {
  // Register company profile
  registerCompany: async (formData) => {
    const response = await axiosInstance.post("/company/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get company profile
  getCompanyProfile: async () => {
    const response = await axiosInstance.get("/company/profile");
    return response.data;
  },

  // Update company profile
  updateCompanyProfile: async (formData) => {
    const response = await axiosInstance.put("/company/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Upload logo
  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append("logo", file);

    const response = await axiosInstance.post(
      "/company/upload-logo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Upload banner
  uploadBanner: async (file) => {
    const formData = new FormData();
    formData.append("banner", file);

    const response = await axiosInstance.post(
      "/company/upload-banner",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Delete logo
  deleteLogo: async () => {
    const response = await axiosInstance.delete("/company/logo");
    return response.data;
  },

  // Delete banner
  deleteBanner: async () => {
    const response = await axiosInstance.delete("/company/banner");
    return response.data;
  },
};

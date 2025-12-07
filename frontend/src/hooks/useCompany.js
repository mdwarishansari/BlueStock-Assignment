import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  setCompany,
  updateCompany,
  updateCompanyImages,
  setLoading,
  setError,
  clearCompany,
  selectCompany,
  selectHasCompany,
} from "../store/slices/companySlice";
import companyApi from "../api/companyApi";
import { ROUTES } from "../utils/constants";

/**
 * Custom hook for company operations
 */
export const useCompany = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const company = useSelector(selectCompany);
  const hasCompany = useSelector(selectHasCompany);
  const loading = useSelector((state) => state.company.loading);
  const error = useSelector((state) => state.company.error);

  /**
   * Register company profile
   */
  const registerCompany = async (companyData) => {
    try {
      dispatch(setLoading(true));

      // Prepare FormData if files are present
      let formData = companyData;

      if (!(companyData instanceof FormData)) {
        formData = new FormData();

        // Append all company data
        Object.keys(companyData).forEach((key) => {
          if (companyData[key] !== null && companyData[key] !== undefined) {
            if (
              key === "social_links" &&
              typeof companyData[key] === "object"
            ) {
              formData.append(key, JSON.stringify(companyData[key]));
            } else {
              formData.append(key, companyData[key]);
            }
          }
        });
      }

      const response = await companyApi.registerCompany(formData);

      if (response.success) {
        dispatch(setCompany(response.data.company));
        toast.success("Company registered successfully!");
        navigate(ROUTES.DASHBOARD);
        return response.data;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Company registration failed";
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Fetch company profile
   */
  const fetchCompanyProfile = async () => {
    try {
      dispatch(setLoading(true));
      const response = await companyApi.getCompanyProfile();

      if (response.success) {
        dispatch(setCompany(response.data.company));
        return response.data.company;
      }
    } catch (error) {
      // Don't show error toast for 404 (company not found)
      if (error.response?.status !== 404) {
        console.error("Fetch company profile error:", error);
      }
      dispatch(setCompany(null));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Update company profile
   */
  const updateCompanyProfile = async (companyData) => {
    try {
      dispatch(setLoading(true));

      // Prepare FormData if files are present
      let formData = companyData;

      if (!(companyData instanceof FormData)) {
        formData = new FormData();

        Object.keys(companyData).forEach((key) => {
          if (companyData[key] !== null && companyData[key] !== undefined) {
            if (
              key === "social_links" &&
              typeof companyData[key] === "object"
            ) {
              formData.append(key, JSON.stringify(companyData[key]));
            } else {
              formData.append(key, companyData[key]);
            }
          }
        });
      }

      const response = await companyApi.updateCompanyProfile(formData);

      if (response.success) {
        dispatch(updateCompany(response.data.company));
        toast.success("Company profile updated successfully!");
        return response.data;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Update failed";
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Upload company logo
   */
  const uploadLogo = async (file) => {
    try {
      dispatch(setLoading(true));
      const response = await companyApi.uploadLogo(file);

      if (response.success) {
        dispatch(updateCompanyImages({ logo_url: response.data.logo_url }));
        toast.success("Logo uploaded successfully!");
        return response.data;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Logo upload failed";
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Upload company banner
   */
  const uploadBanner = async (file) => {
    try {
      dispatch(setLoading(true));
      const response = await companyApi.uploadBanner(file);

      if (response.success) {
        dispatch(updateCompanyImages({ banner_url: response.data.banner_url }));
        toast.success("Banner uploaded successfully!");
        return response.data;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Banner upload failed";
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Delete company logo
   */
  const deleteLogo = async () => {
    try {
      dispatch(setLoading(true));
      const response = await companyApi.deleteLogo();

      if (response.success) {
        dispatch(updateCompanyImages({ logo_url: null }));
        toast.success("Logo deleted successfully!");
        return response.data;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Logo deletion failed";
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Delete company banner
   */
  const deleteBanner = async () => {
    try {
      dispatch(setLoading(true));
      const response = await companyApi.deleteBanner();

      if (response.success) {
        dispatch(updateCompanyImages({ banner_url: null }));
        toast.success("Banner deleted successfully!");
        return response.data;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Banner deletion failed";
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Clear company data (on logout)
   */
  const clearCompanyData = () => {
    dispatch(clearCompany());
  };

  return {
    // State
    company,
    hasCompany,
    loading,
    error,

    // Actions
    registerCompany,
    fetchCompanyProfile,
    updateCompanyProfile,
    uploadLogo,
    uploadBanner,
    deleteLogo,
    deleteBanner,
    clearCompanyData,
  };
};

export default useCompany;

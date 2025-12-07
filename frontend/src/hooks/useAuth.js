import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  loginSuccess,
  logout as logoutAction,
  setUser,
  setLoading,
  setError,
  registerSuccess,
  updateVerificationStatus,
  selectAuth,
  selectUser,
  selectIsAuthenticated,
} from "../store/slices/authSlice";
import authApi from "../api/authApi";
import { setAuthToken, clearAuthToken } from "../api/axiosInstance";
import { firebaseService } from "../config/firebase";
import { ROUTES } from "../utils/constants";

/**
 * Custom hook for authentication operations
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector(selectAuth);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  /**
   * Register new user
   */
  const register = async (userData) => {
    try {
      dispatch(setLoading(true));

      // Call backend API
      const response = await authApi.register(userData);

      if (response.success) {
        dispatch(registerSuccess({ user: response.data }));
        toast.success(response.message || "Registration successful!");
        return response.data;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Login user
   */
  const login = async (credentials) => {
    try {
      dispatch(setLoading(true));

      // Call backend API
      const response = await authApi.login(credentials);

      if (response.success) {
        const { token, user } = response.data;

        // Set auth token
        setAuthToken(token);

        // Update Redux state
        dispatch(loginSuccess({ token, user }));

        toast.success("Login successful!");
        navigate(ROUTES.DASHBOARD);

        return response.data;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      // Call backend logout API (optional)
      await authApi.logout().catch(() => {
        // Ignore logout API errors
      });

      // Firebase sign out
      await firebaseService.signOut().catch(() => {
        // Ignore Firebase errors
      });

      // Clear auth token
      clearAuthToken();

      // Update Redux state
      dispatch(logoutAction());

      toast.info("Logged out successfully");
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if API call fails
      clearAuthToken();
      dispatch(logoutAction());
      navigate(ROUTES.LOGIN);
    }
  };

  /**
   * Fetch user profile
   */
  const fetchProfile = async () => {
    try {
      dispatch(setLoading(true));
      const response = await authApi.getProfile();

      if (response.success) {
        dispatch(setUser(response.data.user));
        return response.data;
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (profileData) => {
    try {
      dispatch(setLoading(true));
      const response = await authApi.updateProfile(profileData);

      if (response.success) {
        dispatch(setUser(response.data.user));
        toast.success("Profile updated successfully!");
        return response.data;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Profile update failed";
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Verify mobile OTP
   */
  const verifyMobile = async (otpData) => {
    try {
      dispatch(setLoading(true));
      const response = await authApi.verifyMobile(otpData);

      if (response.success) {
        dispatch(updateVerificationStatus({ is_mobile_verified: true }));
        toast.success("Mobile verified successfully!");
        return response.data;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "OTP verification failed";
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Resend OTP
   */
  const resendOTP = async (userId) => {
    try {
      dispatch(setLoading(true));
      const response = await authApi.resendOTP(userId);

      if (response.success) {
        toast.success("OTP sent successfully!");
        return response.data;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send OTP";
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    // State
    user,
    isAuthenticated,
    loading: auth.loading,
    error: auth.error,

    // Actions
    register,
    login,
    logout,
    fetchProfile,
    updateProfile,
    verifyMobile,
    resendOTP,
  };
};

export default useAuth;

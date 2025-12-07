import { createSlice } from "@reduxjs/toolkit";
import { TOKEN_KEY, STORAGE_KEYS } from "../../utils/constants";

const initialState = {
  user: null,
  token: localStorage.getItem(TOKEN_KEY) || null,
  isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Login success
    loginSuccess: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

      // Store token in localStorage
      localStorage.setItem(TOKEN_KEY, token);
    },

    // Set user data
    setUser: (state, action) => {
      state.user = action.payload;
    },

    // Update user profile
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(STORAGE_KEYS.USER);
    },

    // Register success (similar to login but might need verification)
    registerSuccess: (state, action) => {
      const { user } = action.payload;
      state.user = user;
      state.loading = false;
      state.error = null;
    },

    // Update verification status
    updateVerificationStatus: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  loginSuccess,
  setUser,
  updateUserProfile,
  logout,
  registerSuccess,
  updateVerificationStatus,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

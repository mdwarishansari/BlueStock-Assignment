import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  company: null,
  loading: false,
  error: null,
  hasCompany: false,
};

const companySlice = createSlice({
  name: "company",
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

    // Set company data
    setCompany: (state, action) => {
      state.company = action.payload;
      state.hasCompany = !!action.payload;
      state.loading = false;
      state.error = null;
    },

    // Update company data
    updateCompany: (state, action) => {
      if (state.company) {
        state.company = {
          ...state.company,
          ...action.payload,
        };
      }
    },

    // Update company images
    updateCompanyImages: (state, action) => {
      if (state.company) {
        const { logo_url, banner_url } = action.payload;
        if (logo_url !== undefined) state.company.logo_url = logo_url;
        if (banner_url !== undefined) state.company.banner_url = banner_url;
      }
    },

    // Clear company data
    clearCompany: (state) => {
      state.company = null;
      state.hasCompany = false;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setCompany,
  updateCompany,
  updateCompanyImages,
  clearCompany,
} = companySlice.actions;

export default companySlice.reducer;

// Selectors
export const selectCompany = (state) => state.company.company;
export const selectHasCompany = (state) => state.company.hasCompany;
export const selectCompanyLoading = (state) => state.company.loading;
export const selectCompanyError = (state) => state.company.error;

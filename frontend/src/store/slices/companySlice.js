import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { companyApi } from "../../api/companyApi";
import { toast } from "react-toastify";

// Async thunks
export const registerCompany = createAsyncThunk(
  "company/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await companyApi.registerCompany(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCompanyProfile = createAsyncThunk(
  "company/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await companyApi.getCompanyProfile();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCompanyProfile = createAsyncThunk(
  "company/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await companyApi.updateCompanyProfile(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const uploadCompanyLogo = createAsyncThunk(
  "company/uploadLogo",
  async (file, { rejectWithValue }) => {
    try {
      const response = await companyApi.uploadLogo(file);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const uploadCompanyBanner = createAsyncThunk(
  "company/uploadBanner",
  async (file, { rejectWithValue }) => {
    try {
      const response = await companyApi.uploadBanner(file);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  company: null,
  loading: false,
  error: null,
  setupProgress: 0,
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setSetupProgress: (state, action) => {
      state.setupProgress = action.payload;
    },
    clearCompanyError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register Company
    builder
      .addCase(registerCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload.data.company;
        toast.success("Company registered successfully!");
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Company Profile
    builder
      .addCase(fetchCompanyProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload.data.company;
      })
      .addCase(fetchCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Company Profile
    builder
      .addCase(updateCompanyProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCompanyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload.data.company;
        toast.success("Company profile updated successfully!");
      })
      .addCase(updateCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Upload Logo
    builder
      .addCase(uploadCompanyLogo.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadCompanyLogo.fulfilled, (state, action) => {
        state.loading = false;
        if (state.company) {
          state.company.logo_url = action.payload.data.logo_url;
        }
        toast.success("Logo uploaded successfully!");
      })
      .addCase(uploadCompanyLogo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Upload Banner
    builder
      .addCase(uploadCompanyBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadCompanyBanner.fulfilled, (state, action) => {
        state.loading = false;
        if (state.company) {
          state.company.banner_url = action.payload.data.banner_url;
        }
        toast.success("Banner uploaded successfully!");
      })
      .addCase(uploadCompanyBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSetupProgress, clearCompanyError } = companySlice.actions;
export default companySlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../api/authApi";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

// -----------------------------
// Async Thunks
// -----------------------------
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const verifyMobileOTP = createAsyncThunk(
  "auth/verifyMobile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyMobile(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getProfile();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.updateProfile(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// -----------------------------
// Initial State
// -----------------------------
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  registrationData: null,
};

// -----------------------------
// Slice
// -----------------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.registrationData = null;
      Cookies.remove("token");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
    setRegistrationData: (state, action) => {
      state.registrationData = action.payload;
    },
  },

  // -----------------------------
  // Extra Reducers
  // -----------------------------
  extraReducers: (builder) => {
    // -----------------------------
    // REGISTER
    // -----------------------------
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.registrationData = action.payload.data;
        toast.success(action.payload.message);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // -----------------------------
    // LOGIN  (FIXED VERSION)
    // -----------------------------
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        // 🔥 FIXED: Ensure hasCompany exists in Redux state
        state.user = {
          ...action.payload.data.user,
          hasCompany: action.payload.data.user.hasCompany || false,
        };

        state.token = action.payload.data.token;
        state.isAuthenticated = true;

        Cookies.set("token", action.payload.data.token, { expires: 90 });
        localStorage.setItem("user", JSON.stringify(state.user));

        toast.success("Login successful!");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // -----------------------------
    // VERIFY MOBILE OTP
    // -----------------------------
    builder
      .addCase(verifyMobileOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyMobileOTP.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.is_mobile_verified = true;
        }
        toast.success(action.payload.message);
      })
      .addCase(verifyMobileOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // -----------------------------
    // FETCH PROFILE
    // -----------------------------
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;

        state.user = {
          ...action.payload.data.user,
          hasCompany: !!action.payload.data.company, // ensure boolean
        };

        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // -----------------------------
    // UPDATE PROFILE
    // -----------------------------
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;

        state.user = {
          ...state.user,
          ...action.payload.data.user,
        };

        localStorage.setItem("user", JSON.stringify(state.user));
        toast.success("Profile updated successfully!");
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, logout, clearError, setRegistrationData } =
  authSlice.actions;

export default authSlice.reducer;

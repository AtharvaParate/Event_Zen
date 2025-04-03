import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "../api/authApi";
import { setAlert } from "./uiSlice";
import { jwtDecode } from "jwt-decode";

// Check if the token is expired
const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
  } catch (error) {
    return true;
  }
};

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem("token", response.token);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      dispatch(setAlert({ type: "error", message }));
      return rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      dispatch(
        setAlert({
          type: "success",
          message: "Registration successful! Please log in.",
        })
      );
      return response;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      dispatch(setAlert({ type: "error", message }));
      return rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    localStorage.removeItem("token");
    dispatch(setAlert({ type: "success", message: "Logged out successfully" }));
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { dispatch }) => {
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      return { isAuthenticated: false, user: null };
    }

    try {
      const userData = jwtDecode(token);
      return { isAuthenticated: true, user: userData };
    } catch (error) {
      localStorage.removeItem("token");
      return { isAuthenticated: false, user: null };
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      // In a real app, this would make an API call to update the user
      // For our mock app, we'll just return the userData directly
      dispatch(
        setAlert({
          type: "success",
          message: "Profile updated successfully",
        })
      );
      return userData;
    } catch (error) {
      const message = error.response?.data?.message || "Profile update failed";
      dispatch(setAlert({ type: "error", message }));
      return rejectWithValue(message);
    }
  }
);

// Slice
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    // Add a simple action for direct profile updates
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })

      // Check Auth
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.isAuthenticated;
        state.user = action.payload.user;
      });
  },
});

export const { clearErrors, updateProfile } = authSlice.actions;
export default authSlice.reducer;

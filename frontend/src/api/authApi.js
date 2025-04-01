import axios from "axios";
import { API_CONFIG, getAuthHeader } from "../config/apiConfig";

// Create an axios instance for auth API
const authAxios = axios.create({
  baseURL: API_CONFIG.AUTH_API_URL,
  timeout: API_CONFIG.REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptors for request, etc.
authAxios.interceptors.request.use(
  (config) => {
    // For auth endpoints that need an existing token
    const authHeaders = getAuthHeader();
    if (authHeaders.Authorization) {
      config.headers.Authorization = authHeaders.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Login user
export const login = async (credentials) => {
  try {
    const response = await authAxios.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Register new user
export const register = async (userData) => {
  try {
    const response = await authAxios.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await authAxios.get("/auth/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

// Logout user (client side only)
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Update user profile
export const updateUserProfile = async (userData) => {
  try {
    const response = await authAxios.put("/auth/user", userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export default {
  login,
  register,
  getCurrentUser,
  logout,
  updateUserProfile,
};

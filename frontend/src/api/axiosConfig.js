import axios from "axios";
import { getToken, clearToken } from "../utils/authUtils";

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8081/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Set to true only if your backend supports credentials
});

// Request interceptor for adding token
axiosInstance.interceptors.request.use(
  (config) => {
    // Add token to request if available
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Redirect to login on unauthorized errors
    if (error.response && error.response.status === 401) {
      clearToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Create another instance for the event service
const eventApiInstance = axios.create({
  baseURL: process.env.REACT_APP_EVENT_API_URL || "http://localhost:8082/api",
  timeout: 30000, // Increased timeout
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Set to true only if your backend supports credentials
});

// Add request interceptor to log requests
eventApiInstance.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.url);
    console.log("Request data:", config.data);

    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to log responses
eventApiInstance.interceptors.response.use(
  (response) => {
    console.log("Received response from:", response.config.url);
    console.log("Response status:", response.status);
    return response;
  },
  (error) => {
    console.error("Response error:", error);

    if (error.response && error.response.status === 401) {
      clearToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export { axiosInstance, eventApiInstance };
export default axiosInstance;

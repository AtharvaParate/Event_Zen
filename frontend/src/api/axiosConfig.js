import axios from "axios";
import { getToken, clearToken } from "../utils/authUtils";

// Configure API base URLs with fallbacks
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8081/api";
const EVENT_API_URL =
  process.env.REACT_APP_EVENT_API_URL || "http://localhost:8082/api";

// Common request configuration
const commonConfig = {
  timeout: 30000, // Increased timeout for all requests
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Set to true only if your backend supports credentials
};

// For development mode, use mock data and prevent actual API calls
const isDevelopment = process.env.NODE_ENV === "development";
const useMockData = process.env.REACT_APP_USE_MOCK_DATA === "true";

// Create axios instance for the attendee service
const axiosInstance = axios.create({
  baseURL: API_URL,
  ...commonConfig,
});

// Create another instance for the event service
const eventApiInstance = axios.create({
  baseURL: EVENT_API_URL,
  ...commonConfig,
});

// Helper function to add auth token and log request
const setupRequestInterceptor = (instance, serviceName) => {
  instance.interceptors.request.use(
    (config) => {
      // Log the request for debugging
      console.log(`[${serviceName}] Request:`, {
        url: config.url,
        method: config.method,
        data: config.data,
      });

      // Add token to request if available
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // For mock mode, add a flag to indicate we're in mock mode
      if (isDevelopment && useMockData) {
        config.headers["x-mock-data"] = "true";
      }

      return config;
    },
    (error) => {
      console.error(`[${serviceName}] Request error:`, error);
      return Promise.reject(error);
    }
  );
};

// Helper function to handle response and log
const setupResponseInterceptor = (instance, serviceName) => {
  instance.interceptors.response.use(
    (response) => {
      console.log(`[${serviceName}] Response (${response.status}):`, {
        url: response.config.url,
        data: response.data,
      });
      return response;
    },
    (error) => {
      const errorResponse = error.response || {};

      console.error(
        `[${serviceName}] Error (${errorResponse.status || "Network Error"}):`,
        {
          url: error.config?.url,
          message: error.message,
          data: errorResponse.data,
        }
      );

      // Redirect to login on unauthorized errors
      if (errorResponse.status === 401) {
        clearToken();
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }
  );
};

// Apply interceptors to both instances
setupRequestInterceptor(axiosInstance, "Attendee API");
setupResponseInterceptor(axiosInstance, "Attendee API");
setupRequestInterceptor(eventApiInstance, "Event API");
setupResponseInterceptor(eventApiInstance, "Event API");

export { axiosInstance, eventApiInstance };
export default axiosInstance;

import axios from "axios";
import { getToken, clearToken } from "../utils/authUtils";
import { API_CONFIG, getAuthHeader } from "../config/apiConfig";

// Configure API base URLs with fallbacks
const API_URL = API_CONFIG.AUTH_API_URL;
const EVENT_API_URL = API_CONFIG.EVENT_API_URL;
const BUDGET_API_URL = API_CONFIG.BUDGET_API_URL;

// Common request configuration
const commonConfig = {
  timeout: 30000, // Increased timeout for all requests
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Set to true only if your backend supports credentials
};

// Create default axios instance with common configuration
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: API_CONFIG.REQUEST_TIMEOUT,
});

// Create another instance for the event service
const eventApiInstance = axios.create({
  baseURL: EVENT_API_URL,
  ...commonConfig,
});

// Create an instance for the budget service
const budgetApiInstance = axios.create({
  baseURL: BUDGET_API_URL,
  ...commonConfig,
});

// Add auth interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const authHeaders = getAuthHeader();
    if (authHeaders.Authorization) {
      config.headers["Authorization"] = authHeaders.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common error cases
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log detailed error information
    if (error.response) {
      console.error(`API Error: ${error.response.status}`, error.response.data);

      // Handle auth errors (e.g., redirect to login)
      if (error.response.status === 401) {
        console.warn("Authentication error - redirecting to login");
        // TODO: Redirect to login or dispatch auth error action
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }

    return Promise.reject(error);
  }
);

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

export { axiosInstance, eventApiInstance, budgetApiInstance };
export default axiosInstance;

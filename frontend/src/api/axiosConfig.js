import axios from "axios";
import { getToken, clearToken } from "../utils/authUtils";
import { API_CONFIG, getAuthHeader } from "../config/apiConfig";

// Configure API base URLs with fallbacks
const API_URL = API_CONFIG.AUTH_API_URL;
const EVENT_API_URL = API_CONFIG.EVENT_API_URL;
const BUDGET_API_URL = API_CONFIG.BUDGET_API_URL;
const ATTENDEE_API_URL = API_CONFIG.ATTENDEE_API_URL;

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

// Create an instance for the attendee service
const attendeeApiInstance = axios.create({
  baseURL: ATTENDEE_API_URL,
  ...commonConfig,
});

// Setup CORS and interceptors for all instances
const setupInstance = (instance, instanceName) => {
  // Add auth interceptor
  instance.interceptors.request.use(
    (config) => {
      const authHeaders = getAuthHeader();
      if (authHeaders.Authorization) {
        config.headers["Authorization"] = authHeaders.Authorization;
      }
      // Add CORS headers
      config.headers["Access-Control-Allow-Origin"] = "*";
      config.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, PATCH, OPTIONS";
      config.headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept, Authorization";
      return config;
    },
    (error) => {
      console.error(`${instanceName} request error:`, error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.error(`${instanceName} response error:`, error);
      if (error.response && error.response.status === 401) {
        // Clear token on 401 Unauthorized
        clearToken();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Apply setup to all instances
setupInstance(axiosInstance, "Auth API");
setupInstance(eventApiInstance, "Event API");
setupInstance(budgetApiInstance, "Budget API");
setupInstance(attendeeApiInstance, "Attendee API");

export { axiosInstance, eventApiInstance, budgetApiInstance, attendeeApiInstance };
export default axiosInstance;

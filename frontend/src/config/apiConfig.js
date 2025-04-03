/**
 * API Configuration for Event_Zen Application
 * This file centralizes all API endpoints and configuration
 */

// Base URLs for different services
export const API_CONFIG = {
  // Auth service API
  AUTH_API_URL:
    process.env.REACT_APP_AUTH_API_URL ||
    "http://eventzen-auth-service:8084/api",

  // Event service API
  EVENT_API_URL:
    process.env.REACT_APP_EVENT_API_URL ||
    "http://eventzen-event-service:8081/api",

  // Budget service API
  BUDGET_API_URL:
    process.env.REACT_APP_BUDGET_API_URL ||
    "http://eventzen-budget-service:8083/api",

  // Vendor service API
  VENDOR_API_URL:
    process.env.REACT_APP_VENDOR_API_URL || "http://localhost:8080/api",

  // Venue service API
  VENUE_API_URL:
    process.env.REACT_APP_VENUE_API_URL || "http://localhost:8080/api",

  // Feature flags
  USE_MOCK_DATA: true,

  // Environment
  NODE_ENV: process.env.NODE_ENV || "development",

  // Request timeout in milliseconds (increased from 30000)
  REQUEST_TIMEOUT: 60000,

  // Default pagination
  DEFAULT_PAGE_SIZE: 10,

  // Attendee service API
  ATTENDEE_API_URL:
    process.env.REACT_APP_ATTENDEE_API_URL || "http://localhost:8080/api",
};

// Authentication header builder
export const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// API endpoints for Budget service
export const BUDGET_ENDPOINTS = {
  BUDGETS: "/budgets",
  BUDGET_BY_ID: (id) => `/budgets/${id}`,
  BUDGET_BY_EVENT: (eventId) => `/budgets/event/${eventId}`,
  EXPENSES: "/expenses",
  EXPENSES_BY_BUDGET: (budgetId) => `/expenses/budget/${budgetId}`,
  EXPENSE_BY_ID: (id) => `/expenses/${id}`,
  INCOMES: "/incomes",
  INCOMES_BY_BUDGET: (budgetId) => `/incomes/budget/${budgetId}`,
  INCOME_BY_ID: (id) => `/incomes/${id}`,
};

// API endpoints for Event service
export const EVENT_ENDPOINTS = {
  EVENTS: "/events",
  EVENT_BY_ID: (id) => `/events/${id}`,
  EVENTS_BY_CATEGORY: (category) => `/events/category/${category}`,
  EVENTS_BY_ORGANIZER: (organizerId) => `/events/organizer/${organizerId}`,
  TICKET_TYPES: (eventId) => `/events/${eventId}/ticket-types`,
  EVENT_STATUS: (id, status) => `/events/${id}/status?status=${status}`,
  UPCOMING_EVENTS: "/events/upcoming",
};

export default API_CONFIG;

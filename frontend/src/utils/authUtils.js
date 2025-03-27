/**
 * Utility functions for authentication
 */

// Token key in localStorage
const TOKEN_KEY = "eventzen_token";
const USER_KEY = "eventzen_user";

/**
 * Store authentication token in localStorage
 * @param {string} token - JWT token
 */
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Get authentication token from localStorage
 * @returns {string|null} JWT token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove authentication token from localStorage
 */
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Store user data in localStorage
 * @param {Object} user - User data
 */
export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Get user data from localStorage
 * @returns {Object|null} User data or null if not found
 */
export const getUser = () => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Check if user has specific role
 * @param {string} role - Role to check
 * @returns {boolean} True if user has role, false otherwise
 */
export const hasRole = (role) => {
  const user = getUser();
  return user && user.role === role;
};

/**
 * Check if user is admin
 * @returns {boolean} True if admin, false otherwise
 */
export const isAdmin = () => {
  return hasRole("admin");
};

/**
 * Check if user is organizer
 * @returns {boolean} True if organizer, false otherwise
 */
export const isOrganizer = () => {
  return hasRole("organizer");
};

// Create a named variable for the export
const authUtils = {
  setToken,
  getToken,
  clearToken,
  setUser,
  getUser,
  isAuthenticated,
  hasRole,
  isAdmin,
  isOrganizer,
};

export default authUtils;

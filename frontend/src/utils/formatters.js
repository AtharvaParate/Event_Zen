/**
 * Utility functions for formatting values in the application
 */

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: USD)
 * @param {string} locale - The locale (default: en-US)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = "USD", locale = "en-US") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

/**
 * Format a date to a readable string
 * @param {string|Date} date - The date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return "N/A";

  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return new Intl.DateTimeFormat("en-US", mergedOptions).format(new Date(date));
};

/**
 * Format a percentage value
 * @param {number} value - The value to format as percentage
 * @param {number} fractionDigits - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, fractionDigits = 1) => {
  return `${(value || 0).toFixed(fractionDigits)}%`;
};

/**
 * Truncate text if it exceeds a certain length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

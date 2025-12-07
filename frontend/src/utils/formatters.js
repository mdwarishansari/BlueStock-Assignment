import { format, parseISO, isValid } from "date-fns";

/**
 * Format date to readable string
 */
export const formatDate = (date, formatStr = "MMM dd, yyyy") => {
  if (!date) return "N/A";

  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return "Invalid Date";
    return format(dateObj, formatStr);
  } catch (error) {
    return "Invalid Date";
  }
};

/**
 * Format date to ISO string for API
 */
export const formatDateForAPI = (date) => {
  if (!date) return null;

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toISOString().split("T")[0];
  } catch (error) {
    return null;
  }
};

/**
 * Format mobile number for display
 */
export const formatMobileNumber = (mobile) => {
  if (!mobile) return "";

  // Remove all non-digit characters except +
  const cleaned = mobile.replace(/[^\d+]/g, "");
  return cleaned;
};

/**
 * Format currency (INR)
 */
export const formatCurrency = (amount, currency = "INR") => {
  if (amount === null || amount === undefined) return "N/A";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Capitalize first letter
 */
export const capitalizeFirst = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Format gender label
 */
export const formatGender = (gender) => {
  const genderMap = {
    m: "Male",
    f: "Female",
    o: "Other",
  };
  return genderMap[gender] || gender;
};

/**
 * Extract initials from name
 */
export const getInitials = (name) => {
  if (!name) return "?";

  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Format URL (add https if missing)
 */
export const formatURL = (url) => {
  if (!url) return "";

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "https://" + url;
  }

  return url;
};

/**
 * Parse JSON safely
 */
export const safeJSONParse = (jsonString, defaultValue = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return defaultValue;
  }
};

/**
 * Format error message from API
 */
export const formatAPIError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    if (Array.isArray(errors)) {
      return errors.map((err) => err.msg).join(", ");
    }
    return errors;
  }

  if (error.message) {
    return error.message;
  }

  return "An unexpected error occurred";
};

/**
 * Generate random ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

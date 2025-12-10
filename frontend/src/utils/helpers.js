// Format date to readable string
export const formatDate = (date, format = "long") => {
  if (!date) return "";

  const d = new Date(date);

  if (format === "short") {
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  if (!phone) return "";

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Format as +XX XXXXX XXXXX
  if (cleaned.startsWith("91") && cleaned.length === 12) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }

  return phone;
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return "";

  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Check if object is empty
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Generate random color
export const generateRandomColor = () => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E2",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Parse error message from API response
export const parseErrorMessage = (error) => {
  if (typeof error === "string") return error;

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return "An unexpected error occurred";
};

// Convert object to FormData
export const objectToFormData = (
  obj,
  formData = new FormData(),
  namespace = ""
) => {
  for (let property in obj) {
    if (obj.hasOwnProperty(property)) {
      const formKey = namespace ? `${namespace}[${property}]` : property;

      if (obj[property] instanceof Date) {
        formData.append(formKey, obj[property].toISOString());
      } else if (
        typeof obj[property] === "object" &&
        !(obj[property] instanceof File)
      ) {
        if (obj[property] === null) {
          formData.append(formKey, "");
        } else {
          formData.append(formKey, JSON.stringify(obj[property]));
        }
      } else {
        formData.append(formKey, obj[property]);
      }
    }
  }
  return formData;
};

// Social media URL validators
export const validateSocialURL = (platform, url) => {
  const patterns = {
    facebook: /^https?:\/\/(www\.)?facebook\.com\/.+/,
    twitter: /^https?:\/\/(www\.)?twitter\.com\/.+/,
    linkedin: /^https?:\/\/(www\.)?linkedin\.com\/.+/,
    instagram: /^https?:\/\/(www\.)?instagram\.com\/.+/,
    youtube: /^https?:\/\/(www\.)?youtube\.com\/.+/,
  };

  return patterns[platform]?.test(url) || false;
};

// Local storage helpers
export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  },
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  },
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },
};

export default {
  formatDate,
  formatPhoneNumber,
  truncateText,
  getInitials,
  formatFileSize,
  debounce,
  deepClone,
  isEmpty,
  capitalize,
  generateRandomColor,
  parseErrorMessage,
  objectToFormData,
  validateSocialURL,
  storage,
};

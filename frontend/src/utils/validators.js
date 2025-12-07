import { parsePhoneNumber } from "libphonenumber-js";
import { VALIDATION_MESSAGES } from "./constants";

/**
 * Validate email address
 */
export const validateEmail = (email) => {
  if (!email) return VALIDATION_MESSAGES.REQUIRED;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return VALIDATION_MESSAGES.EMAIL_INVALID;
  }

  return true;
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  if (!password) return VALIDATION_MESSAGES.REQUIRED;

  if (password.length < 8) {
    return VALIDATION_MESSAGES.PASSWORD_MIN;
  }

  // Must contain: uppercase, lowercase, number, special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/;
  if (!passwordRegex.test(password)) {
    return VALIDATION_MESSAGES.PASSWORD_PATTERN;
  }

  return true;
};

/**
 * Validate mobile number with country code
 */
export const validateMobile = (mobile) => {
  if (!mobile) return VALIDATION_MESSAGES.REQUIRED;

  try {
    // Remove spaces and dashes
    const cleanedNumber = mobile.replace(/[\s-]/g, "");

    // Parse phone number
    const phoneNumber = parsePhoneNumber(cleanedNumber);

    if (!phoneNumber || !phoneNumber.isValid()) {
      return VALIDATION_MESSAGES.MOBILE_INVALID;
    }

    return true;
  } catch (error) {
    return VALIDATION_MESSAGES.MOBILE_INVALID;
  }
};

/**
 * Validate URL/Website
 */
export const validateWebsite = (url) => {
  if (!url) return true; // Optional field

  try {
    const urlRegex =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlRegex.test(url)) {
      return VALIDATION_MESSAGES.WEBSITE_INVALID;
    }
    return true;
  } catch (error) {
    return VALIDATION_MESSAGES.WEBSITE_INVALID;
  }
};

/**
 * Validate postal code
 */
export const validatePostalCode = (postalCode) => {
  if (!postalCode) return VALIDATION_MESSAGES.REQUIRED;

  // Basic validation - alphanumeric, 3-10 characters
  const postalRegex = /^[A-Za-z0-9]{3,10}$/;
  if (!postalRegex.test(postalCode)) {
    return VALIDATION_MESSAGES.POSTAL_CODE_INVALID;
  }

  return true;
};

/**
 * Validate file size
 */
export const validateFileSize = (file, maxSize = 5 * 1024 * 1024) => {
  if (!file) return true;

  if (file.size > maxSize) {
    return VALIDATION_MESSAGES.FILE_SIZE_EXCEEDED;
  }

  return true;
};

/**
 * Validate file type (images)
 */
export const validateImageType = (file) => {
  if (!file) return true;

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return VALIDATION_MESSAGES.FILE_TYPE_INVALID;
  }

  return true;
};

/**
 * Validate required field
 */
export const validateRequired = (value, fieldName = "This field") => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return `${fieldName} is required`;
  }
  return true;
};

/**
 * Validate date (not in future)
 */
export const validatePastDate = (date) => {
  if (!date) return true; // Optional

  const selectedDate = new Date(date);
  const today = new Date();

  if (selectedDate > today) {
    return "Date cannot be in the future";
  }

  return true;
};

/**
 * Validate OTP (6 digits)
 */
export const validateOTP = (otp) => {
  if (!otp) return VALIDATION_MESSAGES.REQUIRED;

  const otpRegex = /^\d{6}$/;
  if (!otpRegex.test(otp)) {
    return "OTP must be 6 digits";
  }

  return true;
};

/**
 * Validate confirm password
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return VALIDATION_MESSAGES.REQUIRED;

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return true;
};

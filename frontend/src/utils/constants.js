// API Constants
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:4000";

// App Constants
export const APP_NAME =
  import.meta.env.VITE_APP_NAME || "BlueStock Company Portal";
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || "1.0.0";

// JWT Token Key
export const TOKEN_KEY = "bluestock_auth_token";

// Gender Options
export const GENDER_OPTIONS = [
  { value: "m", label: "Male" },
  { value: "f", label: "Female" },
  { value: "o", label: "Other" },
];

// Industry Options
export const INDUSTRY_OPTIONS = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Real Estate",
  "Transportation",
  "Entertainment",
  "Food & Beverage",
  "Consulting",
  "Marketing",
  "Construction",
  "Energy",
  "Agriculture",
  "Telecommunications",
  "Hospitality",
  "E-commerce",
  "Automotive",
  "Other",
];

// Country Options (Sample - Add more as needed)
export const COUNTRY_OPTIONS = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
  "Singapore",
  "United Arab Emirates",
];

// Social Media Platforms
export const SOCIAL_PLATFORMS = [
  { key: "website", label: "Website", icon: "🌐" },
  { key: "linkedin", label: "LinkedIn", icon: "💼" },
  { key: "twitter", label: "Twitter", icon: "🐦" },
  { key: "facebook", label: "Facebook", icon: "📘" },
  { key: "instagram", label: "Instagram", icon: "📷" },
  { key: "youtube", label: "YouTube", icon: "▶️" },
];

// File Upload Constants
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Toast Configuration
export const TOAST_CONFIG = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  EMAIL_INVALID: "Please enter a valid email address",
  PASSWORD_MIN: "Password must be at least 8 characters",
  PASSWORD_PATTERN:
    "Password must contain uppercase, lowercase, number and special character",
  MOBILE_INVALID: "Please enter a valid mobile number",
  WEBSITE_INVALID: "Please enter a valid URL",
  POSTAL_CODE_INVALID: "Please enter a valid postal code",
  FILE_SIZE_EXCEEDED: "File size should not exceed 5MB",
  FILE_TYPE_INVALID: "Only JPG, PNG, and WebP images are allowed",
};

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  COMPANY_REGISTRATION: "/company/register",
  SETTINGS: "/settings",
  PROFILE: "/profile",
  EMAIL_VERIFIED: "/email-verified",
  VERIFY_ACCOUNT: "/verify-account",
  NOT_FOUND: "*",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "bluestock_auth_token",
  USER: "bluestock_user_data",
  REMEMBER_ME: "bluestock_remember_me",
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  VERIFY_EMAIL: "/auth/verify-email",
  VERIFY_MOBILE: "/auth/verify-mobile",
  RESEND_OTP: "/auth/resend-otp",
  LOGOUT: "/auth/logout",
  PROFILE: "/auth/profile",
  UPDATE_PROFILE: "/auth/profile",

  // Company
  COMPANY_REGISTER: "/company/register",
  COMPANY_PROFILE: "/company/profile",
  COMPANY_UPDATE: "/company/profile",
  UPLOAD_LOGO: "/company/upload-logo",
  UPLOAD_BANNER: "/company/upload-banner",
  DELETE_LOGO: "/company/logo",
  DELETE_BANNER: "/company/banner",
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

// Query Keys for React Query
export const QUERY_KEYS = {
  USER_PROFILE: "userProfile",
  COMPANY_PROFILE: "companyProfile",
  AUTH_USER: "authUser",
};

// Default Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

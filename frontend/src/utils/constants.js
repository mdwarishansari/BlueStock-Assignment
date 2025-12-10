// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    VERIFY_EMAIL: "/auth/verify-email",
    VERIFY_MOBILE: "/auth/verify-mobile",
    RESEND_OTP: "/auth/resend-otp",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    PROFILE: "/auth/profile",
  },
  COMPANY: {
    REGISTER: "/company/register",
    PROFILE: "/company/profile",
    UPLOAD_LOGO: "/company/upload-logo",
    UPLOAD_BANNER: "/company/upload-banner",
    DELETE_LOGO: "/company/logo",
    DELETE_BANNER: "/company/banner",
  },
};

// Gender options
export const GENDER_OPTIONS = [
  { value: "m", label: "Male" },
  { value: "f", label: "Female" },
  { value: "o", label: "Other" },
];

// Industry types
export const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "E-commerce",
  "Manufacturing",
  "Real Estate",
  "Retail",
  "Transportation",
  "Food & Beverage",
  "Entertainment",
  "Consulting",
  "Marketing",
  "Construction",
  "Agriculture",
  "Energy",
  "Telecommunications",
  "Pharmaceutical",
  "Legal",
  "Other",
];

// Team sizes
export const TEAM_SIZES = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1000+", label: "1000+ employees" },
];

// Organization types
export const ORGANIZATION_TYPES = [
  { value: "private", label: "Private Company" },
  { value: "public", label: "Public Company" },
  { value: "non-profit", label: "Non-Profit Organization" },
  { value: "government", label: "Government Agency" },
  { value: "startup", label: "Startup" },
];

// Social media platforms
export const SOCIAL_PLATFORMS = [
  {
    value: "facebook",
    label: "Facebook",
    icon: "📘",
    placeholder: "https://facebook.com/yourpage",
  },
  {
    value: "twitter",
    label: "Twitter",
    icon: "🐦",
    placeholder: "https://twitter.com/yourhandle",
  },
  {
    value: "instagram",
    label: "Instagram",
    icon: "📷",
    placeholder: "https://instagram.com/yourprofile",
  },
  {
    value: "linkedin",
    label: "LinkedIn",
    icon: "💼",
    placeholder: "https://linkedin.com/company/yourcompany",
  },
  {
    value: "youtube",
    label: "YouTube",
    icon: "▶️",
    placeholder: "https://youtube.com/c/yourchannel",
  },
];

// Countries (sample list - expand as needed)
export const COUNTRIES = [
  { value: "IN", label: "India" },
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "JP", label: "Japan" },
  { value: "SG", label: "Singapore" },
  { value: "AE", label: "United Arab Emirates" },
];

// File upload constraints
export const FILE_CONSTRAINTS = {
  LOGO: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ACCEPTED_FORMATS: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    MIN_DIMENSIONS: { width: 100, height: 100 },
    RECOMMENDED_DIMENSIONS: { width: 400, height: 400 },
  },
  BANNER: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ACCEPTED_FORMATS: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    MIN_DIMENSIONS: { width: 1200, height: 300 },
    RECOMMENDED_DIMENSIONS: { width: 1520, height: 400 },
  },
};

// Regex patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  POSTAL_CODE: /^[A-Z0-9\s-]{3,10}$/i,
};

// Toast messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    LOGIN: "Login successful!",
    REGISTER: "Registration successful!",
    PROFILE_UPDATE: "Profile updated successfully!",
    COMPANY_UPDATE: "Company profile updated successfully!",
    LOGO_UPLOAD: "Logo uploaded successfully!",
    BANNER_UPLOAD: "Banner uploaded successfully!",
    EMAIL_VERIFIED: "Email verified successfully!",
    MOBILE_VERIFIED: "Mobile verified successfully!",
    OTP_SENT: "OTP sent successfully!",
    PASSWORD_RESET: "Password reset successfully!",
  },
  ERROR: {
    LOGIN_FAILED: "Login failed. Please check your credentials.",
    REGISTER_FAILED: "Registration failed. Please try again.",
    NETWORK_ERROR: "Network error. Please check your connection.",
    UNAUTHORIZED: "Session expired. Please login again.",
    SERVER_ERROR: "Server error. Please try again later.",
    VALIDATION_ERROR: "Please check your input and try again.",
    FILE_TOO_LARGE: "File size exceeds the maximum limit.",
    INVALID_FILE_TYPE: "Invalid file type. Please upload a valid image.",
  },
};

// Routes
export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/dashboard",
  COMPANY_SETUP: "/company-setup",
  PROFILE_EDIT: "/dashboard/profile-edit",
  COMPANY_EDIT: "/dashboard/company-edit",
  VERIFICATION: "/dashboard/verification",
};

// Local storage keys
export const STORAGE_KEYS = {
  USER: "user",
  TOKEN: "token",
  THEME: "theme",
  SIDEBAR_STATE: "sidebarOpen",
};

// Date formats
export const DATE_FORMATS = {
  SHORT: "MM/DD/YYYY",
  LONG: "MMMM DD, YYYY",
  API: "YYYY-MM-DD",
  DISPLAY: "DD MMM YYYY",
};

export default {
  API_ENDPOINTS,
  GENDER_OPTIONS,
  INDUSTRIES,
  TEAM_SIZES,
  ORGANIZATION_TYPES,
  SOCIAL_PLATFORMS,
  COUNTRIES,
  FILE_CONSTRAINTS,
  REGEX_PATTERNS,
  TOAST_MESSAGES,
  ROUTES,
  STORAGE_KEYS,
  DATE_FORMATS,
};

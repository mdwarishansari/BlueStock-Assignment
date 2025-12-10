import * as yup from "yup";

// Password validation regex
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Validation schemas
export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const registerSchema = yup.object({
  full_name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Full name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  mobile_no: yup
    .string()
    .min(10, "Invalid mobile number")
    .required("Mobile number is required"),
  gender: yup
    .string()
    .oneOf(["m", "f", "o"], "Invalid gender")
    .required("Gender is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      passwordRegex,
      "Password must contain uppercase, lowercase, number and special character"
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  agree: yup.boolean().oneOf([true], "You must agree to terms and conditions"),
});

export const companyBasicSchema = yup.object({
  company_name: yup
    .string()
    .min(2, "Company name must be at least 2 characters")
    .required("Company name is required"),
  description: yup.string(),
});

export const companyFoundingSchema = yup.object({
  industry: yup.string().required("Industry is required"),
  founded_date: yup.date().nullable(),
  website: yup.string().url("Invalid URL format").nullable(),
});

export const companyContactSchema = yup.object({
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  country: yup.string().required("Country is required"),
  postal_code: yup.string().required("Postal code is required"),
});

// Helper validation functions
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password) => {
  return passwordRegex.test(password);
};

export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// File validation
export const validateImageFile = (file, maxSizeMB = 5) => {
  if (!file) return { valid: false, error: "No file selected" };

  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Only JPEG, PNG, and WebP images are allowed",
    };
  }

  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
};

export default {
  loginSchema,
  registerSchema,
  companyBasicSchema,
  companyFoundingSchema,
  companyContactSchema,
  validateEmail,
  validatePhone,
  validatePassword,
  validateURL,
  validateImageFile,
};

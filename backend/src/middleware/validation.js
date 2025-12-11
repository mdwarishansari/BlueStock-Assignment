const { body, validationResult } = require("express-validator");
const sanitize = require("sanitize-html");

// =========================
// VALIDATION RULES
// =========================
const validationRules = {
  // User registration
  register: [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please provide a valid email")
      .normalizeEmail(),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
      .withMessage(
        "Password must contain uppercase, lowercase, number, special character"
      ),

    body("full_name")
      .trim()
      .notEmpty()
      .withMessage("Full name is required")
      .isLength({ min: 2, max: 255 })
      .withMessage("Full name must be 2–255 chars")
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage("Full name can contain letters & spaces only"),

    body("gender")
      .trim()
      .notEmpty()
      .withMessage("Gender is required")
      .isIn(["m", "f", "o"])
      .withMessage("Gender must be m, f, or o"),

    body("mobile_no")
      .trim()
      .notEmpty()
      .withMessage("Mobile number is required")
      .matches(/^\+[1-9]\d{1,14}$/)
      .withMessage("Enter valid mobile number with country code"),

    body("signup_type").optional().isIn(["e"]),
  ],

  // Login
  login: [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please provide a valid email"),

    body("password").trim().notEmpty().withMessage("Password is required"),
  ],

  // OTP verification
  verifyMobile: [
    body("user_id").notEmpty().withMessage("User ID required").isInt(),
    body("otp").trim().notEmpty().isLength({ min: 6, max: 6 }).isNumeric(),
  ],

  // Forgot password
  forgotPassword: [body("email").trim().notEmpty().isEmail().normalizeEmail()],

  // Reset password
  resetPassword: [
    body("email").trim().notEmpty().isEmail().normalizeEmail(),
    body("new_password")
      .trim()
      .notEmpty()
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/),
  ],

  // ==============================
  // COMPANY REGISTRATION (FIXED)
  // ==============================
  companyRegister: [
    body("company_name")
      .trim()
      .notEmpty()
      .withMessage("Company name is required")
      .isLength({ min: 2, max: 255 }),

    body("address").trim().notEmpty().withMessage("Address is required"),
    body("city").trim().notEmpty().withMessage("City is required"),
    body("state").trim().notEmpty().withMessage("State is required"),
    body("country").trim().notEmpty().withMessage("Country is required"),
    body("postal_code")
      .trim()
      .notEmpty()
      .withMessage("Postal code is required"),

    body("industry").trim().notEmpty().withMessage("Industry is required"),

    // Optional website
    body("website").optional().isURL().withMessage("Invalid website URL"),

    // Optional founded_date
    body("founded_date")
      .optional()
      .isISO8601()
      .withMessage("Invalid date format"),

    // Optional description
    body("description").optional().trim().isLength({ max: 1000 }),

    // ★ NEW FIELDS — matching your frontend ★
    body("organization_type").optional().isString(),
    body("team_size").optional().isString(),
    body("vision").optional().isString(),
    body("phone").optional().isString(),
    body("contact_email")
      .optional()
      .isEmail()
      .withMessage("Invalid contact email"),

    // Social links as JSON
    body("social_links")
      .optional()
      .custom((value) => {
        if (typeof value === "string") {
          JSON.parse(value);
        }
        return true;
      }),
  ],

  // COMPANY UPDATE
  companyUpdate: [
    body("company_name").optional().trim().isLength({ min: 2, max: 255 }),
    body("address").optional().trim(),
    body("city").optional().trim(),
    body("state").optional().trim(),
    body("country").optional().trim(),
    body("postal_code").optional().trim(),
    body("industry").optional().trim(),
    body("website").optional().isURL(),
    body("founded_date").optional().isISO8601(),
    body("description").optional().trim().isLength({ max: 1000 }),
    body("organization_type").optional().isString(),
    body("team_size").optional().isString(),
    body("vision").optional().isString(),
    body("phone").optional().isString(),
    body("contact_email").optional().isEmail(),
    body("social_links")
      .optional()
      .custom((value) => {
        if (typeof value === "string") JSON.parse(value);
        return true;
      }),
  ],
};

// =========================
// VALIDATION MIDDLEWARE
// =========================
const validate = (rules) => {
  return async (req, res, next) => {
    await Promise.all(rules.map((rule) => rule.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  };
};

// =========================
// SANITIZATION (SAFE FOR MULTIPART)
// =========================
const sanitizeInput = (req, res, next) => {
  try {
    if ((req.headers["content-type"] || "").includes("multipart/form-data")) {
      return next();
    }
  } catch {}

  const clean = (obj) => {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj;

    const output = {};
    for (const [key, val] of Object.entries(obj)) {
      if (typeof val === "string") {
        output[key] = sanitize(val, {
          allowedTags: [],
          allowedAttributes: {},
        }).trim();
      } else if (typeof val === "object") {
        output[key] = clean(val);
      } else {
        output[key] = val;
      }
    }
    return output;
  };

  req.body = clean(req.body);
  req.query = clean(req.query);
  req.params = clean(req.params);

  next();
};

module.exports = {
  validationRules,
  validate,
  sanitizeInput,
};

const { body, param, query, validationResult } = require('express-validator');
const createError = require('http-errors');

// Common validation rules
const validationRules = {
  // Registration validation
  register: [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    
    body('password')
      .trim()
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase, one lowercase, one number and one special character'),
    
    body('full_name')
      .trim()
      .notEmpty().withMessage('Full name is required')
      .isLength({ min: 2, max: 255 }).withMessage('Full name must be between 2 and 255 characters')
      .matches(/^[a-zA-Z\s]+$/).withMessage('Full name can only contain letters and spaces'),
    
    body('gender')
      .trim()
      .notEmpty().withMessage('Gender is required')
      .isIn(['m', 'f', 'o']).withMessage('Gender must be m, f, or o'),
    
    body('mobile_no')
      .trim()
      .notEmpty().withMessage('Mobile number is required')
      .matches(/^\+[1-9]\d{1,14}$/).withMessage('Please provide a valid mobile number with country code (e.g., +919876543210)'),
    
    body('signup_type')
      .optional()
      .isIn(['e']).withMessage('Signup type must be "e"')
  ],

  // Login validation
  login: [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email'),
    
    body('password')
      .trim()
      .notEmpty().withMessage('Password is required')
  ],

  // Mobile verification validation
  verifyMobile: [
    body('user_id')
      .notEmpty().withMessage('User ID is required')
      .isInt().withMessage('User ID must be a number'),
    
    body('otp')
      .trim()
      .notEmpty().withMessage('OTP is required')
      .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
      .isNumeric().withMessage('OTP must contain only numbers')
  ],

  // Company registration validation
  companyRegister: [
    body('company_name')
      .trim()
      .notEmpty().withMessage('Company name is required')
      .isLength({ min: 2, max: 255 }).withMessage('Company name must be between 2 and 255 characters'),
    
    body('address')
      .trim()
      .notEmpty().withMessage('Address is required'),
    
    body('city')
      .trim()
      .notEmpty().withMessage('City is required'),
    
    body('state')
      .trim()
      .notEmpty().withMessage('State is required'),
    
    body('country')
      .trim()
      .notEmpty().withMessage('Country is required'),
    
    body('postal_code')
      .trim()
      .notEmpty().withMessage('Postal code is required'),
    
    body('industry')
      .trim()
      .notEmpty().withMessage('Industry is required'),
    
    body('website')
      .optional()
      .isURL().withMessage('Please provide a valid website URL'),
    
    body('founded_date')
      .optional()
      .isDate().withMessage('Please provide a valid date (YYYY-MM-DD)'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    
    body('social_links')
      .optional()
      .isObject().withMessage('Social links must be an object')
  ],

  // Company update validation
  companyUpdate: [
    body('company_name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 255 }).withMessage('Company name must be between 2 and 255 characters'),
    
    // Add other fields as optional
  ]
};

// Validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    // Run validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check for errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Extract error messages
    const errorMessages = errors.array().map(err => err.msg);
    
    // Create error response
    const error = createError(400, 'Validation failed', {
      errors: errorMessages
    });
    
    next(error);
  };
};

// Sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Sanitize body, query, and params
  const sanitize = require('sanitize-html');
  
  const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitize(value, {
          allowedTags: [], // No HTML tags allowed
          allowedAttributes: {}
        }).trim();
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };

  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  req.params = sanitizeObject(req.params);

  next();
};

module.exports = {
  validationRules,
  validate,
  sanitizeInput
};
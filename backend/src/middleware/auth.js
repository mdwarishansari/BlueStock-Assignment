const createError = require("http-errors");
const jwtUtils = require("../utils/jwt");
const userModel = require("../models/userModel");
const { logger } = require("../utils/logger");

const authMiddleware = {
  // Verify JWT token
  authenticateToken: async (req, res, next) => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      const token = jwtUtils.extractToken(authHeader);

      if (!token) {
        throw createError(401, "Access token is required");
      }

      // Verify token
      const decoded = jwtUtils.verifyToken(token);

      // Check if user exists
      const user = await userModel.findById(decoded.userId);

      if (!user) {
        throw createError(401, "User not found");
      }

      // Check if email is verified (optional, based on requirements)
      if (!user.is_email_verified) {
        throw createError(403, "Please verify your email first");
      }

      // Attach user to request object
      req.user = {
        id: user.id,
        email: user.email,
        is_email_verified: user.is_email_verified,
        is_mobile_verified: user.is_mobile_verified,
      };

      next();
    } catch (error) {
      logger.error("Auth middleware error:", error.message);

      if (error.status === 401 || error.status === 403) {
        next(error);
      } else {
        next(createError(401, "Invalid or expired token"));
      }
    }
  },

  // Check if user is verified (both email and mobile)
  requireVerifiedUser: async (req, res, next) => {
    try {
      if (!req.user) {
        throw createError(401, "Authentication required");
      }

      // Check both verifications
      if (!req.user.is_email_verified) {
        throw createError(403, "Email verification required");
      }

      if (!req.user.is_mobile_verified) {
        throw createError(403, "Mobile verification required");
      }

      next();
    } catch (error) {
      logger.error("Require verified user error:", error.message);
      next(error);
    }
  },

  // Optional authentication (for public routes that need user info if available)
  optionalAuth: async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      const token = jwtUtils.extractToken(authHeader);

      if (token) {
        const decoded = jwtUtils.verifyToken(token);
        const user = await userModel.findById(decoded.userId);

        if (user) {
          req.user = {
            id: user.id,
            email: user.email,
            is_email_verified: user.is_email_verified,
            is_mobile_verified: user.is_mobile_verified,
          };
        }
      }

      next();
    } catch (error) {
      // Don't throw error for optional auth, just continue without user
      next();
    }
  },

  // Check if user owns the resource (for company operations)
  checkCompanyOwnership: async (req, res, next) => {
    try {
      const companyId = req.params.id || req.body.company_id;

      if (!companyId) {
        throw createError(400, "Company ID is required");
      }

      // In this app, each user can only have one company
      // So we check if the user has a company profile
      const userWithCompany = await userModel.getUserWithCompany(req.user.id);

      if (!userWithCompany || !userWithCompany.company_id) {
        throw createError(404, "Company profile not found");
      }

      // Attach company to request
      req.company = {
        id: userWithCompany.company_id,
        owner_id: req.user.id,
      };

      next();
    } catch (error) {
      logger.error("Check company ownership error:", error.message);
      next(error);
    }
  },

  // Rate limiting helper (already implemented in server.js)
  // This is for specific endpoint rate limiting
  createRateLimiter: (windowMs = 15 * 60 * 1000, max = 100) => {
    const rateLimit = require("express-rate-limit");

    return rateLimit({
      windowMs,
      max,
      message: {
        success: false,
        message: "Too many requests from this IP, please try again later.",
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
  },

  // Brute force protection for login
  loginRateLimiter: () => {
    const rateLimit = require("express-rate-limit");

    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // 5 attempts per window
      message: {
        success: false,
        message: "Too many login attempts. Please try again later.",
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
  },
};

module.exports = authMiddleware;

const createError = require("http-errors");
const jwtUtils = require("../utils/jwt");
const userModel = require("../models/userModel");
const { logger } = require("../utils/logger");

const authMiddleware = {
  // Verify JWT token
  authenticateToken: async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      const token = jwtUtils.extractToken(authHeader);

      if (!token) {
        throw createError(401, "Access token is required");
      }

      const decoded = jwtUtils.verifyToken(token);
      const user = await userModel.findById(decoded.userId);

      if (!user) {
        throw createError(401, "User not found");
      }

      // 🔥 Allow /auth/profile even if NOT verified
      if (req.originalUrl.includes("/api/auth/profile")) {
        req.user = {
          id: user.id,
          email: user.email,
          is_email_verified: user.is_email_verified,
          is_mobile_verified: user.is_mobile_verified,
        };
        return next();
      }

      // ✅ Allow company-setup even if not verified (they need to access it after login)
      if (req.originalUrl.includes("/api/company/")) {
        // In dev mode, allow company routes even if email not verified
        if (process.env.NODE_ENV === "development" || user.is_email_verified) {
          req.user = {
            id: user.id,
            email: user.email,
            is_email_verified: user.is_email_verified,
            is_mobile_verified: user.is_mobile_verified,
          };
          return next();
        }
      }

      // ❌ Block other routes until verified (in production only)
      if (!user.is_email_verified && process.env.NODE_ENV !== "development") {
        throw createError(403, "Please verify your email first");
      }

      // Normal attach user
      req.user = {
        id: user.id,
        email: user.email,
        is_email_verified: user.is_email_verified,
        is_mobile_verified: user.is_mobile_verified,
      };

      next();
    } catch (error) {
      logger.error("Auth middleware error:", error.message);
      next(error);
    }
  },

  // ... rest of the middleware code stays the same
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
      next();
    }
  },

  checkCompanyOwnership: async (req, res, next) => {
    try {
      const companyId = req.params.id || req.body.company_id;

      if (!companyId) {
        throw createError(400, "Company ID is required");
      }

      const userWithCompany = await userModel.getUserWithCompany(req.user.id);

      if (!userWithCompany || !userWithCompany.company_id) {
        throw createError(404, "Company profile not found");
      }

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

  loginRateLimiter: () => {
    const rateLimit = require("express-rate-limit");

    return rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
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

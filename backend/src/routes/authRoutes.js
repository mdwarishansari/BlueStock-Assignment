const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  validationRules,
  validate,
  sanitizeInput,
} = require("../middleware/validation");
const authMiddleware = require("../middleware/auth");

// Apply sanitization to all routes
router.use(sanitizeInput);

// Public routes
router.post(
  "/register",
  validationRules.register,
  validate(validationRules.register),
  authController.register
);

router.post(
  "/login",
  validationRules.login,
  validate(validationRules.login),
  authMiddleware.loginRateLimiter(),
  authController.login
);

router.get("/verify-email", authController.verifyEmail);

router.post(
  "/verify-mobile",
  validationRules.verifyMobile,
  validate(validationRules.verifyMobile),
  authController.verifyMobile
);

router.post("/resend-otp", authController.resendOTP);

// Protected routes (require authentication)
router.use(authMiddleware.authenticateToken);

router.get("/profile", authController.getProfile);

router.put("/profile", authController.updateProfile);

router.post("/logout", authController.logout);

module.exports = router;

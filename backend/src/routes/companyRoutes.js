const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");
const {
  validationRules,
  validate,
  sanitizeInput,
} = require("../middleware/validation");
const authMiddleware = require("../middleware/auth");
const uploadMiddleware = require("../middleware/uploadMiddleware");

// Apply sanitization to all routes
router.use(sanitizeInput);

// All company routes require authentication
router.use(authMiddleware.authenticateToken);

// Company profile routes
router.post(
  "/register",
  uploadMiddleware.uploadCompanyImages,
  validationRules.companyRegister,
  validate(validationRules.companyRegister),
  companyController.registerCompany
);

router.get("/profile", companyController.getCompanyProfile);

router.put(
  "/profile",
  uploadMiddleware.uploadCompanyImages,
  validationRules.companyUpdate,
  validate(validationRules.companyUpdate),
  companyController.updateCompanyProfile
);

// File upload routes
router.post(
  "/upload-logo",
  uploadMiddleware.uploadLogo,
  uploadMiddleware.validateImageUpload("logo"),
  companyController.uploadLogo
);

router.post(
  "/upload-banner",
  uploadMiddleware.uploadBanner,
  uploadMiddleware.validateImageUpload("banner"),
  companyController.uploadBanner
);

router.delete("/logo", companyController.deleteLogo);

router.delete("/banner", companyController.deleteBanner);

module.exports = router;

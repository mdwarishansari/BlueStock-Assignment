// backend/src/routes/companyRoutes.js
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

// Auth first (keep auth)
router.use(authMiddleware.authenticateToken);

// NOTE: keeping sanitizeInput globally is OK now because it skips multipart requests
// router.use(sanitizeInput);

// Company profile routes
router.post(
  "/register",
  uploadMiddleware.uploadCompanyImages, // multer -> populates req.body
  validate(validationRules.companyRegister), // then validate parsed fields
  companyController.registerCompany
);

router.get("/profile", companyController.getCompanyProfile);

router.put(
  "/profile",
  uploadMiddleware.uploadCompanyImages,
  validate(validationRules.companyUpdate),
  companyController.updateCompanyProfile
);

// File upload routes (logo/banner)
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

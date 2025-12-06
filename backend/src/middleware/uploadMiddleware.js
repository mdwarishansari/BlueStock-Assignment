const multer = require("multer");
const path = require("path");
const createError = require("http-errors");
const { logger } = require("../utils/logger");

// Configure storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  try {
    // Allowed file types
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    // Check file type
    if (!allowedMimeTypes.includes(file.mimetype)) {
      const error = createError(
        400,
        `Invalid file type. Allowed types: ${allowedMimeTypes.join(", ")}`
      );
      return cb(error, false);
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      const error = createError(400, "File size exceeds 5MB limit");
      return cb(error, false);
    }

    // File is valid
    cb(null, true);
  } catch (error) {
    logger.error("File filter error:", error.message);
    cb(error, false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1, // Single file per upload
  },
});

// Middleware functions
const uploadMiddleware = {
  // Single file upload for logo
  uploadLogo: (req, res, next) => {
    const uploadSingle = upload.single("logo");

    uploadSingle(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return next(
              createError(400, "File too large. Maximum size is 5MB")
            );
          }
          if (err.code === "LIMIT_FILE_COUNT") {
            return next(createError(400, "Only one file allowed"));
          }
        }
        return next(err);
      }

      if (!req.file) {
        return next(createError(400, "Logo file is required"));
      }

      // Add file info to request
      req.fileInfo = {
        type: "logo",
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        buffer: req.file.buffer,
      };

      next();
    });
  },

  // Single file upload for banner
  uploadBanner: (req, res, next) => {
    const uploadSingle = upload.single("banner");

    uploadSingle(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return next(
              createError(400, "File too large. Maximum size is 5MB")
            );
          }
          if (err.code === "LIMIT_FILE_COUNT") {
            return next(createError(400, "Only one file allowed"));
          }
        }
        return next(err);
      }

      if (!req.file) {
        return next(createError(400, "Banner file is required"));
      }

      // Add file info to request
      req.fileInfo = {
        type: "banner",
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        buffer: req.file.buffer,
      };

      next();
    });
  },

  // Multiple file upload (for logo and banner together)
  uploadCompanyImages: (req, res, next) => {
    const uploadMultiple = upload.fields([
      { name: "logo", maxCount: 1 },
      { name: "banner", maxCount: 1 },
    ]);

    uploadMultiple(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return next(
              createError(400, "File too large. Maximum size is 5MB")
            );
          }
          if (err.code === "LIMIT_FILE_COUNT") {
            return next(
              createError(400, "Maximum 2 files allowed (logo and banner)")
            );
          }
        }
        return next(err);
      }

      // Add file info to request
      req.filesInfo = {};

      if (req.files && req.files.logo) {
        const logo = req.files.logo[0];
        req.filesInfo.logo = {
          type: "logo",
          originalName: logo.originalname,
          mimeType: logo.mimetype,
          size: logo.size,
          buffer: logo.buffer,
        };
      }

      if (req.files && req.files.banner) {
        const banner = req.files.banner[0];
        req.filesInfo.banner = {
          type: "banner",
          originalName: banner.originalname,
          mimeType: banner.mimetype,
          size: banner.size,
          buffer: banner.buffer,
        };
      }

      next();
    });
  },

  // Validate image upload
  validateImageUpload: (imageType) => {
    return (req, res, next) => {
      try {
        if (!req.fileInfo && !req.filesInfo) {
          throw createError(400, `No ${imageType} file provided`);
        }

        // Check for specific image type
        if (imageType === "logo") {
          if (!req.fileInfo && (!req.filesInfo || !req.filesInfo.logo)) {
            throw createError(400, "Logo file is required");
          }
        } else if (imageType === "banner") {
          if (!req.fileInfo && (!req.filesInfo || !req.filesInfo.banner)) {
            throw createError(400, "Banner file is required");
          }
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  },

  // Get file extension from mimetype
  getFileExtension: (mimetype) => {
    const extensions = {
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
    };

    return extensions[mimetype] || "jpg";
  },

  // Generate unique filename
  generateFileName: (prefix, originalName, mimetype) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = uploadMiddleware.getFileExtension(mimetype);

    return `${prefix}_${timestamp}_${random}.${extension}`;
  },
};

module.exports = uploadMiddleware;

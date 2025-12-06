const { logger } = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  try {
    // Default error status and message
    let statusCode = err.status || err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let errors = err.errors || null;
    let errorCode = err.code || null;

    // Log the error
    logger.error({
      message: err.message,
      stack: err.stack,
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      userId: req.user ? req.user.id : "anonymous",
    });

    // Handle specific error types
    if (err.name === "ValidationError") {
      statusCode = 400;
      message = "Validation failed";
      errors = Object.values(err.errors).map((e) => e.message);
    }

    if (err.name === "CastError") {
      statusCode = 400;
      message = "Invalid ID format";
    }

    if (err.code === "23505") {
      // PostgreSQL unique violation
      statusCode = 409;
      message = "Duplicate entry";

      if (err.constraint.includes("email")) {
        message = "Email already exists";
      } else if (err.constraint.includes("mobile_no")) {
        message = "Mobile number already exists";
      }
    }

    if (err.code === "23503") {
      // PostgreSQL foreign key violation
      statusCode = 400;
      message = "Invalid reference";
    }

    if (err.code === "23502") {
      // PostgreSQL not null violation
      statusCode = 400;
      message = "Required field is missing";
    }

    if (err.code === "22P02") {
      // PostgreSQL invalid input syntax
      statusCode = 400;
      message = "Invalid input data";
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
      statusCode = 401;
      message = "Invalid token";
    }

    if (err.name === "TokenExpiredError") {
      statusCode = 401;
      message = "Token has expired";
    }

    // Firebase errors
    if (err.code === "auth/email-already-exists") {
      statusCode = 409;
      message = "Email already exists in Firebase";
    }

    if (err.code === "auth/invalid-email") {
      statusCode = 400;
      message = "Invalid email format";
    }

    if (err.code === "auth/invalid-password") {
      statusCode = 400;
      message = "Invalid password";
    }

    if (err.code === "auth/user-not-found") {
      statusCode = 404;
      message = "User not found";
    }

    // Cloudinary errors
    if (err.http_code === 400) {
      statusCode = 400;
      message = err.message || "Invalid image upload";
    }

    // Don't expose internal server error details in production
    if (statusCode === 500 && process.env.NODE_ENV === "production") {
      message = "Internal Server Error";
      errors = null;
    }

    // Construct error response
    const errorResponse = {
      success: false,
      message,
      statusCode,
      ...(errors && { errors }),
      ...(errorCode && { errorCode }),
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    };

    // Remove stack trace from production
    if (process.env.NODE_ENV === "production") {
      delete errorResponse.stack;
    }

    // Send error response
    res.status(statusCode).json(errorResponse);
  } catch (handlerError) {
    // If error handler itself fails
    logger.error("Error handler failed:", handlerError);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      statusCode: 500,
    });
  }
};

module.exports = errorHandler;

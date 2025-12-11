const createError = require("http-errors");
const userModel = require("../models/userModel");
const companyModel = require("../models/companyModel");
const { firebaseAuth } = require("../config/firebase");
const emailService = require("../utils/emailService");
const jwtUtils = require("../utils/jwt");
const { logger } = require("../utils/logger");

const authController = {
  // ======================================================
  // ✅ REGISTER — WITH EMAIL TOKEN + MOBILE OTP
  // ======================================================
  register: async (req, res, next) => {
    try {
      const {
        email,
        password,
        full_name,
        gender,
        mobile_no,
        signup_type = "e",
      } = req.body;

      // Check duplicates
      if (await userModel.emailExists(email))
        throw createError(409, "Email already registered");

      if (await userModel.mobileExists(mobile_no))
        throw createError(409, "Mobile number already registered");

      // Create Firebase user
      let firebaseUser;
      try {
        firebaseUser = await firebaseAuth.createUser(
          email,
          password,
          mobile_no
        );
        logger.info(`Firebase user created: ${firebaseUser.uid}`);
      } catch (e) {
        logger.error("Firebase user creation failed:", e.message);

        if (e.code === "auth/email-already-exists")
          throw createError(409, "Email already exists in Firebase");
        if (e.code === "auth/invalid-email")
          throw createError(400, "Invalid email format");
        if (e.code === "auth/weak-password")
          throw createError(400, "Password is too weak");

        throw createError(500, "Failed to create Firebase user");
      }

      // Create user in DB
      const newUser = await userModel.createUser({
        email,
        password,
        full_name,
        gender,
        mobile_no,
        signup_type,
      });

      // =====================================
      // Generate verification token
      // =====================================
      const verificationData = await userModel.generateVerificationToken(
        newUser.id
      );

      // Send verification email
      try {
        await emailService.sendVerificationEmail(
          email,
          verificationData.email_verification_token,
          newUser.id
        );
        logger.info(`Verification email sent to: ${email}`);
      } catch (emailErr) {
        logger.error("Failed to send verification email:", emailErr.message);
      }

      // Send SMS OTP
      try {
        await firebaseAuth.sendSMSOTP(mobile_no);
      } catch (otpErr) {
        logger.warn("Failed to send SMS OTP:", otpErr.message);
      }

      res.status(201).json({
        success: true,
        message:
          "User registered successfully. Please check email for verification.",
        data: {
          user_id: newUser.id,
          email: newUser.email,
          full_name: newUser.full_name,
          mobile_no: newUser.mobile_no,
          firebase_uid: firebaseUser.uid,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // ======================================================
  // ✅ VERIFY EMAIL USING TOKEN
  // ======================================================
  verifyEmail: async (req, res, next) => {
    try {
      const { token } = req.query;

      if (!token) throw createError(400, "Verification token is required");

      const user = await userModel.verifyEmailToken(token);

      if (!user) {
        if (req.accepts("html")) {
          return res.redirect(
            `${process.env.CLIENT_URL}/verify-email?status=error&msg=Invalid or expired verification link`
          );
        }
        throw createError(400, "Invalid or expired verification link");
      }

      logger.info(`Email verified for: ${user.email}`);

      if (req.accepts("html")) {
        return res.redirect(
          `${process.env.CLIENT_URL}/verify-email?status=success`
        );
      }

      res.status(200).json({
        success: true,
        message: "Email verified successfully",
        data: {
          email: user.email,
          is_email_verified: true,
        },
      });
    } catch (error) {
      if (req.accepts("html")) {
        return res.redirect(
          `${process.env.CLIENT_URL}/verify-email?status=error&msg=${encodeURIComponent(
            error.message
          )}`
        );
      }
      next(error);
    }
  },

  // ======================================================
  // ✅ LOGIN
  // ======================================================
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await userModel.findByEmail(email);
      if (!user) throw createError(401, "Invalid email or password");

      const validPass = await userModel.verifyPassword(password, user.password);
      if (!validPass) throw createError(401, "Invalid email or password");

      // Optional check — allow login even if email not verified
      if (!user.is_email_verified) {
        logger.warn(`User logged in without email verification: ${email}`);
      }

      // Firebase credential validation
      try {
        await firebaseAuth.verifyCredentials(email, password);
      } catch (firebaseErr) {
        logger.warn(
          "Firebase credential verification failed:",
          firebaseErr.message
        );
      }

      const companyProfile = await companyModel.getCompanyByOwnerId(user.id);

      const tokenPayload = { userId: user.id, email: user.email };
      const token = jwtUtils.generateToken(tokenPayload);

      const userData = {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        gender: user.gender,
        mobile_no: user.mobile_no,
        is_email_verified: user.is_email_verified,
        is_mobile_verified: user.is_mobile_verified,
        created_at: user.created_at,
        hasCompany: !!companyProfile,
      };

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: { token, user: userData },
      });
    } catch (error) {
      next(error);
    }
  },

  // ======================================================
  // KEEP OTHER METHODS UNCHANGED (PLACEHOLDERS)
  // ======================================================
  verifyMobile: async (req, res, next) => {
    // keep your previous implementation
    next(createError(500, "verifyMobile not implemented here"));
  },

  getProfile: async (req, res, next) => {
    // keep your previous implementation
    next(createError(500, "getProfile not implemented here"));
  },

  updateProfile: async (req, res, next) => {
    // keep your previous implementation
    next(createError(500, "updateProfile not implemented here"));
  },

  resendOTP: async (req, res, next) => {
    // keep your previous implementation
    next(createError(500, "resendOTP not implemented here"));
  },

  requestPasswordReset: async (req, res, next) => {
    // keep your previous implementation
    next(createError(500, "requestPasswordReset not implemented here"));
  },

  resetPassword: async (req, res, next) => {
    // keep your previous implementation
    next(createError(500, "resetPassword not implemented here"));
  },

  logout: async (req, res, next) => {
    // keep your previous implementation
    next(createError(500, "logout not implemented here"));
  },
};

module.exports = authController;

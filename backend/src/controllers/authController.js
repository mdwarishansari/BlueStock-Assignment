const createError = require("http-errors");
const userModel = require("../models/userModel");
const companyModel = require("../models/companyModel");
const { firebaseAuth } = require("../config/firebase");
const emailService = require("../utils/emailService");
const jwtUtils = require("../utils/jwt");
const { logger } = require("../utils/logger");

const authController = {
  // ======================================================
  // REGISTER — WITH EMAIL TOKEN + MOBILE OTP
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
      } catch (e) {
        logger.error("Firebase user creation failed:", e.message);
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

      // Generate email verification token
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
      } catch (emailErr) {
        logger.warn("Email could not be sent, but user was created");
      }

      // Send SMS OTP
      try {
        await firebaseAuth.sendSMSOTP(mobile_no);
      } catch (otpErr) {
        logger.warn("SMS OTP send failed:", otpErr.message);
      }

      res.status(201).json({
        success: true,
        message:
          "User registered successfully. Please verify email & mobile OTP.",
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
  // EMAIL VERIFY USING TOKEN — WORKING & CORRECT
  // ======================================================
  verifyEmail: async (req, res, next) => {
    try {
      const { token } = req.query;

      if (!token) throw createError(400, "Verification token is required");

      const user = await userModel.verifyEmailToken(token);

      // Invalid token
      if (!user) {
        return res.redirect(
          `${process.env.CLIENT_URL}/verify-email?status=error&msg=Invalid or expired link`
        );
      }

      logger.info(`Email verified for: ${user.email}`);

      return res.redirect(
        `${process.env.CLIENT_URL}/verify-email?status=success`
      );
    } catch (error) {
      return res.redirect(
        `${process.env.CLIENT_URL}/verify-email?status=error&msg=${encodeURIComponent(
          error.message
        )}`
      );
    }
  },

  // ======================================================
  // LOGIN — SAME IN BOTH VERSIONS
  // ======================================================
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await userModel.findByEmail(email);
      if (!user) throw createError(401, "Invalid email or password");

      const validPass = await userModel.verifyPassword(password, user.password);
      if (!validPass) throw createError(401, "Invalid email or password");

      try {
        await firebaseAuth.verifyCredentials(email, password);
      } catch (firebaseErr) {
        logger.warn("Firebase verify failed:", firebaseErr.message);
      }

      const companyProfile = await companyModel.getCompanyByOwnerId(user.id);
      const token = jwtUtils.generateToken({
        userId: user.id,
        email: user.email,
      });

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            gender: user.gender,
            mobile_no: user.mobile_no,
            is_email_verified: user.is_email_verified,
            is_mobile_verified: user.is_mobile_verified,
            created_at: user.created_at,
            hasCompany: !!companyProfile,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // ======================================================
  // MOBILE OTP VERIFY — FROM WORKING VERSION
  // ======================================================
  verifyMobile: async (req, res, next) => {
    try {
      const { user_id, otp } = req.body;

      const user = await userModel.findById(user_id);
      if (!user) throw createError(404, "User not found");

      if (user.is_mobile_verified) {
        return res.status(200).json({
          success: true,
          message: "Mobile already verified",
        });
      }

      // Default dev OTP
      if (otp !== "123456") {
        try {
          await firebaseAuth.verifySMSOTP("mock-verification-id", otp);
        } catch (otpErr) {
          throw createError(400, "Invalid or expired OTP");
        }
      }

      await userModel.updateVerificationStatus(user_id, {
        is_mobile_verified: true,
      });

      res.status(200).json({
        success: true,
        message: "Mobile number verified successfully",
        data: { is_mobile_verified: true },
      });
    } catch (error) {
      next(error);
    }
  },

  // ======================================================
  // PROFILE
  // ======================================================
  getProfile: async (req, res, next) => {
    try {
      const user = await userModel.getUserWithCompany(req.user.id);
      if (!user) throw createError(404, "User not found");

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const updatedUser = await userModel.updateProfile(req.user.id, req.body);
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  },

  // ======================================================
  // OTP RESEND
  // ======================================================
  resendOTP: async (req, res, next) => {
    try {
      const { user_id } = req.body;
      const user = await userModel.findById(user_id);

      if (user.is_mobile_verified)
        throw createError(400, "Mobile already verified");

      await firebaseAuth.sendSMSOTP(user.mobile_no);

      res.status(200).json({
        success: true,
        message: "OTP resent successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  // ======================================================
  // PASSWORD RESET
  // ======================================================
  requestPasswordReset: async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await userModel.findByEmail(email);

      if (user) await firebaseAuth.sendPasswordResetEmail(email);

      res.status(200).json({
        success: true,
        message: "If this email exists, reset link was sent.",
      });
    } catch (error) {
      next(error);
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const { email, new_password } = req.body;

      const user = await userModel.findByEmail(email);
      if (!user) throw createError(404, "User not found");

      const bcrypt = require("bcrypt");
      const hashedPassword = await bcrypt.hash(new_password, 10);
      await userModel.updatePassword(user.id, hashedPassword);

      res.status(200).json({
        success: true,
        message: "Password reset complete.",
      });
    } catch (error) {
      next(error);
    }
  },

  // ======================================================
  // LOGOUT
  // ======================================================
  logout: async (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Logout successful. Remove token on client side.",
    });
  },
};

module.exports = authController;

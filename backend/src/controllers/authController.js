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

      // -------------------------------
      // 🔥 SEND RESPONSE IMMEDIATELY
      // -------------------------------
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

      // -------------------------------
      // 🔥 SEND EMAIL IN BACKGROUND
      // -------------------------------
      emailService
        .sendVerificationEmail(
          email,
          verificationData.email_verification_token,
          newUser.id
        )
        .catch((err) => {
          logger.warn("Email sending failed:", err.message);
        });

      // -------------------------------
      // 🔥 SEND SMS IN BACKGROUND
      // -------------------------------
      firebaseAuth.sendSMSOTP(mobile_no).catch((err) => {
        logger.warn("SMS OTP send failed:", err.message);
      });

      // No more blocking the frontend
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
  // PROFILE
  getProfile: async (req, res, next) => {
    try {
      const row = await userModel.getUserWithCompany(req.user.id);
      if (!row) throw createError(404, "User not found");

      // Build user object (map aliased created_at fields)
      const user = {
        id: row.id,
        email: row.email,
        full_name: row.full_name,
        gender: row.gender,
        mobile_no: row.mobile_no,
        signup_type: row.signup_type,
        is_email_verified: row.is_email_verified,
        is_mobile_verified: row.is_mobile_verified,
        created_at: row.user_created_at,
        updated_at: row.user_updated_at,
      };

      // Build company object if exists
      let company = null;
      if (row.company_id) {
        company = {
          id: row.company_id,
          company_name: row.company_name,
          address: row.address,
          city: row.city,
          state: row.state,
          country: row.country,
          postal_code: row.postal_code,
          website: row.website,
          logo_url: row.logo_url,
          banner_url: row.banner_url,
          industry: row.industry,
          founded_date: row.founded_date,
          description: row.description,
          social_links: row.social_links,
          created_at: row.company_created_at,
          updated_at: row.company_updated_at,
        };
      }

      res.status(200).json({
        success: true,
        data: {
          user,
          company,
        },
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

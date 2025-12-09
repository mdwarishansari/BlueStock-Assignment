const createError = require("http-errors");
const userModel = require("../models/userModel");
const { firebaseAuth } = require("../config/firebase");
const jwtUtils = require("../utils/jwt");
const { logger } = require("../utils/logger");

const authController = {
  // Register new user
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

      const emailExists = await userModel.emailExists(email);
      if (emailExists) {
        throw createError(409, "Email already registered");
      }

      const mobileExists = await userModel.mobileExists(mobile_no);
      if (mobileExists) {
        throw createError(409, "Mobile number already registered");
      }

      let firebaseUser;
      try {
        firebaseUser = await firebaseAuth.createUser(
          email,
          password,
          mobile_no
        );
        logger.info(`Firebase user created: ${firebaseUser.uid}`);
      } catch (firebaseError) {
        logger.error("Firebase user creation failed:", firebaseError.message);

        if (firebaseError.code === "auth/email-already-exists") {
          throw createError(409, "Email already exists in Firebase");
        }
        if (firebaseError.code === "auth/invalid-email") {
          throw createError(400, "Invalid email format");
        }
        if (firebaseError.code === "auth/weak-password") {
          throw createError(400, "Password is too weak");
        }

        throw createError(
          500,
          "Failed to create user in authentication service"
        );
      }

      const userData = {
        email,
        password,
        full_name,
        gender,
        mobile_no,
        signup_type,
      };

      const newUser = await userModel.createUser(userData);

      try {
        await firebaseAuth.sendSMSOTP(mobile_no);
      } catch (otpError) {
        logger.warn("Failed to send SMS OTP:", otpError.message);
      }

      const response = {
        success: true,
        message: "User registered successfully. Please verify mobile OTP.",
        data: {
          user_id: newUser.id,
          email: newUser.email,
          full_name: newUser.full_name,
          mobile_no: newUser.mobile_no,
          firebase_uid: firebaseUser.uid,
        },
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  },

  // Login user
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await userModel.findByEmail(email);
      if (!user) {
        throw createError(401, "Invalid email or password");
      }

      const isPasswordValid = await userModel.verifyPassword(
        password,
        user.password
      );
      if (!isPasswordValid) {
        throw createError(401, "Invalid email or password");
      }

      if (!user.is_email_verified && process.env.NODE_ENV !== "development") {
        throw createError(403, "Please verify your email before logging in");
      }

      try {
        await firebaseAuth.verifyCredentials(email, password);
      } catch (firebaseError) {
        logger.warn(
          "Firebase credential verification failed:",
          firebaseError.message
        );
        if (process.env.NODE_ENV !== "development") {
          throw createError(401, "Authentication service error");
        }
      }

      const tokenPayload = {
        userId: user.id,
        email: user.email,
      };

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
      };

      const response = {
        success: true,
        message: "Login successful",
        data: {
          token,
          user: userData,
          token_expires_in: process.env.JWT_EXPIRES_IN || "90d",
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  // Verify mobile OTP
  verifyMobile: async (req, res, next) => {
    try {
      const { user_id, otp } = req.body;

      const user = await userModel.findById(user_id);
      if (!user) {
        throw createError(404, "User not found");
      }

      if (user.is_mobile_verified) {
        return res.status(200).json({
          success: true,
          message: "Mobile already verified",
          data: { user_id: user.id },
        });
      }

      try {
        await firebaseAuth.verifySMSOTP("mock-verification-id", otp);
      } catch (otpError) {
        logger.error("OTP verification failed:", otpError.message);
        throw createError(400, "Invalid or expired OTP");
      }

      await userModel.updateVerificationStatus(user_id, {
        is_mobile_verified: true,
      });

      const response = {
        success: true,
        message: "Mobile number verified successfully",
        data: {
          user_id: user.id,
          mobile_no: user.mobile_no,
          is_mobile_verified: true,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  // Verify email
  verifyEmail: async (req, res, next) => {
    if (process.env.NODE_ENV === "development") {
      const userId = req.query.user_id;

      if (!userId) {
        throw createError(400, "user_id is required in development mode");
      }

      const user = await userModel.findById(userId);
      if (!user) {
        throw createError(404, "User not found");
      }

      await userModel.updateVerificationStatus(userId, {
        is_email_verified: true,
      });

      return res.status(200).json({
        success: true,
        message: "Email verified (development mode)",
        data: { user_id: userId, email: user.email },
      });
    }

    try {
      const { token } = req.query;

      if (!token) {
        throw createError(400, "Verification token is required");
      }

      const mockEmail = "user@example.com";

      const user = await userModel.findByEmail(mockEmail);
      if (!user) {
        throw createError(404, "User not found");
      }

      if (user.is_email_verified) {
        return res.status(200).json({
          success: true,
          message: "Email already verified",
          data: { email: user.email },
        });
      }

      await userModel.updateVerificationStatus(user.id, {
        is_email_verified: true,
      });

      if (req.accepts("html")) {
        res.redirect(`${process.env.CLIENT_URL}/email-verified`);
      } else {
        res.status(200).json({
          success: true,
          message: "Email verified successfully",
          data: {
            email: user.email,
            is_email_verified: true,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  },

  // Get current user profile
  getProfile: async (req, res, next) => {
    try {
      if (!req.user) {
        throw createError(401, "Authentication required");
      }

      const userWithCompany = await userModel.getUserWithCompany(req.user.id);

      if (!userWithCompany) {
        throw createError(404, "User not found");
      }

      const userData = {
        id: userWithCompany.id,
        email: userWithCompany.email,
        full_name: userWithCompany.full_name,
        gender: userWithCompany.gender,
        mobile_no: userWithCompany.mobile_no,
        is_email_verified: userWithCompany.is_email_verified,
        is_mobile_verified: userWithCompany.is_mobile_verified,
        created_at: userWithCompany.user_created_at,
        updated_at: userWithCompany.user_updated_at,
      };

      let companyData = null;
      if (userWithCompany.company_id) {
        companyData = {
          id: userWithCompany.company_id,
          company_name: userWithCompany.company_name,
          address: userWithCompany.address,
          city: userWithCompany.city,
          state: userWithCompany.state,
          country: userWithCompany.country,
          postal_code: userWithCompany.postal_code,
          website: userWithCompany.website,
          logo_url: userWithCompany.logo_url,
          banner_url: userWithCompany.banner_url,
          industry: userWithCompany.industry,
          founded_date: userWithCompany.founded_date,
          description: userWithCompany.description,
          social_links: userWithCompany.social_links,
          created_at: userWithCompany.company_created_at,
          updated_at: userWithCompany.company_updated_at,
        };
      }

      const response = {
        success: true,
        message: "Profile retrieved successfully",
        data: {
          user: userData,
          company: companyData,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  // Update profile
  updateProfile: async (req, res, next) => {
    try {
      if (!req.user) {
        throw createError(401, "Authentication required");
      }

      const { full_name, gender, mobile_no } = req.body;

      if (mobile_no) {
        const user = await userModel.findById(req.user.id);
        if (user.mobile_no !== mobile_no) {
          const mobileExists = await userModel.mobileExists(mobile_no);
          if (mobileExists) {
            throw createError(409, "Mobile number already registered");
          }
        }
      }

      const updateData = {};
      if (full_name !== undefined) updateData.full_name = full_name;
      if (gender !== undefined) updateData.gender = gender;
      if (mobile_no !== undefined) updateData.mobile_no = mobile_no;

      if (Object.keys(updateData).length === 0) {
        throw createError(400, "No data provided for update");
      }

      const updatedUser = await userModel.updateProfile(
        req.user.id,
        updateData
      );

      const response = {
        success: true,
        message: "Profile updated successfully",
        data: {
          user: updatedUser,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  // Resend OTP
  resendOTP: async (req, res, next) => {
    try {
      const { user_id } = req.body;

      const user = await userModel.findById(user_id);
      if (!user) {
        throw createError(404, "User not found");
      }

      if (user.is_mobile_verified) {
        throw createError(400, "Mobile number already verified");
      }

      try {
        await firebaseAuth.sendSMSOTP(user.mobile_no);
      } catch (otpError) {
        logger.error("Failed to resend OTP:", otpError.message);
        throw createError(500, "Failed to send OTP");
      }

      res.status(200).json({
        success: true,
        message: "OTP resent successfully",
        data: {
          user_id: user.id,
          mobile_no: user.mobile_no,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // ---------------------------------------------------
  // INSERTED: Request Password Reset
  // ---------------------------------------------------
  requestPasswordReset: async (req, res, next) => {
    try {
      const { email } = req.body;

      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(200).json({
          success: true,
          message: "If this email exists, a password reset link has been sent.",
        });
      }

      if (process.env.NODE_ENV === "development") {
        return res.status(200).json({
          success: true,
          message: "Password reset link (development mode). Check console.",
          data: {
            reset_link: `${process.env.CLIENT_URL}/reset-password?email=${email}`,
          },
        });
      }

      await firebaseAuth.sendPasswordResetEmail(email);

      res.status(200).json({
        success: true,
        message: "Password reset link sent to email.",
      });
    } catch (error) {
      next(error);
    }
  },

  // ---------------------------------------------------
  // INSERTED: Reset Password
  // ---------------------------------------------------
  resetPassword: async (req, res, next) => {
    try {
      const { email, new_password } = req.body;

      const user = await userModel.findByEmail(email);
      if (!user) {
        throw createError(404, "User not found");
      }

      const bcrypt = require("bcrypt");
      const hashedPassword = await bcrypt.hash(new_password, 10);

      await userModel.updatePassword(user.id, hashedPassword);

      try {
        await firebaseAuth.updateUserPassword(email, new_password);
      } catch (firebaseError) {
        logger.warn("Firebase password update failed:", firebaseError.message);
      }

      res.status(200).json({
        success: true,
        message:
          "Password reset successful. Please login with your new password.",
      });
    } catch (error) {
      next(error);
    }
  },

  // Logout
  logout: async (req, res, next) => {
    try {
      res.status(200).json({
        success: true,
        message:
          "Logout successful. Please remove the token from client storage.",
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;

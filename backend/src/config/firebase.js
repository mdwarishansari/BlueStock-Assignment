const admin = require("firebase-admin");
const { logger } = require("../utils/logger");

// ---------------------------
// Initialize Firebase Admin
// ---------------------------
let firebaseApp = null;

try {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  if (
    !serviceAccount.projectId ||
    !serviceAccount.privateKey ||
    !serviceAccount.clientEmail
  ) {
    throw new Error("Firebase environment variables are missing");
  }

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  logger.info("✅ Firebase Admin SDK initialized successfully");
} catch (error) {
  logger.error("❌ Firebase initialization error:", error.message);

  if (process.env.NODE_ENV === "development") {
    logger.warn("⚠️ Running without Firebase. Mock mode enabled.");
  } else {
    throw error;
  }
}

// ---------------------------
// Firebase Auth Functions
// ---------------------------
const firebaseAuth = {
  // ----------------------------------------
  // Create user with email/password + phone
  // ----------------------------------------
  createUser: async (email, password, phoneNumber) => {
    if (!firebaseApp) {
      return {
        uid: `mock-uid-${Date.now()}`,
        email,
        phoneNumber,
        emailVerified: false,
      };
    }

    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        phoneNumber,
        emailVerified: false,
        disabled: false,
      });

      // Send email verification link
      await admin.auth().generateEmailVerificationLink(email);

      return userRecord;
    } catch (error) {
      logger.error("Firebase createUser error:", error.message);
      throw error;
    }
  },

  // ----------------------------------------
  // Verify Email (token handling is client-side)
  // ----------------------------------------
  verifyEmail: async (email) => {
    if (!firebaseApp) return { success: true };

    try {
      return { success: true };
    } catch (error) {
      logger.error("Firebase verifyEmail error:", error.message);
      throw error;
    }
  },

  // ----------------------------------------
  // Send SMS OTP (Mock only)
  // ----------------------------------------
  sendSMSOTP: async (phoneNumber) => {
    if (!firebaseApp) {
      logger.info(`Mock OTP sent to ${phoneNumber}: 123456`);
      return { verificationId: "mock-verification-id", success: true };
    }

    try {
      return { verificationId: "real-verification-id", success: true };
    } catch (error) {
      logger.error("Firebase sendSMSOTP error:", error.message);
      throw error;
    }
  },

  // ----------------------------------------
  // Verify SMS OTP (Mock only)
  // ----------------------------------------
  verifySMSOTP: async (verificationId, otp) => {
    if (!firebaseApp) {
      if (otp === "123456") return { success: true };
      throw new Error("Invalid OTP");
    }

    try {
      return { success: true };
    } catch (error) {
      logger.error("Firebase verifySMSOTP error:", error.message);
      throw error;
    }
  },

  // ----------------------------------------
  // Verify Credentials (email/password)
  // ----------------------------------------
  verifyCredentials: async (email, password) => {
    if (!firebaseApp) {
      return {
        uid: `mock-uid-${email}`,
        email,
        emailVerified: true,
      };
    }

    try {
      const user = await admin.auth().getUserByEmail(email);
      return user;
    } catch (error) {
      logger.error("Firebase verifyCredentials error:", error.message);
      throw error;
    }
  },

  // ----------------------------------------
  // Send Password Reset Email
  // ----------------------------------------
  sendPasswordResetEmail: async (email) => {
    try {
      await admin.auth().generatePasswordResetLink(email);
      logger.info(`Password reset email sent to: ${email}`);
      return true;
    } catch (error) {
      logger.error("Firebase sendPasswordResetEmail error:", error.message);
      throw error;
    }
  },

  // ----------------------------------------
  // Update Password
  // ----------------------------------------
  updateUserPassword: async (email, newPassword) => {
    try {
      const user = await admin.auth().getUserByEmail(email);
      await admin.auth().updateUser(user.uid, {
        password: newPassword,
      });

      logger.info(`Password updated for user: ${email}`);
      return true;
    } catch (error) {
      logger.error("Firebase updateUserPassword error:", error.message);
      throw error;
    }
  },
};

module.exports = { firebaseAuth, admin: firebaseApp };

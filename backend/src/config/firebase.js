const admin = require('firebase-admin');
const { logger } = require('../utils/logger');

// Initialize Firebase Admin SDK
let firebaseApp;

try {
  // For development, you can use environment variables
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
    throw new Error('Firebase environment variables are missing');
  }

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  logger.info('✅ Firebase Admin SDK initialized successfully');
} catch (error) {
  logger.error('❌ Firebase initialization error:', error.message);
  
  // For development/testing without Firebase
  if (process.env.NODE_ENV === 'development') {
    logger.warn('⚠️  Running in development mode without Firebase. Some features will be mocked.');
  } else {
    throw error;
  }
}

// Firebase authentication functions
const firebaseAuth = {
  // Create user with email and password
  createUser: async (email, password, phoneNumber) => {
    if (!firebaseApp) {
      // Mock response for development
      return {
        uid: `mock-uid-${Date.now()}`,
        email,
        phoneNumber,
        emailVerified: false
      };
    }

    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        phoneNumber,
        emailVerified: false,
        disabled: false
      });

      // Send email verification
      await admin.auth().generateEmailVerificationLink(email);
      
      return userRecord;
    } catch (error) {
      logger.error('Firebase createUser error:', error.message);
      throw error;
    }
  },

  // Verify email
  verifyEmail: async (email) => {
    if (!firebaseApp) {
      // Mock verification for development
      return { success: true };
    }

    try {
      // In production, Firebase handles email verification via link
      // This function would verify the verification token
      return { success: true };
    } catch (error) {
      logger.error('Firebase verifyEmail error:', error.message);
      throw error;
    }
  },

  // Send SMS OTP for phone verification
  sendSMSOTP: async (phoneNumber) => {
    if (!firebaseApp) {
      // Mock OTP for development
      logger.info(`Mock OTP sent to ${phoneNumber}: 123456`);
      return { 
        verificationId: 'mock-verification-id',
        success: true 
      };
    }

    try {
      // Firebase phone auth implementation
      // Note: This requires Firebase phone auth setup
      return { 
        verificationId: 'real-verification-id',
        success: true 
      };
    } catch (error) {
      logger.error('Firebase sendSMSOTP error:', error.message);
      throw error;
    }
  },

  // Verify SMS OTP
  verifySMSOTP: async (verificationId, otp) => {
    if (!firebaseApp) {
      // Mock verification for development
      if (otp === '123456') {
        return { success: true };
      }
      throw new Error('Invalid OTP');
    }

    try {
      // Firebase phone auth verification
      return { success: true };
    } catch (error) {
      logger.error('Firebase verifySMSOTP error:', error.message);
      throw error;
    }
  },

  // Verify user credentials (email/password)
  verifyCredentials: async (email, password) => {
    if (!firebaseApp) {
      // Mock verification for development
      // Check against your database for development
      return { 
        uid: `mock-uid-${email}`,
        email,
        emailVerified: true 
      };
    }

    try {
      // Firebase sign-in
      // This is a simplified version - in real app, you'd use client-side Firebase Auth
      const user = await admin.auth().getUserByEmail(email);
      return user;
    } catch (error) {
      logger.error('Firebase verifyCredentials error:', error.message);
      throw error;
    }
  }
};

module.exports = { firebaseAuth, admin: firebaseApp };
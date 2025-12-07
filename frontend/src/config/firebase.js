import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { toast } from "react-toastify";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
let auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
}

/**
 * Firebase Authentication Service
 */
export const firebaseService = {
  // Get auth instance
  getAuth: () => auth,

  // Create user with email and password
  createUser: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      console.error("Firebase createUser error:", error);
      throw error;
    }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      console.error("Firebase signIn error:", error);
      throw error;
    }
  },

  // Send email verification
  sendEmailVerification: async (user) => {
    try {
      await sendEmailVerification(user, {
        url: `${window.location.origin}/email-verified`,
        handleCodeInApp: true,
      });
      return true;
    } catch (error) {
      console.error("Firebase sendEmailVerification error:", error);
      throw error;
    }
  },

  // Send password reset email
  sendPasswordResetEmail: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error("Firebase sendPasswordResetEmail error:", error);
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      console.error("Firebase signOut error:", error);
      throw error;
    }
  },

  // Setup reCAPTCHA for phone verification
  setupRecaptcha: (elementId = "recaptcha-container") => {
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
          size: "invisible",
          callback: () => {
            console.log("reCAPTCHA solved");
          },
          "expired-callback": () => {
            console.log("reCAPTCHA expired");
            window.recaptchaVerifier = null;
          },
        });
      }
      return window.recaptchaVerifier;
    } catch (error) {
      console.error("Firebase setupRecaptcha error:", error);
      throw error;
    }
  },

  // Send SMS OTP
  sendSMSOTP: async (phoneNumber) => {
    try {
      const appVerifier = firebaseService.setupRecaptcha();
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      window.confirmationResult = confirmationResult;
      return confirmationResult;
    } catch (error) {
      console.error("Firebase sendSMSOTP error:", error);

      // Reset reCAPTCHA on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }

      throw error;
    }
  },

  // Verify SMS OTP
  verifySMSOTP: async (code) => {
    try {
      if (!window.confirmationResult) {
        throw new Error(
          "No confirmation result found. Please request OTP again."
        );
      }

      const result = await window.confirmationResult.confirm(code);
      return result.user;
    } catch (error) {
      console.error("Firebase verifySMSOTP error:", error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Get ID token
  getIdToken: async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        return await user.getIdToken();
      }
      return null;
    } catch (error) {
      console.error("Firebase getIdToken error:", error);
      return null;
    }
  },
};

export { auth };
export default app;

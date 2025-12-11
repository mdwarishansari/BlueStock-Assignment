// backend/src/utils/emailService.js
const nodemailer = require("nodemailer");
const { logger } = require("./logger");

// Create reusable transporter
const createTransporter = () => {
  if (process.env.NODE_ENV === "development") {
    // Mock transporter for development
    return {
      sendMail: async (mailOptions) => {
        logger.info("📧 [DEV MODE] Email would be sent:", {
          to: mailOptions.to,
          subject: mailOptions.subject,
          html: mailOptions.html?.substring(0, 100) + "...",
        });
        return { messageId: "mock-message-id" };
      },
    };
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const transporter = createTransporter();

const emailService = {
  // Send email verification link
  sendVerificationEmail: async (email, token, userId) => {
    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    const mailOptions = {
      from: `"Jobpilot" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "✅ Verify Your Email - Jobpilot",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧳 Welcome to Jobpilot!</h1>
            </div>
            <div class="content">
              <h2>Verify Your Email Address</h2>
              <p>Thank you for registering! Please click the button below to verify your email address:</p>
              
              <a href="${verificationLink}" class="button">Verify Email Address</a>
              
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${verificationLink}</p>
              
              <p><strong>This link will expire in 24 hours.</strong></p>
              
              <p>If you didn't create an account, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2025 Jobpilot. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      logger.info(`✅ Verification email sent to ${email}: ${info.messageId}`);

      // In development, also log the link
      if (process.env.NODE_ENV === "development") {
        logger.info(`🔗 Verification link: ${verificationLink}`);
      }

      return { success: true, messageId: info.messageId };
    } catch (error) {
      logger.error("❌ Failed to send verification email:", error);
      throw error;
    }
  },

  // Send password reset email
  sendPasswordResetEmail: async (email, resetLink) => {
    const mailOptions = {
      from: `"Jobpilot" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "🔐 Reset Your Password - Jobpilot",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Reset Your Password</h2>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              
              <a href="${resetLink}" class="button">Reset Password</a>
              
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${resetLink}</p>
              
              <div class="warning">
                <strong>⚠️ Important:</strong> This link will expire in 1 hour.
              </div>
              
              <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            </div>
            <div class="footer">
              <p>© 2025 Jobpilot. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      logger.info(
        `✅ Password reset email sent to ${email}: ${info.messageId}`
      );
      return { success: true, messageId: info.messageId };
    } catch (error) {
      logger.error("❌ Failed to send password reset email:", error);
      throw error;
    }
  },

  // Test email configuration
  testConnection: async () => {
    try {
      if (process.env.NODE_ENV === "development") {
        logger.info("✅ Email service in DEV mode (mocked)");
        return true;
      }

      await transporter.verify();
      logger.info("✅ Email service is ready");
      return true;
    } catch (error) {
      logger.error("❌ Email service connection failed:", error);
      return false;
    }
  },
};

module.exports = emailService;

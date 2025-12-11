const { query } = require("../config/db");
const { logger } = require("../utils/logger");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userModel = {
  // ========================================
  // CREATE USER
  // ========================================
  createUser: async (userData) => {
    try {
      const {
        email,
        password,
        full_name,
        gender,
        mobile_no,
        signup_type = "e",
      } = userData;

      const hashedPassword = await bcrypt.hash(password, 10);

      const sql = `
        INSERT INTO users (
          email, password, full_name, gender, mobile_no, 
          signup_type, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING id, email, full_name, gender, mobile_no,
                  signup_type, created_at, is_email_verified, is_mobile_verified
      `;

      const values = [
        email.toLowerCase(),
        hashedPassword,
        full_name,
        gender,
        mobile_no,
        signup_type,
      ];

      const result = await query(sql, values);
      return result.rows[0];
    } catch (error) {
      logger.error("User model - createUser error:", error.message);

      if (error.code === "23505") {
        if (error.constraint.includes("email"))
          throw new Error("Email already exists");
        if (error.constraint.includes("mobile_no"))
          throw new Error("Mobile number already exists");
      }

      throw error;
    }
  },

  // ========================================
  // FIND USER BY EMAIL
  // ========================================
  findByEmail: async (email) => {
    try {
      const sql = `
        SELECT id, email, password, full_name, gender, mobile_no,
               signup_type, is_email_verified, is_mobile_verified,
               created_at, updated_at
        FROM users 
        WHERE email = $1
      `;
      const result = await query(sql, [email.toLowerCase()]);
      return result.rows[0];
    } catch (error) {
      logger.error("User model - findByEmail error:", error.message);
      throw error;
    }
  },

  // ========================================
  // FIND USER BY ID
  // ========================================
  findById: async (id) => {
    try {
      const sql = `
        SELECT id, email, full_name, gender, mobile_no,
               signup_type, is_email_verified, is_mobile_verified,
               created_at, updated_at
        FROM users 
        WHERE id = $1
      `;
      const result = await query(sql, [id]);
      return result.rows[0];
    } catch (error) {
      logger.error("User model - findById error:", error.message);
      throw error;
    }
  },

  // ========================================
  // EMAIL VERIFICATION: CREATE TOKEN
  // ========================================
  generateVerificationToken: async (userId) => {
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const sql = `
      UPDATE users 
      SET email_verification_token = $1,
          email_verification_expires = $2,
          updated_at = NOW()
      WHERE id = $3
      RETURNING email_verification_token, email_verification_expires
    `;

    const result = await query(sql, [token, expires, userId]);
    return result.rows[0];
  },

  // ========================================
  // EMAIL VERIFICATION: VERIFY TOKEN
  // ========================================
  verifyEmailToken: async (token) => {
    const sql = `
      UPDATE users 
      SET is_email_verified = true,
          email_verification_token = NULL,
          email_verification_expires = NULL,
          updated_at = NOW()
      WHERE email_verification_token = $1
        AND email_verification_expires > NOW()
      RETURNING id, email, is_email_verified
    `;

    const result = await query(sql, [token]);
    return result.rows[0] || null;
  },

  // ========================================
  // FIND USER BY VERIFICATION TOKEN
  // ========================================
  findByVerificationToken: async (token) => {
    const sql = `
      SELECT id, email, is_email_verified, email_verification_expires
      FROM users 
      WHERE email_verification_token = $1
    `;
    const result = await query(sql, [token]);
    return result.rows[0] || null;
  },

  // ========================================
  // UPDATE VERIFICATION STATUS
  // ========================================
  updateVerificationStatus: async (userId, updates) => {
    try {
      const updateFields = [];
      const values = [];
      let index = 1;

      if (updates.is_email_verified !== undefined) {
        updateFields.push(`is_email_verified = $${index}`);
        values.push(updates.is_email_verified);
        index++;
      }

      if (updates.is_mobile_verified !== undefined) {
        updateFields.push(`is_mobile_verified = $${index}`);
        values.push(updates.is_mobile_verified);
        index++;
      }

      updateFields.push("updated_at = NOW()");

      const sql = `
        UPDATE users
        SET ${updateFields.join(", ")}
        WHERE id = $${index}
        RETURNING id, email, is_email_verified, is_mobile_verified
      `;

      values.push(userId);
      const result = await query(sql, values);
      return result.rows[0];
    } catch (error) {
      logger.error(
        "User model - updateVerificationStatus error:",
        error.message
      );
      throw error;
    }
  },

  // ========================================
  // UPDATE PROFILE
  // ========================================
  updateProfile: async (userId, updateData) => {
    try {
      const allowed = ["full_name", "gender", "mobile_no"];
      const updateFields = [];
      const values = [];
      let index = 1;

      for (const [key, value] of Object.entries(updateData)) {
        if (allowed.includes(key) && value !== undefined) {
          updateFields.push(`${key} = $${index}`);
          values.push(value);
          index++;
        }
      }

      updateFields.push("updated_at = NOW()");

      const sql = `
        UPDATE users 
        SET ${updateFields.join(", ")}
        WHERE id = $${index}
        RETURNING id, email, full_name, gender, mobile_no,
                  is_email_verified, is_mobile_verified, updated_at
      `;

      values.push(userId);
      const result = await query(sql, values);
      return result.rows[0];
    } catch (error) {
      logger.error("User model - updateProfile error:", error.message);
      throw error;
    }
  },

  // ========================================
  // VERIFY PASSWORD
  // ========================================
  verifyPassword: async (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
  },

  // ========================================
  // EMAIL EXISTS
  // ========================================
  emailExists: async (email) => {
    const sql = "SELECT 1 FROM users WHERE email = $1 LIMIT 1";
    const result = await query(sql, [email.toLowerCase()]);
    return result.rows.length > 0;
  },

  // ========================================
  // MOBILE EXISTS
  // ========================================
  mobileExists: async (mobileNo) => {
    const sql = "SELECT 1 FROM users WHERE mobile_no = $1 LIMIT 1";
    const result = await query(sql, [mobileNo]);
    return result.rows.length > 0;
  },

  // ========================================
  // USER WITH COMPANY
  // ========================================
  getUserWithCompany: async (userId) => {
    const sql = `
      SELECT 
        u.id, u.email, u.full_name, u.gender, u.mobile_no,
        u.signup_type, u.is_email_verified, u.is_mobile_verified,
        u.created_at as user_created_at, u.updated_at as user_updated_at,
        c.id as company_id, c.company_name, c.address, c.city, c.state,
        c.country, c.postal_code, c.website, c.logo_url, c.banner_url,
        c.industry, c.founded_date, c.description, c.social_links,
        c.created_at as company_created_at, c.updated_at as company_updated_at
      FROM users u
      LEFT JOIN company_profile c ON u.id = c.owner_id
      WHERE u.id = $1
    `;

    const result = await query(sql, [userId]);
    return result.rows[0];
  },

  // ========================================
  // UPDATE PASSWORD
  // ========================================
  updatePassword: async (userId, hashedPassword) => {
    const sql = `
      UPDATE users
      SET password = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, email
    `;
    const result = await query(sql, [hashedPassword, userId]);
    return result.rows[0];
  },
};

module.exports = userModel;

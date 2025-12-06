const { query } = require("../config/db");
const { logger } = require("../utils/logger");
const bcrypt = require("bcrypt");

const userModel = {
  // Create new user
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

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const sql = `
        INSERT INTO users (
          email, password, full_name, gender, 
          mobile_no, signup_type, created_at, updated_at
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

      // Handle unique constraint violations
      if (error.code === "23505") {
        if (error.constraint.includes("email")) {
          throw new Error("Email already exists");
        }
        if (error.constraint.includes("mobile_no")) {
          throw new Error("Mobile number already exists");
        }
      }

      throw error;
    }
  },

  // Find user by email
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

  // Find user by ID
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

  // Update user verification status
  updateVerificationStatus: async (userId, updates) => {
    try {
      const updateFields = [];
      const values = [];
      let valueIndex = 1;

      // Build dynamic update query
      if (updates.is_email_verified !== undefined) {
        updateFields.push(`is_email_verified = $${valueIndex}`);
        values.push(updates.is_email_verified);
        valueIndex++;
      }

      if (updates.is_mobile_verified !== undefined) {
        updateFields.push(`is_mobile_verified = $${valueIndex}`);
        values.push(updates.is_mobile_verified);
        valueIndex++;
      }

      if (updateFields.length === 0) {
        throw new Error("No fields to update");
      }

      // Always update the updated_at timestamp
      updateFields.push(`updated_at = NOW()`);

      const sql = `
        UPDATE users 
        SET ${updateFields.join(", ")}
        WHERE id = $${valueIndex}
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

  // Update user profile
  updateProfile: async (userId, updateData) => {
    try {
      const allowedFields = ["full_name", "gender", "mobile_no"];
      const updateFields = [];
      const values = [];
      let valueIndex = 1;

      // Build dynamic update query
      for (const [field, value] of Object.entries(updateData)) {
        if (allowedFields.includes(field) && value !== undefined) {
          updateFields.push(`${field} = $${valueIndex}`);

          // Handle special cases
          if (field === "mobile_no") {
            values.push(value);
          } else if (field === "email") {
            values.push(value.toLowerCase());
          } else {
            values.push(value);
          }

          valueIndex++;
        }
      }

      if (updateFields.length === 0) {
        throw new Error("No valid fields to update");
      }

      // Always update the updated_at timestamp
      updateFields.push(`updated_at = NOW()`);

      const sql = `
        UPDATE users 
        SET ${updateFields.join(", ")}
        WHERE id = $${valueIndex}
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

  // Verify password
  verifyPassword: async (plainPassword, hashedPassword) => {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      logger.error("User model - verifyPassword error:", error.message);
      throw error;
    }
  },

  // Check if email exists
  emailExists: async (email) => {
    try {
      const sql = "SELECT 1 FROM users WHERE email = $1 LIMIT 1";
      const result = await query(sql, [email.toLowerCase()]);
      return result.rows.length > 0;
    } catch (error) {
      logger.error("User model - emailExists error:", error.message);
      throw error;
    }
  },

  // Check if mobile exists
  mobileExists: async (mobileNo) => {
    try {
      const sql = "SELECT 1 FROM users WHERE mobile_no = $1 LIMIT 1";
      const result = await query(sql, [mobileNo]);
      return result.rows.length > 0;
    } catch (error) {
      logger.error("User model - mobileExists error:", error.message);
      throw error;
    }
  },

  // Get user with company profile
  getUserWithCompany: async (userId) => {
    try {
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
    } catch (error) {
      logger.error("User model - getUserWithCompany error:", error.message);
      throw error;
    }
  },
};

module.exports = userModel;

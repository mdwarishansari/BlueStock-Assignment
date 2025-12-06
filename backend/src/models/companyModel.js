const { query } = require("../config/db");
const { logger } = require("../utils/logger");

const companyModel = {
  // Create company profile
  createCompanyProfile: async (companyData) => {
    try {
      const {
        owner_id,
        company_name,
        address,
        city,
        state,
        country,
        postal_code,
        website = null,
        logo_url = null,
        banner_url = null,
        industry,
        founded_date = null,
        description = null,
        social_links = null,
      } = companyData;

      const sql = `
        INSERT INTO company_profile (
          owner_id, company_name, address, city, state, country,
          postal_code, website, logo_url, banner_url, industry,
          founded_date, description, social_links, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())
        RETURNING *
      `;

      const values = [
        owner_id,
        company_name,
        address,
        city,
        state,
        country,
        postal_code,
        website,
        logo_url,
        banner_url,
        industry,
        founded_date,
        description,
        social_links ? JSON.stringify(social_links) : null,
      ];

      const result = await query(sql, values);
      return result.rows[0];
    } catch (error) {
      logger.error(
        "Company model - createCompanyProfile error:",
        error.message
      );

      // Handle foreign key violation
      if (error.code === "23503") {
        throw new Error("Invalid user ID (owner_id)");
      }

      throw error;
    }
  },

  // Get company profile by owner ID
  getCompanyByOwnerId: async (ownerId) => {
    try {
      const sql = `
        SELECT * FROM company_profile 
        WHERE owner_id = $1
      `;

      const result = await query(sql, [ownerId]);
      return result.rows[0];
    } catch (error) {
      logger.error("Company model - getCompanyByOwnerId error:", error.message);
      throw error;
    }
  },

  // Get company profile by ID
  getCompanyById: async (companyId) => {
    try {
      const sql = `
        SELECT 
          c.*,
          u.email as owner_email,
          u.full_name as owner_name,
          u.mobile_no as owner_mobile
        FROM company_profile c
        JOIN users u ON c.owner_id = u.id
        WHERE c.id = $1
      `;

      const result = await query(sql, [companyId]);
      return result.rows[0];
    } catch (error) {
      logger.error("Company model - getCompanyById error:", error.message);
      throw error;
    }
  },

  // Update company profile
  updateCompanyProfile: async (companyId, ownerId, updateData) => {
    try {
      const allowedFields = [
        "company_name",
        "address",
        "city",
        "state",
        "country",
        "postal_code",
        "website",
        "logo_url",
        "banner_url",
        "industry",
        "founded_date",
        "description",
        "social_links",
      ];

      const updateFields = [];
      const values = [];
      let valueIndex = 1;

      // Build dynamic update query
      for (const [field, value] of Object.entries(updateData)) {
        if (allowedFields.includes(field) && value !== undefined) {
          updateFields.push(`${field} = $${valueIndex}`);

          // Handle JSON fields
          if (field === "social_links" && value) {
            values.push(JSON.stringify(value));
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
        UPDATE company_profile 
        SET ${updateFields.join(", ")}
        WHERE id = $${valueIndex} AND owner_id = $${valueIndex + 1}
        RETURNING *
      `;

      values.push(companyId, ownerId);
      const result = await query(sql, values);

      if (result.rows.length === 0) {
        throw new Error("Company not found or unauthorized");
      }

      return result.rows[0];
    } catch (error) {
      logger.error(
        "Company model - updateCompanyProfile error:",
        error.message
      );
      throw error;
    }
  },

  // Update only specific fields (for logo/banner URLs)
  updateCompanyImages: async (ownerId, imageUpdates) => {
    try {
      const updateFields = [];
      const values = [];
      let valueIndex = 1;

      // Build dynamic update query
      for (const [field, value] of Object.entries(imageUpdates)) {
        if (["logo_url", "banner_url"].includes(field) && value !== undefined) {
          updateFields.push(`${field} = $${valueIndex}`);
          values.push(value);
          valueIndex++;
        }
      }

      if (updateFields.length === 0) {
        throw new Error("No image fields to update");
      }

      // Always update the updated_at timestamp
      updateFields.push(`updated_at = NOW()`);

      const sql = `
        UPDATE company_profile 
        SET ${updateFields.join(", ")}
        WHERE owner_id = $${valueIndex}
        RETURNING id, logo_url, banner_url, updated_at
      `;

      values.push(ownerId);
      const result = await query(sql, values);

      if (result.rows.length === 0) {
        // If company profile doesn't exist, create a minimal one
        return null;
      }

      return result.rows[0];
    } catch (error) {
      logger.error("Company model - updateCompanyImages error:", error.message);
      throw error;
    }
  },

  // Check if company name exists (excluding current company)
  companyNameExists: async (companyName, excludeCompanyId = null) => {
    try {
      let sql = "SELECT 1 FROM company_profile WHERE company_name = $1";
      const values = [companyName];

      if (excludeCompanyId) {
        sql += " AND id != $2";
        values.push(excludeCompanyId);
      }

      sql += " LIMIT 1";

      const result = await query(sql, values);
      return result.rows.length > 0;
    } catch (error) {
      logger.error("Company model - companyNameExists error:", error.message);
      throw error;
    }
  },

  // Get all companies (for admin, optional)
  getAllCompanies: async (limit = 50, offset = 0) => {
    try {
      const sql = `
        SELECT 
          c.*,
          u.email as owner_email,
          u.full_name as owner_name
        FROM company_profile c
        JOIN users u ON c.owner_id = u.id
        ORDER BY c.created_at DESC
        LIMIT $1 OFFSET $2
      `;

      const result = await query(sql, [limit, offset]);
      return result.rows;
    } catch (error) {
      logger.error("Company model - getAllCompanies error:", error.message);
      throw error;
    }
  },

  // Delete company profile (optional)
  deleteCompanyProfile: async (companyId, ownerId) => {
    try {
      const sql = `
        DELETE FROM company_profile 
        WHERE id = $1 AND owner_id = $2
        RETURNING id, company_name
      `;

      const result = await query(sql, [companyId, ownerId]);
      return result.rows[0];
    } catch (error) {
      logger.error(
        "Company model - deleteCompanyProfile error:",
        error.message
      );
      throw error;
    }
  },
};

module.exports = companyModel;

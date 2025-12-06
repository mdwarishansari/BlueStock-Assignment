const createError = require("http-errors");
const companyModel = require("../models/companyModel");
const cloudinaryService = require("../config/cloudinary");
const { logger } = require("../utils/logger");

const companyController = {
  // Register company profile
  registerCompany: async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Check if user already has a company profile
      const existingCompany = await companyModel.getCompanyByOwnerId(userId);
      if (existingCompany) {
        throw createError(409, "Company profile already exists for this user");
      }

      const {
        company_name,
        address,
        city,
        state,
        country,
        postal_code,
        website,
        industry,
        founded_date,
        description,
        social_links,
      } = req.body;

      // Check if company name already exists
      const companyNameExists =
        await companyModel.companyNameExists(company_name);
      if (companyNameExists) {
        throw createError(409, "Company name already exists");
      }

      // Handle file uploads if present
      let logo_url = null;
      let banner_url = null;

      if (req.filesInfo) {
        // Upload logo if provided
        if (req.filesInfo.logo) {
          const logoResult = await cloudinaryService.uploadImage(
            req.filesInfo.logo.buffer,
            "company_logos"
          );
          logo_url = logoResult.secure_url;
        }

        // Upload banner if provided
        if (req.filesInfo.banner) {
          const bannerResult = await cloudinaryService.uploadImage(
            req.filesInfo.banner.buffer,
            "company_banners"
          );
          banner_url = bannerResult.secure_url;
        }
      }

      // Prepare company data
      const companyData = {
        owner_id: userId,
        company_name,
        address,
        city,
        state,
        country,
        postal_code,
        website: website || null,
        logo_url,
        banner_url,
        industry,
        founded_date: founded_date || null,
        description: description || null,
        social_links: social_links || null,
      };

      // Create company profile
      const newCompany = await companyModel.createCompanyProfile(companyData);

      // Prepare response
      const response = {
        success: true,
        message: "Company profile created successfully",
        data: {
          company: newCompany,
        },
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  },

  // Get company profile
  getCompanyProfile: async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Get company profile
      const company = await companyModel.getCompanyByOwnerId(userId);

      if (!company) {
        throw createError(404, "Company profile not found");
      }

      // Prepare response
      const response = {
        success: true,
        message: "Company profile retrieved successfully",
        data: {
          company,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  // Update company profile
  updateCompanyProfile: async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Get existing company
      const existingCompany = await companyModel.getCompanyByOwnerId(userId);
      if (!existingCompany) {
        throw createError(404, "Company profile not found");
      }

      const updateData = { ...req.body };

      // Check if company name is being changed and if it already exists
      if (
        updateData.company_name &&
        updateData.company_name !== existingCompany.company_name
      ) {
        const companyNameExists = await companyModel.companyNameExists(
          updateData.company_name,
          existingCompany.id
        );
        if (companyNameExists) {
          throw createError(409, "Company name already exists");
        }
      }

      // Handle file uploads if present
      if (req.filesInfo) {
        // Update logo if provided
        if (req.filesInfo.logo) {
          const logoResult = await cloudinaryService.uploadImage(
            req.filesInfo.logo.buffer,
            "company_logos"
          );
          updateData.logo_url = logoResult.secure_url;

          // Delete old logo from Cloudinary if exists
          if (existingCompany.logo_url) {
            try {
              const oldLogoPublicId = cloudinaryService.extractPublicId(
                existingCompany.logo_url
              );
              if (oldLogoPublicId) {
                await cloudinaryService.deleteImage(oldLogoPublicId);
              }
            } catch (deleteError) {
              logger.warn("Failed to delete old logo:", deleteError.message);
              // Continue even if deletion fails
            }
          }
        }

        // Update banner if provided
        if (req.filesInfo.banner) {
          const bannerResult = await cloudinaryService.uploadImage(
            req.filesInfo.banner.buffer,
            "company_banners"
          );
          updateData.banner_url = bannerResult.secure_url;

          // Delete old banner from Cloudinary if exists
          if (existingCompany.banner_url) {
            try {
              const oldBannerPublicId = cloudinaryService.extractPublicId(
                existingCompany.banner_url
              );
              if (oldBannerPublicId) {
                await cloudinaryService.deleteImage(oldBannerPublicId);
              }
            } catch (deleteError) {
              logger.warn("Failed to delete old banner:", deleteError.message);
              // Continue even if deletion fails
            }
          }
        }
      }

      // Update company profile
      const updatedCompany = await companyModel.updateCompanyProfile(
        existingCompany.id,
        userId,
        updateData
      );

      // Prepare response
      const response = {
        success: true,
        message: "Company profile updated successfully",
        data: {
          company: updatedCompany,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  // Upload company logo
  uploadLogo: async (req, res, next) => {
    try {
      const userId = req.user.id;

      if (!req.fileInfo) {
        throw createError(400, "Logo file is required");
      }

      // Upload logo to Cloudinary
      const uploadResult = await cloudinaryService.uploadImage(
        req.fileInfo.buffer,
        "company_logos"
      );

      // Get existing company to delete old logo
      const existingCompany = await companyModel.getCompanyByOwnerId(userId);

      // Delete old logo from Cloudinary if exists
      if (existingCompany && existingCompany.logo_url) {
        try {
          const oldLogoPublicId = cloudinaryService.extractPublicId(
            existingCompany.logo_url
          );
          if (oldLogoPublicId) {
            await cloudinaryService.deleteImage(oldLogoPublicId);
          }
        } catch (deleteError) {
          logger.warn("Failed to delete old logo:", deleteError.message);
          // Continue even if deletion fails
        }
      }

      // Update or create company profile with new logo URL
      let updatedCompany;
      if (existingCompany) {
        updatedCompany = await companyModel.updateCompanyProfile(
          existingCompany.id,
          userId,
          { logo_url: uploadResult.secure_url }
        );
      } else {
        // Create minimal company profile if doesn't exist
        updatedCompany = await companyModel.createCompanyProfile({
          owner_id: userId,
          company_name: "Unnamed Company",
          address: "To be updated",
          city: "To be updated",
          state: "To be updated",
          country: "To be updated",
          postal_code: "000000",
          industry: "Other",
          logo_url: uploadResult.secure_url,
        });
      }

      // Prepare response
      const response = {
        success: true,
        message: "Logo uploaded successfully",
        data: {
          logo_url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          company_id: updatedCompany.id,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  // Upload company banner
  uploadBanner: async (req, res, next) => {
    try {
      const userId = req.user.id;

      if (!req.fileInfo) {
        throw createError(400, "Banner file is required");
      }

      // Upload banner to Cloudinary
      const uploadResult = await cloudinaryService.uploadImage(
        req.fileInfo.buffer,
        "company_banners"
      );

      // Get existing company to delete old banner
      const existingCompany = await companyModel.getCompanyByOwnerId(userId);

      // Delete old banner from Cloudinary if exists
      if (existingCompany && existingCompany.banner_url) {
        try {
          const oldBannerPublicId = cloudinaryService.extractPublicId(
            existingCompany.banner_url
          );
          if (oldBannerPublicId) {
            await cloudinaryService.deleteImage(oldBannerPublicId);
          }
        } catch (deleteError) {
          logger.warn("Failed to delete old banner:", deleteError.message);
          // Continue even if deletion fails
        }
      }

      // Update or create company profile with new banner URL
      let updatedCompany;
      if (existingCompany) {
        updatedCompany = await companyModel.updateCompanyProfile(
          existingCompany.id,
          userId,
          { banner_url: uploadResult.secure_url }
        );
      } else {
        // Create minimal company profile if doesn't exist
        updatedCompany = await companyModel.createCompanyProfile({
          owner_id: userId,
          company_name: "Unnamed Company",
          address: "To be updated",
          city: "To be updated",
          state: "To be updated",
          country: "To be updated",
          postal_code: "000000",
          industry: "Other",
          banner_url: uploadResult.secure_url,
        });
      }

      // Prepare response
      const response = {
        success: true,
        message: "Banner uploaded successfully",
        data: {
          banner_url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          company_id: updatedCompany.id,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  // Delete company logo
  deleteLogo: async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Get existing company
      const existingCompany = await companyModel.getCompanyByOwnerId(userId);
      if (!existingCompany) {
        throw createError(404, "Company profile not found");
      }

      if (!existingCompany.logo_url) {
        throw createError(404, "No logo found to delete");
      }

      // Delete logo from Cloudinary
      try {
        const logoPublicId = cloudinaryService.extractPublicId(
          existingCompany.logo_url
        );
        if (logoPublicId) {
          await cloudinaryService.deleteImage(logoPublicId);
        }
      } catch (deleteError) {
        logger.warn(
          "Failed to delete logo from Cloudinary:",
          deleteError.message
        );
        // Continue even if deletion fails
      }

      // Update company profile to remove logo URL
      const updatedCompany = await companyModel.updateCompanyProfile(
        existingCompany.id,
        userId,
        { logo_url: null }
      );

      // Prepare response
      const response = {
        success: true,
        message: "Logo deleted successfully",
        data: {
          company_id: updatedCompany.id,
          logo_url: null,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  // Delete company banner
  deleteBanner: async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Get existing company
      const existingCompany = await companyModel.getCompanyByOwnerId(userId);
      if (!existingCompany) {
        throw createError(404, "Company profile not found");
      }

      if (!existingCompany.banner_url) {
        throw createError(404, "No banner found to delete");
      }

      // Delete banner from Cloudinary
      try {
        const bannerPublicId = cloudinaryService.extractPublicId(
          existingCompany.banner_url
        );
        if (bannerPublicId) {
          await cloudinaryService.deleteImage(bannerPublicId);
        }
      } catch (deleteError) {
        logger.warn(
          "Failed to delete banner from Cloudinary:",
          deleteError.message
        );
        // Continue even if deletion fails
      }

      // Update company profile to remove banner URL
      const updatedCompany = await companyModel.updateCompanyProfile(
        existingCompany.id,
        userId,
        { banner_url: null }
      );

      // Prepare response
      const response = {
        success: true,
        message: "Banner deleted successfully",
        data: {
          company_id: updatedCompany.id,
          banner_url: null,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = companyController;

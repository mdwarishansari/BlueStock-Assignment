const cloudinary = require('cloudinary').v2;
const { logger } = require('../utils/logger');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const cloudinaryService = {
  // Upload image to Cloudinary
  uploadImage: async (fileBuffer, folder = 'company_logos') => {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            transformation: [
              { width: 800, height: 600, crop: 'limit' }, // Resize for logos
              { quality: 'auto:good' } // Optimize quality
            ]
          },
          (error, result) => {
            if (error) {
              logger.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              logger.info(`✅ Image uploaded to Cloudinary: ${result.public_id}`);
              resolve(result);
            }
          }
        );

        uploadStream.end(fileBuffer);
      });
    } catch (error) {
      logger.error('Cloudinary upload service error:', error.message);
      throw error;
    }
  },

  // Delete image from Cloudinary
  deleteImage: async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      logger.info(`✅ Image deleted from Cloudinary: ${publicId}`);
      return result;
    } catch (error) {
      logger.error('Cloudinary delete error:', error.message);
      throw error;
    }
  },

  // Extract public ID from Cloudinary URL
  extractPublicId: (url) => {
    if (!url) return null;
    const parts = url.split('/');
    const publicIdWithExtension = parts[parts.length - 1];
    return publicIdWithExtension.split('.')[0];
  }
};

module.exports = cloudinaryService;
/**
 * Cloudinary Configuration
 * Note: Actual uploads are handled by backend
 * This file contains helper functions for frontend display
 */

const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
};

/**
 * Get Cloudinary image URL with transformations
 */
export const getCloudinaryImageUrl = (publicId, transformations = {}) => {
  if (!publicId) return null;

  const { width, height, crop = "fill", quality = "auto" } = transformations;

  let transformStr = `q_${quality}`;
  if (width) transformStr += `,w_${width}`;
  if (height) transformStr += `,h_${height}`;
  if (crop) transformStr += `,c_${crop}`;

  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformStr}/${publicId}`;
};

/**
 * Get optimized thumbnail
 */
export const getCloudinaryThumbnail = (imageUrl, size = 200) => {
  if (!imageUrl) return null;

  // If already a Cloudinary URL, add transformations
  if (imageUrl.includes("cloudinary.com")) {
    const parts = imageUrl.split("/upload/");
    if (parts.length === 2) {
      return `${parts[0]}/upload/w_${size},h_${size},c_fill,q_auto/${parts[1]}`;
    }
  }

  return imageUrl;
};

/**
 * Validate image file before upload
 */
export const validateImageFile = (file) => {
  const errors = [];

  // Check file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    errors.push("Only JPG, PNG, and WebP images are allowed");
  }

  // Check file size (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    errors.push("Image size should not exceed 5MB");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Create FormData for image upload
 */
export const createImageFormData = (file, fieldName = "image") => {
  const formData = new FormData();
  formData.append(fieldName, file);
  return formData;
};

/**
 * Get file preview URL
 */
export const getFilePreviewUrl = (file) => {
  if (!file) return null;
  return URL.createObjectURL(file);
};

/**
 * Cleanup preview URL
 */
export const revokePreviewUrl = (url) => {
  if (url) {
    URL.revokeObjectURL(url);
  }
};

export default CLOUDINARY_CONFIG;

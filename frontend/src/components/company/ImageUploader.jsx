import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Avatar,
  Paper,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { toast } from 'react-toastify';
import {
  validateImageFile,
  getFilePreviewUrl,
  revokePreviewUrl,
} from '../../config/cloudinary';

/**
 * Image Uploader Component
 * Supports logo and banner uploads with preview
 */
const ImageUploader = ({
  label,
  currentImage,
  onImageSelect,
  onImageRemove,
  type = 'logo', // 'logo' or 'banner'
  disabled = false,
}) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(currentImage || null);

  const isLogo = type === 'logo';
  const aspectRatio = isLogo ? '1:1' : '16:9';
  const recommendedSize = isLogo ? '200x200px' : '1200x300px';

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      validation.errors.forEach((error) => toast.error(error));
      return;
    }

    // Create preview
    const previewUrl = getFilePreviewUrl(file);
    setPreview(previewUrl);

    // Pass file to parent
    onImageSelect(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    // Revoke preview URL
    if (preview && preview.startsWith('blob:')) {
      revokePreviewUrl(preview);
    }

    setPreview(null);
    onImageRemove?.();

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom fontWeight={600}>
        {label}
      </Typography>
      
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
        Recommended: {recommendedSize} • Aspect Ratio: {aspectRatio} • Max: 5MB
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: isLogo ? '1' : '16/9',
          maxWidth: isLogo ? 200 : '100%',
          overflow: 'hidden',
          borderRadius: 2,
          backgroundColor: 'background.default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {preview ? (
          <>
            <Box
              component="img"
              src={preview}
              alt={label}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            
            {!disabled && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  display: 'flex',
                  gap: 1,
                }}
              >
                <IconButton
                  size="small"
                  onClick={handleClick}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                  }}
                >
                  <PhotoCameraIcon fontSize="small" />
                </IconButton>
                
                <IconButton
                  size="small"
                  onClick={handleRemoveImage}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" color="error" />
                </IconButton>
              </Box>
            )}
          </>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              p: 3,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
            onClick={disabled ? undefined : handleClick}
          >
            <CloudUploadIcon
              sx={{
                fontSize: 48,
                color: 'text.secondary',
                mb: 1,
              }}
            />
            <Typography variant="body2" color="text.secondary">
              Click to upload {type}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              JPG, PNG or WebP
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      {!preview && !disabled && (
        <Button
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          onClick={handleClick}
          fullWidth
          sx={{ mt: 2 }}
        >
          Upload {type}
        </Button>
      )}
    </Box>
  );
};

export default ImageUploader;
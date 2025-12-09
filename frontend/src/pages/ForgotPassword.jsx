import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosInstance';
import { validateEmail } from '../utils/validators';
import { ROUTES } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * Forgot Password Page
 */
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const response = await axiosInstance.post('/auth/forgot-password', {
        email: data.email.toLowerCase().trim(),
      });

      if (response.data.success) {
        setEmailSent(true);
        toast.success(response.data.message);
        
        // In development, show the reset link
        if (response.data.data?.reset_link) {
          console.log('Reset Link:', response.data.data.reset_link);
        }
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 450,
          width: '100%',
          p: 4,
          borderRadius: 2,
        }}
      >
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(ROUTES.LOGIN)}
          sx={{ mb: 2 }}
        >
          Back to Login
        </Button>

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Forgot Password?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter your email and we'll send you a reset link
          </Typography>
        </Box>

        {emailSent ? (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Check Your Email!
            </Typography>
            <Typography variant="body2">
              We've sent password reset instructions to your email address.
              Please check your inbox and follow the link to reset your password.
            </Typography>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                disabled={loading}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />,
                }}
                {...register('email', {
                  required: 'Email is required',
                  validate: validateEmail,
                })}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{ py: 1.5, mt: 1 }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </Box>
          </form>
        )}

        {/* Login Link */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Remember your password?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate(ROUTES.LOGIN)}
              sx={{ textDecoration: 'none', fontWeight: 600 }}
            >
              Sign In
            </Link>
          </Typography>
        </Box>
      </Paper>

      {loading && <LoadingSpinner fullScreen message="Sending reset link..." />}
    </Box>
  );
};

export default ForgotPassword;
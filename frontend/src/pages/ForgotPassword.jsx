import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Link as MuiLink,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { authApi } from '../api/authApi';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authApi.forgotPassword(data.email);
      setEmailSent(true);
      toast.success('Password reset link sent to your email!');
    } catch (error) {
      toast.error('Failed to send reset link');
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 3,
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: '100%',
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
          🔑 Forgot Password?
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Enter your email address and we'll send you a link to reset your password
        </Typography>

        {emailSent && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Password reset link sent! Check your email inbox.
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Email Address"
            margin="normal"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2, borderRadius: 50, py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
          </Button>

          <Typography align="center" variant="body2">
            Remember your password?{' '}
            <MuiLink
              component={Link}
              to="/login"
              sx={{ fontWeight: 600, textDecoration: 'none' }}
            >
              Login
            </MuiLink>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default ForgotPassword;
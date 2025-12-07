import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Paper,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import useAuth from '../../hooks/useAuth';
import {
  validateEmail,
  validatePassword,
  validateMobile,
  validateOTP,
} from '../../utils/validators';
import { ROUTES, GENDER_OPTIONS } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Register Form Component
 */
const RegisterForm = () => {
  const navigate = useNavigate();
  const { register: registerUser, verifyMobile, resendOTP, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      gender: 'm',
    },
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const response = await registerUser({
        email: data.email.toLowerCase().trim(),
        password: data.password,
        full_name: data.full_name.trim(),
        gender: data.gender,
        mobile_no: '+' + data.mobile_no,
        signup_type: 'e',
      });

      if (response?.user_id) {
        setUserId(response.user_id);
        setOtpDialogOpen(true);
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleVerifyOTP = async () => {
    setOtpError('');

    const validation = validateOTP(otp);
    if (validation !== true) {
      setOtpError(validation);
      return;
    }

    try {
      await verifyMobile({
        user_id: userId,
        otp: otp,
      });

      setOtpDialogOpen(false);
      navigate(ROUTES.LOGIN);
    } catch (error) {
      setOtpError(error.response?.data?.message || 'Invalid OTP');
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOTP(userId);
      setOtp('');
      setOtpError('');
    } catch (error) {
      console.error('Resend OTP error:', error);
    }
  };

  const handleSkipOTP = () => {
    setOtpDialogOpen(false);
    navigate(ROUTES.LOGIN);
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
        py: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 500,
          width: '100%',
          p: 4,
          borderRadius: 2,
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join us to manage your company profile
          </Typography>
        </Box>

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Full Name */}
            <TextField
              fullWidth
              label="Full Name"
              placeholder="Enter your full name"
              disabled={loading}
              error={!!errors.full_name}
              helperText={errors.full_name?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              {...register('full_name', {
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
            />

            {/* Email */}
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              disabled={loading}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              {...register('email', {
                required: 'Email is required',
                validate: validateEmail,
              })}
            />

            {/* Gender */}
            <FormControl component="fieldset" error={!!errors.gender}>
              <FormLabel component="legend">Gender</FormLabel>
              <Controller
                name="gender"
                control={control}
                rules={{ required: 'Gender is required' }}
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    {GENDER_OPTIONS.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                        disabled={loading}
                      />
                    ))}
                  </RadioGroup>
                )}
              />
              {errors.gender && (
                <FormHelperText>{errors.gender.message}</FormHelperText>
              )}
            </FormControl>

            {/* Mobile Number */}
            <FormControl fullWidth error={!!errors.mobile_no}>
              <Controller
                name="mobile_no"
                control={control}
                rules={{
                  required: 'Mobile number is required',
                  validate: (value) => {
                    const result = validateMobile('+' + value);
                    return result === true ? true : result;
                  },
                }}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    country={'in'}
                    disabled={loading}
                    inputStyle={{
                      width: '100%',
                      height: '56px',
                      fontSize: '16px',
                    }}
                    containerStyle={{
                      width: '100%',
                    }}
                  />
                )}
              />
              {errors.mobile_no && (
                <FormHelperText>{errors.mobile_no.message}</FormHelperText>
              )}
            </FormControl>

            {/* Password */}
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Create a strong password"
              disabled={loading}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('password', {
                required: 'Password is required',
                validate: validatePassword,
              })}
            />

            {/* Confirm Password */}
            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              disabled={loading}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ py: 1.5, mt: 1 }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </Box>
        </form>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        {/* Login Link */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
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

      {/* OTP Verification Dialog */}
      <Dialog
        open={otpDialogOpen}
        onClose={(event, reason) => {
          // Prevent closing on backdrop click
          if (reason !== 'backdropClick') {
            setOtpDialogOpen(false);
          }
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Verify Mobile Number</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter the 6-digit OTP sent to your mobile number
          </Typography>
          <TextField
            fullWidth
            label="OTP"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
              setOtpError('');
            }}
            error={!!otpError}
            helperText={otpError}
            inputProps={{ maxLength: 6 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link
              component="button"
              variant="body2"
              onClick={handleResendOTP}
              sx={{ textDecoration: 'none' }}
            >
              Resend OTP
            </Link>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleSkipOTP} color="inherit">
            Skip for Now
          </Button>
          <Button
            onClick={handleVerifyOTP}
            variant="contained"
            disabled={otp.length !== 6}
          >
            Verify
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading Overlay */}
      {loading && <LoadingSpinner fullScreen message="Creating your account..." />}
    </Box>
  );
};

export default RegisterForm;
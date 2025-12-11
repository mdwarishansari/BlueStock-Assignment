import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Link as MuiLink,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
  InputAdornment,
  IconButton,
  CircularProgress,
  Checkbox,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PhoneInput from 'react-phone-input-2';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { registerUser } from '../store/slices/authSlice';
import OTPVerificationModal from '../components/auth/OTPVerificationModal';
import React from 'react';
const MemoPhoneInput = React.memo(PhoneInput);

const schema = yup.object({
  full_name: yup.string().required('Full name is required'),
  mobile_no: yup.string().required('Mobile number is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  gender: yup.string().required('Gender is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  agree: yup.boolean().oneOf([true], 'You must agree to terms'),
});

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, registrationData } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit", 
    defaultValues: {
      gender: "m",
      agree: false,
    },
  });

  // ✅ THIS IS THE CORRECT PLACE FOR onSubmit
  const onSubmit = async (data) => {
    const { confirmPassword, agree, ...formData } = data;

    const payload = {
      ...formData,
      signup_type: "e",
    };

    const result = await dispatch(registerUser(payload));

    if (result.type === "auth/register/fulfilled") {
      setOtpModalOpen(true);
    }
  };


  const handleOTPVerified = () => {
    setOtpModalOpen(false);
    navigate('/login');
  };

  return (
    <>
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
            maxWidth: 1000,
            width: '100%',
            display: 'flex',
            overflow: 'hidden',
            borderRadius: 3,
          }}
        >
          {/* Left Side - Image */}
          <Box
            sx={{
              flex: 1,
              background: 'linear-gradient(180deg, #c084fc 0%, #7c3aed 100%)',
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2rem',
              fontWeight: 'bold',
            }}
          >
            IMG Placeholder
          </Box>

          {/* Right Side - Form */}
          <Box
            sx={{
              flex: 1,
              padding: { xs: 3, md: 4 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              maxHeight: '100vh',
              overflowY: 'auto',
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Register as a Company
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Full Name"
                margin="normal"
                size="small"
                {...register('full_name')}
                error={!!errors.full_name}
                helperText={errors.full_name?.message}
              />

              <FormControl fullWidth margin="normal">
                <Controller
                  name="mobile_no"
                  control={control}
                  render={({ field }) => (
                    <MemoPhoneInput
                      country={'in'}
                      value={field.value}
                      onChange={(phone) => field.onChange(`+${phone}`)}
                      inputStyle={{ width: '100%' }}
                    />
                  )}
                />
                {errors.mobile_no && (
                  <Typography color="error" variant="caption">
                    {errors.mobile_no.message}
                  </Typography>
                )}
              </FormControl>

              <TextField
                fullWidth
                label="Organization Email"
                margin="normal"
                size="small"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <FormControl component="fieldset" margin="normal" error={!!errors.gender}>
                <FormLabel component="legend">Gender</FormLabel>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup row {...field}>
                      <FormControlLabel value="m" control={<Radio />} label="Male" />
                      <FormControlLabel value="f" control={<Radio />} label="Female" />
                      <FormControlLabel value="o" control={<Radio />} label="Other" />
                    </RadioGroup>
                  )}
                />
              </FormControl>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  margin="normal"
                  size="small"
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  margin="normal"
                  size="small"
                  {...register('confirmPassword')}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          size="small"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <FormControlLabel
                control={
                  <Controller
                    name="agree"
                    control={control}
                    render={({ field }) => <Checkbox {...field} checked={field.value} />}
                  />
                }
                label={
                  <Typography variant="caption">
                    All your information is collected, stored and processed as per our data
                    processing guidelines, by signing on Internext, you agree to our{' '}
                    <MuiLink href="#">privacy Policy</MuiLink> and{' '}
                    <MuiLink href="#">terms of use</MuiLink>
                  </Typography>
                }
              />
              {errors.agree && (
                <Typography color="error" variant="caption">
                  {errors.agree.message}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 2, mb: 2, borderRadius: 50, py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Register'}
              </Button>

              <Typography align="center" variant="body2">
                Already have an account?{' '}
                <MuiLink
                  component={Link}
                  to="/login"
                  sx={{ fontWeight: 600, textDecoration: 'none' }}
                >
                  Login
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Card>
      </Box>

      {/* OTP Verification Modal */}
      {registrationData && (
        <OTPVerificationModal
          open={otpModalOpen}
          onClose={() => setOtpModalOpen(false)}
          userId={registrationData.user_id}
          mobileNo={registrationData.mobile_no}
          onVerified={handleOTPVerified}
        />
      )}
    </>
  );
};

export default Register;
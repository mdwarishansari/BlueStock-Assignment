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
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { loginUser } from '../store/slices/authSlice';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    if (result.type === 'auth/login/fulfilled') {
      const user = result.payload.data.user;
      // Check if user has company profile
      if (!user.hasCompany) {
        navigate('/company-setup');
      } else {
        navigate('/dashboard');
      }
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
            padding: { xs: 3, md: 5 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Login as a Company
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Email ID"
              margin="normal"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <MuiLink
                component={Link}
                to="/forgot-password"
                sx={{ fontSize: '0.875rem', textDecoration: 'none' }}
              >
                🔑 Login with OTP
              </MuiLink>
            </Box>

            <TextField
              fullWidth
              label="Enter your password"
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <MuiLink
                component={Link}
                to="/forgot-password"
                sx={{ fontSize: '0.875rem', textDecoration: 'none' }}
              >
                🔑 Forgot Password ?
              </MuiLink>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, borderRadius: 50, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>

            <Typography align="center" variant="body2">
              Don't have an account?{' '}
              <MuiLink
                component={Link}
                to="/register"
                sx={{ fontWeight: 600, textDecoration: 'none' }}
              >
                Sign up
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default Login;
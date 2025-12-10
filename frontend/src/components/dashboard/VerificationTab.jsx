import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  TextField,
  CircularProgress,
} from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';
import { verifyMobileOTP } from '../../store/slices/authSlice';
import { authApi } from '../../api/authApi';
import { toast } from 'react-toastify';

const VerificationTab = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);

  const handleResendEmailVerification = async () => {
    try {
      // In production, call backend to resend email
      toast.info('Email verification link sent! Check your inbox.');
    } catch (error) {
      toast.error('Failed to send verification email');
    }
  };

  const handleResendMobileOTP = async () => {
    try {
      await authApi.resendOTP(user.id);
      toast.success('OTP sent to your mobile number!');
    } catch (error) {
      toast.error('Failed to send OTP');
    }
  };

  const handleVerifyMobile = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setVerifying(true);
    const result = await dispatch(verifyMobileOTP({ user_id: user.id, otp }));
    setVerifying(false);

    if (result.type === 'auth/verifyMobile/fulfilled') {
      setOtp('');
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Account Verification
      </Typography>

      {/* Email Verification */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {user?.is_email_verified ? (
              <CheckCircle sx={{ color: 'success.main', mr: 2 }} />
            ) : (
              <Error sx={{ color: 'error.main', mr: 2 }} />
            )}
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Email Verification
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          </Box>

          {user?.is_email_verified ? (
            <Alert severity="success">Your email is verified!</Alert>
          ) : (
            <>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Please verify your email address to access all features.
              </Alert>
              <Button variant="contained" onClick={handleResendEmailVerification}>
                Resend Verification Email
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Mobile Verification */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {user?.is_mobile_verified ? (
              <CheckCircle sx={{ color: 'success.main', mr: 2 }} />
            ) : (
              <Error sx={{ color: 'error.main', mr: 2 }} />
            )}
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Mobile Verification
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.mobile_no}
              </Typography>
            </Box>
          </Box>

          {user?.is_mobile_verified ? (
            <Alert severity="success">Your mobile number is verified!</Alert>
          ) : (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                Enter the OTP sent to your mobile number
              </Alert>

              <TextField
                fullWidth
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                inputProps={{ maxLength: 6 }}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={handleResendMobileOTP}>
                  Resend OTP
                </Button>
                <Button
                  variant="contained"
                  onClick={handleVerifyMobile}
                  disabled={verifying || otp.length !== 6}
                >
                  {verifying ? <CircularProgress size={24} /> : 'Verify Mobile'}
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default VerificationTab;
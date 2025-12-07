import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { selectUser } from '../store/slices/authSlice';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * Account Verification Page
 * Allows users to verify email and mobile number
 */
const VerifyAccount = () => {
  const user = useSelector(selectUser);
  const { verifyMobile, resendOTP, loading } = useAuth();
  
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [sendingOTP, setSendingOTP] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);

  // Check verification status
  const isEmailVerified = user?.is_email_verified || false;
  const isMobileVerified = user?.is_mobile_verified || false;
  const allVerified = isEmailVerified && isMobileVerified;

  /**
   * Handle Email Verification
   * In development mode, we'll call the backend directly
   */
  const handleSendEmailVerification = async () => {
    try {
      setVerifyingEmail(true);
      
      // For development: Call backend to mark email as verified
      const response = await fetch(
        `http://localhost:4000/api/auth/verify-email?user_id=${user.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      
      if (data.success) {
        toast.success('Email verified successfully!');
        setTimeout(() => {
          window.location.reload(); // Reload to update state
        }, 1000);
      } else {
        toast.error(data.message || 'Email verification failed');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      toast.error('Failed to verify email. Please try again.');
    } finally {
      setVerifyingEmail(false);
    }
  };

  /**
   * Handle Send Mobile OTP
   */
  const handleSendMobileOTP = async () => {
    try {
      setSendingOTP(true);
      await resendOTP(user.id);
      toast.success('OTP sent to your mobile number!');
    } catch (error) {
      console.error('Send OTP error:', error);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setSendingOTP(false);
    }
  };

  /**
   * Handle Verify Mobile OTP
   */
  const handleVerifyMobileOTP = async () => {
    setOtpError('');

    // Validate OTP
    if (!otp || otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      await verifyMobile({
        user_id: user.id,
        otp: otp,
      });
      
      toast.success('Mobile number verified successfully!');
      setOtp('');
      setTimeout(() => {
        window.location.reload(); // Reload to update state
      }, 1000);
    } catch (error) {
      console.error('Verify OTP error:', error);
      setOtpError(error.response?.data?.message || 'Invalid OTP. Please try again.');
    }
  };

  if (!user) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Verify Your Account
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Complete your account verification to access all features
      </Typography>

      {/* Success Message */}
      {allVerified && (
        <Alert severity="success" sx={{ mb: 3 }} icon={<CheckCircleIcon />}>
          <Typography fontWeight={600}>
            Your account is fully verified!
          </Typography>
          <Typography variant="body2">
            You have access to all features.
          </Typography>
        </Alert>
      )}

      {/* Warning Message */}
      {!allVerified && (
        <Alert severity="warning" sx={{ mb: 3 }} icon={<WarningIcon />}>
          <Typography fontWeight={600}>
            Verification Required
          </Typography>
          <Typography variant="body2">
            Please verify your email and mobile number to unlock all features.
          </Typography>
        </Alert>
      )}

      {/* Email Verification Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <EmailIcon sx={{ fontSize: 40, color: isEmailVerified ? 'success.main' : 'warning.main' }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" fontWeight={600}>
                Email Verification
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
            {isEmailVerified && (
              <VerifiedIcon sx={{ fontSize: 32, color: 'success.main' }} />
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {isEmailVerified ? (
            <Alert severity="success" icon={<CheckCircleIcon />}>
              Your email is verified
            </Alert>
          ) : (
            <Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Click the button below to verify your email address. This helps us keep your account secure.
              </Typography>
              <Button
                variant="contained"
                onClick={handleSendEmailVerification}
                disabled={verifyingEmail || loading}
                startIcon={verifyingEmail ? <CircularProgress size={20} /> : <EmailIcon />}
              >
                {verifyingEmail ? 'Verifying...' : 'Verify Email'}
              </Button>
              <Typography variant="caption" display="block" sx={{ mt: 1 }} color="text.secondary">
                Note: In development mode, email will be verified instantly
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Mobile Verification Card */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <PhoneIcon sx={{ fontSize: 40, color: isMobileVerified ? 'success.main' : 'warning.main' }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" fontWeight={600}>
                Mobile Verification
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.mobile_no}
              </Typography>
            </Box>
            {isMobileVerified && (
              <VerifiedIcon sx={{ fontSize: 32, color: 'success.main' }} />
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {isMobileVerified ? (
            <Alert severity="success" icon={<CheckCircleIcon />}>
              Your mobile number is verified
            </Alert>
          ) : (
            <Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                We'll send a 6-digit OTP to your mobile number. Enter the OTP below to verify.
              </Typography>

              {/* Send OTP Button */}
              <Button
                variant="outlined"
                onClick={handleSendMobileOTP}
                disabled={sendingOTP || loading}
                startIcon={sendingOTP ? <CircularProgress size={20} /> : <PhoneIcon />}
                sx={{ mb: 3 }}
              >
                {sendingOTP ? 'Sending...' : 'Send OTP'}
              </Button>

              {/* OTP Input */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <TextField
                  fullWidth
                  label="Enter OTP"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                    setOtpError('');
                  }}
                  error={!!otpError}
                  helperText={otpError}
                  disabled={loading}
                  inputProps={{ maxLength: 6 }}
                />
                <Button
                  variant="contained"
                  onClick={handleVerifyMobileOTP}
                  disabled={loading || otp.length !== 6}
                  sx={{ minWidth: 120, height: 56 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Verify'}
                </Button>
              </Box>

              <Typography variant="caption" display="block" sx={{ mt: 1 }} color="text.secondary">
                Didn't receive OTP? Click "Send OTP" again
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Help Section */}
      <Paper sx={{ p: 3, mt: 3, backgroundColor: 'info.lighter', border: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Need Help?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          If you're having trouble verifying your account, please contact support at{' '}
          <Typography component="span" color="primary" fontWeight={600}>
            support@bluestock.in
          </Typography>
        </Typography>
      </Paper>
    </Box>
  );
};

export default VerifyAccount;
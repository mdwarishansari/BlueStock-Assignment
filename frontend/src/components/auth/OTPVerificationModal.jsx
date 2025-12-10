import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { verifyMobileOTP } from '../../store/slices/authSlice';
import { authApi } from '../../api/authApi';
import { toast } from 'react-toastify';

const OTPVerificationModal = ({ open, onClose, userId, mobileNo, onVerified }) => {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    const result = await dispatch(verifyMobileOTP({ user_id: userId, otp }));
    setLoading(false);

    if (result.type === 'auth/verifyMobile/fulfilled') {
      onVerified();
    }
  };

  const handleResendOTP = async () => {
    try {
      await authApi.resendOTP(userId);
      toast.success('OTP resent successfully!');
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          Great! Almost done!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please verify your mobile no
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Alert severity="success" sx={{ mb: 2 }}>
          A verification link has been sent to your email. Please check your inbox and verify.
        </Alert>

        <Alert severity="info" sx={{ mb: 3 }}>
          Enter the One Time Password (OTP) which has been sent to {mobileNo}
        </Alert>

        <TextField
          fullWidth
          label="Enter Your OTP Here"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '1.5rem' } }}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2">
            Didn't receive OTP?{' '}
            <Button size="small" onClick={handleResendOTP}>
              Resend OTP
            </Button>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Having Trouble?{' '}
            <Button size="small" color="error">
              Report Issue!
            </Button>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button fullWidth variant="outlined" onClick={onClose}>
            Close
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleVerify}
            disabled={loading || otp.length !== 6}
          >
            {loading ? <CircularProgress size={24} /> : 'Verify Mobile'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OTPVerificationModal;
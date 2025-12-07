import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedIcon from '@mui/icons-material/Verified';
import WarningIcon from '@mui/icons-material/Warning';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/slices/authSlice';
import { selectCompany, selectHasCompany } from '../store/slices/companySlice';
import ProfileCard from '../components/company/ProfileCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ROUTES } from '../utils/constants';
import { formatDate, formatGender, getInitials } from '../utils/formatters';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const company = useSelector(selectCompany);
  const hasCompany = useSelector(selectHasCompany);

  if (!user) {
    return <LoadingSpinner fullScreen />;
  }

  const verificationStatus = {
    email: user.is_email_verified,
    mobile: user.is_mobile_verified,
  };

  const allVerified = verificationStatus.email && verificationStatus.mobile;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {user.full_name}! Here's your profile overview.
        </Typography>
      </Box>

      {/* Verification Alert */}
      {!allVerified && (
        <Paper
          sx={{
            p: 2,
            mb: 3,
            backgroundColor: 'warning.lighter',
            border: 1,
            borderColor: 'warning.main',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <WarningIcon color="warning" />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                Verification Required
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {!verificationStatus.email && 'Email verification pending. '}
                {!verificationStatus.mobile && 'Mobile verification pending. '}
                Please complete verification to access all features.
              </Typography>
            </Box>

            {/* Important: NO redirect loop! Only navigate on click */}
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(ROUTES.VERIFY_ACCOUNT)}
            >
              Verify Now
            </Button>
          </Box>
        </Paper>
      )}

      <Grid container spacing={3}>
        {/* User Profile Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 2,
                    backgroundColor: 'primary.main',
                    fontSize: '2rem',
                  }}
                >
                  {getInitials(user.full_name)}
                </Avatar>
                <Typography variant="h6" fontWeight={600}>
                  {user.full_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {user.email}
                </Typography>

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(ROUTES.SETTINGS)}
                  sx={{ mt: 1 }}
                >
                  Edit Profile
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* User Details */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Gender
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formatGender(user.gender)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Mobile Number
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {user.mobile_no}
                    </Typography>
                    {verificationStatus.mobile && (
                      <VerifiedIcon color="success" sx={{ fontSize: 16 }} />
                    )}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email Status
                  </Typography>
                  <Chip
                    label={verificationStatus.email ? 'Verified' : 'Not Verified'}
                    size="small"
                    color={verificationStatus.email ? 'success' : 'warning'}
                    icon={
                      verificationStatus.email ? (
                        <VerifiedIcon />
                      ) : (
                        <WarningIcon />
                      )
                    }
                  />
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Member Since
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formatDate(user.created_at)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Company Profile Card */}
        <Grid item xs={12} md={8}>
          {hasCompany ? (
            <ProfileCard
              company={company}
              onEdit={() => navigate(ROUTES.SETTINGS)}
              editable
            />
          ) : (
            <Card>
              <CardContent>
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <BusinessIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />

                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    No Company Profile
                  </Typography>

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    paragraph
                    sx={{ maxWidth: 500, mx: 'auto' }}
                  >
                    Create your company profile to showcase your business,
                    connect with partners, and access premium features.
                  </Typography>

                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddBusinessIcon />}
                    onClick={() => navigate(ROUTES.COMPANY_REGISTRATION)}
                    sx={{ mt: 2 }}
                  >
                    Register Your Company
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {[
              {
                label: 'Profile',
                value: allVerified ? 'Complete' : 'Incomplete',
                icon: <PersonIcon />,
                color: 'primary.main',
              },
              {
                label: 'Company',
                value: hasCompany ? 'Registered' : 'Not Registered',
                icon: <BusinessIcon />,
                color: 'success.main',
              },
              {
                label: 'Email',
                value: verificationStatus.email ? 'Verified' : 'Pending',
                icon: <VerifiedIcon />,
                color: verificationStatus.email ? 'success.main' : 'warning.main',
              },
              {
                label: 'Mobile',
                value: verificationStatus.mobile ? 'Verified' : 'Pending',
                icon: <VerifiedIcon />,
                color: verificationStatus.mobile ? 'success.main' : 'warning.main',
              },
            ].map((item, idx) => (
              <Grid key={idx} item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ backgroundColor: item.color }}>{item.icon}</Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {item.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.value}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
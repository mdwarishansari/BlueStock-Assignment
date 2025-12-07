import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/slices/authSlice';
import { selectCompany } from '../store/slices/companySlice';
import ProfileCard from '../components/company/ProfileCard';
import { ROUTES } from '../utils/constants';

/**
 * Profile Page
 * Displays user and company profile in read-only mode
 */
const Profile = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const company = useSelector(selectCompany);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View your profile information
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(ROUTES.SETTINGS)}
        >
          Edit Profile
        </Button>
      </Box>

      {company && <ProfileCard company={company} editable={false} />}
    </Box>
  );
};

export default Profile;
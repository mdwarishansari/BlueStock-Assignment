import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Avatar,
  Divider,
  Link as MuiLink,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import { formatDate, formatURL, getInitials } from '../../utils/formatters';

/**
 * Company Profile Card Component
 */
const ProfileCard = ({ company, onEdit, editable = true }) => {
  if (!company) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <BusinessIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No Company Profile
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please register your company to get started
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const socialIcons = {
    linkedin: <LinkedInIcon />,
    twitter: <TwitterIcon />,
    facebook: <FacebookIcon />,
    instagram: <InstagramIcon />,
  };

  const socialLinks = company.social_links
    ? typeof company.social_links === 'string'
      ? JSON.parse(company.social_links)
      : company.social_links
    : {};

  return (
    <Card sx={{ position: 'relative', overflow: 'visible' }}>
      {/* Banner Image */}
      {company.banner_url ? (
        <CardMedia
          component="img"
          height="200"
          image={company.banner_url}
          alt={`${company.company_name} banner`}
          sx={{ objectFit: 'cover' }}
        />
      ) : (
        <Box
          sx={{
            height: 200,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        />
      )}

      {/* Edit Button */}
      {editable && (
        <IconButton
          onClick={onEdit}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            backgroundColor: 'white',
            '&:hover': {
              backgroundColor: 'grey.100',
            },
          }}
        >
          <EditIcon />
        </IconButton>
      )}

      <CardContent sx={{ pt: 0 }}>
        {/* Logo and Company Name */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: -4, mb: 2 }}>
          <Avatar
            src={company.logo_url}
            alt={company.company_name}
            sx={{
              width: 100,
              height: 100,
              border: '4px solid white',
              backgroundColor: 'primary.main',
              fontSize: '2rem',
              fontWeight: 600,
            }}
          >
            {getInitials(company.company_name)}
          </Avatar>

          <Box sx={{ ml: 2, flexGrow: 1, mt: 5 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {company.company_name}
            </Typography>
            
            <Chip
              label={company.industry}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>

        {/* Description */}
        {company.description && (
          <Typography variant="body2" color="text.secondary" paragraph>
            {company.description}
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Company Details */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* Location */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <LocationOnIcon sx={{ fontSize: 20, color: 'text.secondary', mt: 0.3 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                {company.address}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {company.city}, {company.state}, {company.country} - {company.postal_code}
              </Typography>
            </Box>
          </Box>

          {/* Website */}
          {company.website && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LanguageIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              <MuiLink
                href={formatURL(company.website)}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ textDecoration: 'none' }}
              >
                <Typography variant="body2" color="primary">
                  {company.website}
                </Typography>
              </MuiLink>
            </Box>
          )}

          {/* Founded Date */}
          {company.founded_date && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarTodayIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Founded: {formatDate(company.founded_date, 'MMMM yyyy')}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Social Links */}
        {Object.keys(socialLinks).length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {Object.entries(socialLinks).map(([platform, url]) => {
                if (!url) return null;
                return (
                  <IconButton
                    key={platform}
                    size="small"
                    component="a"
                    href={formatURL(url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                    }}
                  >
                    {socialIcons[platform] || <LanguageIcon />}
                  </IconButton>
                );
              })}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
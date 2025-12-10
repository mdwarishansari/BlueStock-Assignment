import { useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import {
  Business,
  Email,
  Phone,
  LocationOn,
  Language,
  CalendarToday,
  VerifiedUser,
} from '@mui/icons-material';

const Overview = () => {
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        {/* User Profile Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    mr: 2,
                  }}
                >
                  {user?.full_name?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {user?.full_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2">{user?.email}</Typography>
                  {user?.is_email_verified ? (
                    <Chip label="Verified" size="small" color="success" />
                  ) : (
                    <Chip label="Not Verified" size="small" color="error" />
                  )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2">{user?.mobile_no}</Typography>
                  {user?.is_mobile_verified ? (
                    <Chip label="Verified" size="small" color="success" />
                  ) : (
                    <Chip label="Not Verified" size="small" color="error" />
                  )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2">
                    Joined: {new Date(user?.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Company Profile Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              {company ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      src={company.logo_url}
                      sx={{ width: 80, height: 80, mr: 2 }}
                      variant="rounded"
                    >
                      <Business />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {company.company_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {company.industry}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {company.website && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Language sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Typography variant="body2">{company.website}</Typography>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn sx={{ color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="body2">
                        {company.city}, {company.state}, {company.country}
                      </Typography>
                    </Box>

                    {company.founded_date && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Typography variant="body2">
                          Founded: {new Date(company.founded_date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No company profile found
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Description Card */}
        {company?.description && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  About Company
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {company.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Overview;
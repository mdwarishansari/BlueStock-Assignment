import { Box, Container, Typography, Button, Card } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

const SetupComplete = ({ onNavigate }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ p: 6, textAlign: 'center' }}>
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              bgcolor: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 3rem',
            }}
          >
            <CheckCircle sx={{ fontSize: 60, color: 'primary.main' }} />
          </Box>

          <Typography variant="h4" fontWeight="bold" gutterBottom>
            🎉 Congratulations, Your profile is 100% complete!
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Donec hendrerit, ante mattis pellentesque eleifend, tortor urna malesuada ante, eget
            aliquam nulla hendrerit ligula. Nunc mauris arcu, mattis sed sem vitae.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="outlined" size="large" onClick={onNavigate}>
              View Dashboard
            </Button>
            <Button variant="contained" size="large" onClick={onNavigate}>
              View Profile
            </Button>
          </Box>
        </Card>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
          © 2021 Jobpilot - Job Board. All rights Reserved
        </Typography>
      </Container>
    </Box>
  );
};

export default SetupComplete;
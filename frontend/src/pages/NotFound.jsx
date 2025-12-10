import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Container } from '@mui/material';
import { Home } from '@mui/icons-material';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" fontWeight="bold" color="primary" sx={{ fontSize: '6rem' }}>
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          startIcon={<Home />}
          onClick={() => navigate('/')}
          size="large"
        >
          Go Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
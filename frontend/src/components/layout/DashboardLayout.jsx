import { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile={isMobile} />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          ml: { md: sidebarOpen ? '280px' : 0 },
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Navbar onToggleSidebar={toggleSidebar} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
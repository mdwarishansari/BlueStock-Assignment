import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { selectSidebarOpen } from '../../store/slices/uiSlice';
import useAuth from '../../hooks/useAuth';
import useCompany from '../../hooks/useCompany';

/**
 * Main Layout Component
 * Wraps authenticated pages with Navbar and Sidebar
 */
const Layout = ({ children }) => {
  const sidebarOpen = useSelector(selectSidebarOpen);
  const { fetchProfile } = useAuth();
  const { fetchCompanyProfile } = useCompany();

  useEffect(() => {
    // Fetch user profile and company profile on mount
    const fetchData = async () => {
      try {
        await fetchProfile();
        await fetchCompanyProfile().catch(() => {
          // Ignore 404 errors (no company profile yet)
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'background.default',
          transition: 'margin 0.3s',
        }}
      >
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            maxWidth: '100%',
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
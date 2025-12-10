import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  Person,
  Business,
  VerifiedUser,
  Logout,
  Work,
} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';
import { useDispatch } from 'react-redux';

const Sidebar = ({ open, onClose, isMobile }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  // Show verification tab only if email or mobile is not verified
  const showVerificationTab = !user?.is_email_verified || !user?.is_mobile_verified;

  const menuItems = [
    { text: 'Overview', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Profile Settings', icon: <Person />, path: '/dashboard/profile-edit' },
    { text: 'Company Settings', icon: <Business />, path: '/dashboard/company-edit' },
  ];

  // Add verification tab conditionally
  if (showVerificationTab) {
    menuItems.push({
      text: 'Verification',
      icon: <VerifiedUser />,
      path: '/dashboard/verification',
      badge: true,
    });
  }

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Work sx={{ color: 'primary.main', fontSize: 32 }} />
        <Typography variant="h6" fontWeight="bold" color="primary">
          Jobpilot
        </Typography>
      </Box>

      <Divider />

      {/* Menu Items */}
      <List sx={{ flexGrow: 1, px: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ px: 2, py: 1, display: 'block' }}>
          EMPLOYERS DASHBOARD
        </Typography>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'white' : 'text.primary',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.dark' : 'action.hover',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'white' : 'text.secondary',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
                {item.badge && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'error.main',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Logout */}
      <List sx={{ px: 2, pb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              color: 'error.main',
              '&:hover': {
                bgcolor: 'error.light',
                color: 'error.dark',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Log-out" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer anchor="left" open={open} onClose={onClose}>
          <Box sx={{ width: 280 }}>{drawerContent}</Box>
        </Drawer>
      ) : (
        <Drawer
          variant="persistent"
          anchor="left"
          open={open}
          sx={{
            width: 280,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
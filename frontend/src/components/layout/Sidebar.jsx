import { useSelector, useDispatch } from 'react-redux';
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
  Badge,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person,
  Business,
  VerifiedUser,
  ExitToApp,
} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';

const drawerWidth = 280;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // ✅ FIX: Check if user needs verification
  const needsVerification = !user?.is_email_verified || !user?.is_mobile_verified;

  const menuItems = [
    { text: 'Overview', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Profile Settings', icon: <Person />, path: '/dashboard/profile-edit' },
    { text: 'Company Settings', icon: <Business />, path: '/dashboard/company-edit' },
  ];

  // ✅ FIX: Only add verification item if needed
  if (needsVerification) {
    menuItems.push({
      text: 'Verification',
      icon: <VerifiedUser />,
      path: '/dashboard/verification',
      badge: true,
    });
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          🧳 Jobpilot
        </Typography>
      </Box>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ px: 2, fontWeight: 600 }}
        >
          EMPLOYERS DASHBOARD
        </Typography>
      </Box>

      <List sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon>
                {item.badge ? (
                  <Badge color="error" variant="dot">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider />

      <List sx={{ px: 2, pb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'error.lighter',
              },
            }}
          >
            <ListItemIcon>
              <ExitToApp sx={{ color: 'error.main' }} />
            </ListItemIcon>
            <ListItemText primary="Log-out" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
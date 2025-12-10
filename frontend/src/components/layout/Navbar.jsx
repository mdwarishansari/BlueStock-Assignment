import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  AccountCircle,
  Logout,
  Settings,
} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';

const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/dashboard/profile-edit');
    handleMenuClose();
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 1,
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={onToggleSidebar}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          {company?.company_name || 'Dashboard'}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <IconButton onClick={handleMenuOpen}>
            <Avatar
              src={company?.logo_url}
              alt={user?.full_name}
              sx={{ width: 40, height: 40 }}
            >
              {user?.full_name?.charAt(0)}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: { width: 220, mt: 1 },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {user?.full_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleProfile}>
              <AccountCircle sx={{ mr: 2 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={() => navigate('/dashboard/company-edit')}>
              <Settings sx={{ mr: 2 }} />
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
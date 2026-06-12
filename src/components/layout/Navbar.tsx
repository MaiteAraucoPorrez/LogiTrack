import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Chip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useThemeMode } from '../../context/ThemeContext';
import { DRAWER_WIDTH } from './Sidebar';

interface NavbarProps {
  onMenuClick: () => void;
}

const ROLE_COLORS: Record<string, 'primary' | 'secondary' | 'default'> = {
  Administrator: 'secondary',
  Employee: 'primary',
  Customer: 'default',
};

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useThemeMode();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setAnchorEl(null);
  };

  const handlePerfil = () => {
    navigate('/profile');
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { md: `${DRAWER_WIDTH}px` },
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: 'none' } }}
          aria-label="abrir menú de navegación"
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip
              label={user.role}
              size="small"
              color={ROLE_COLORS[user.role] ?? 'default'}
              sx={{ fontWeight: 600, display: { xs: 'none', sm: 'flex' } }}
            />
            <Typography
              variant="body2"
              sx={{ display: { xs: 'none', md: 'block' }, fontWeight: 500 }}
            >
              {user.name}
            </Typography>

            {/* Toggle modo oscuro */}
            <Button onClick={toggleTheme} variant="outlined" size="small" color="primary" sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'none' }}>
              {isDark ? 'Modo claro' : 'Modo oscuro'}
            </Button>

            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              size="small"
              aria-label="menú de usuario"
              aria-haspopup="true"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
                {(user.name || '?').charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem disabled>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{user?.name}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.login}</Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handlePerfil}>
            <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} />
            Perfil
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
            Cerrar Sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import RouteIcon from '@mui/icons-material/Route';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const DRAWER_WIDTH = 240;

interface NavItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: 'General',
    items: [{ text: 'Panel', icon: <DashboardIcon />, path: '/dashboard' }],
  },
  {
    label: 'Operaciones',
    items: [
      { text: 'Envíos', icon: <LocalShippingIcon />, path: '/shipments' },
      { text: 'Paquetes', icon: <InventoryIcon />, path: '/packages' },
      { text: 'Direcciones', icon: <LocationOnIcon />, path: '/addresses' },
    ],
  },
  {
    label: 'Flota y Personal',
    items: [
      { text: 'Clientes', icon: <PeopleIcon />, path: '/customers' },
      { text: 'Conductores', icon: <PersonIcon />, path: '/drivers' },
      { text: 'Vehículos', icon: <DirectionsCarIcon />, path: '/vehicles' },
    ],
  },
  {
    label: 'Infraestructura',
    items: [
      { text: 'Almacenes', icon: <WarehouseIcon />, path: '/warehouses' },
      { text: 'Rutas', icon: <RouteIcon />, path: '/routes' },
    ],
  },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const DrawerContent: React.FC = () => {
  const location = useLocation();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0D1B2A', color: '#fff' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <LocalShippingIcon sx={{ color: '#F57C00', fontSize: 28 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
            LogiTrack
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Logística Inteligente
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
        {NAV_SECTIONS.map((section) => (
          <Box key={section.label}>
            <Typography
              variant="caption"
              sx={{
                px: 2.5,
                py: 1,
                display: 'block',
                color: 'rgba(255,255,255,0.35)',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontSize: '0.65rem',
              }}
            >
              {section.label}
            </Typography>
            <List dense disablePadding>
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <ListItemButton
                    key={item.text}
                    component={Link}
                    to={item.path}
                    sx={{
                      mx: 1,
                      mb: 0.25,
                      borderRadius: 1.5,
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                      bgcolor: isActive ? '#1565C0' : 'transparent',
                      '&:hover': {
                        bgcolor: isActive ? '#1565C0' : 'rgba(255,255,255,0.07)',
                        color: '#fff',
                      },
                      transition: 'all 0.15s',
                    }}
                  >
                    <ListItemIcon
                      sx={{ minWidth: 36, color: isActive ? '#fff' : 'rgba(255,255,255,0.5)' }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      slotProps={{
                        primary: {
                          sx: { fontSize: '0.875rem', fontWeight: isActive ? 600 : 400 },
                        },
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onClose }) => (
  <Box
    component="nav"
    sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
    aria-label="menú de navegación"
  >
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', border: 'none' },
      }}
    >
      <DrawerContent />
    </Drawer>

    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', border: 'none' },
      }}
      open
    >
      <DrawerContent />
    </Drawer>
  </Box>
);

export default Sidebar;
export { DRAWER_WIDTH };

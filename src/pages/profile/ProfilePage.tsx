import React from 'react';
import {
  Box, Card, CardContent, Typography, Avatar, Chip, Divider, Grid,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SEOHead from '../../components/seo/SEOHead';
import { useAuth } from '../../hooks/useAuth';

const ROLE_LABELS: Record<string, string> = {
  Administrator: 'Administrador',
  Employee: 'Empleado',
  Customer: 'Cliente',
};

const ROLE_COLORS: Record<string, 'secondary' | 'primary' | 'default'> = {
  Administrator: 'secondary',
  Employee: 'primary',
  Customer: 'default',
};

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <SEOHead title="Perfil" description="Información de tu cuenta en LogiTrack." />

      <Box sx={{ maxWidth: 560, mx: 'auto', mt: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Mi Perfil
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Información de tu cuenta en el sistema
        </Typography>

        <Card>
          <CardContent sx={{ p: 4 }}>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  width: 88,
                  height: 88,
                  bgcolor: 'primary.main',
                  fontSize: '2.2rem',
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {user.name}
              </Typography>
              <Chip
                label={ROLE_LABELS[user.role] ?? user.role}
                color={ROLE_COLORS[user.role] ?? 'default'}
                size="small"
                sx={{ mt: 1, fontWeight: 600 }}
              />
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid size={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <PersonIcon color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Nombre completo
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {user.name}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <BadgeIcon color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Usuario
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                      {user.login}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AdminPanelSettingsIcon color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Rol en el sistema
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {ROLE_LABELS[user.role] ?? user.role}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default ProfilePage;

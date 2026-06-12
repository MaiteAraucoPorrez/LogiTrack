import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useAuth } from '../hooks/useAuth';
import SEOHead from '../components/seo/SEOHead';

const loginSchema = z.object({
  user: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard';

  if (isAuthenticated) {
    navigate(from, { replace: true });
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null);
    setLoading(true);
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { messages?: { text: string }[] } } })
          ?.response?.data?.messages?.[0]?.text ??
        'Usuario o contraseña incorrectos. Por favor intenta nuevamente.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Iniciar Sesión"
        description="Inicia sesión en LogiTrack para gestionar tus envíos y operaciones logísticas."
      />

      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0D1B2A 0%, #1565C0 100%)',
          p: 2,
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 420, borderRadius: 3 }} elevation={8}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'primary.main',
                  borderRadius: '50%',
                  p: 1.5,
                  mb: 1.5,
                }}
              >
                <LocalShippingIcon sx={{ fontSize: 32, color: '#fff' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }} color="primary">
                LogiTrack
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Inicia sesión en tu cuenta
              </Typography>
            </Box>

            {apiError && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setApiError(null)}>
                {apiError}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              aria-label="formulario de inicio de sesión"
            >
              <Box sx={{ mb: 2 }}>
                <label
                  htmlFor="user"
                  style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500, color: '#333' }}
                >
                  Usuario
                </label>
                <TextField
                  id="user"
                  {...register('user')}
                  fullWidth
                  placeholder="Ingresa tu usuario"
                  autoComplete="username"
                  autoFocus
                  error={!!errors.user}
                  helperText={errors.user?.message}
                  size="small"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <label
                  htmlFor="password"
                  style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500, color: '#333' }}
                >
                  Contraseña
                </label>
                <TextField
                  id="password"
                  {...register('password')}
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  size="small"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((v) => !v)}
                            edge="end"
                            size="small"
                            aria-label={showPassword ? 'ocultar contraseña' : 'mostrar contraseña'}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ py: 1.5, fontWeight: 700 }}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Volver a{' '}
                <Link
                  to="/"
                  style={{ color: '#1565C0', fontWeight: 600, textDecoration: 'none' }}
                >
                  Inicio
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default LoginPage;

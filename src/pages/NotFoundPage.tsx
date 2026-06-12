import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SEOHead from '../components/seo/SEOHead';

const NotFoundPage: React.FC = () => (
  <>
    <SEOHead title="Página no encontrada" description="La página que buscas no existe o ha sido movida." />

    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0D1B2A 0%, #1565C0 100%)',
        textAlign: 'center',
        color: '#fff',
        p: 3,
      }}
    >
      <Container maxWidth="sm">
        <LocalShippingIcon sx={{ fontSize: 80, color: '#F57C00', mb: 2, opacity: 0.7 }} />
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '6rem', md: '10rem' },
            color: 'rgba(255,255,255,0.15)',
            lineHeight: 1,
            fontWeight: 800,
          }}
        >
          404
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mt: -2, mb: 2, color: '#fff' }}>
          Envío no Encontrado
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4 }}>
          Parece que este paquete se perdió en tránsito. La página que buscas no existe o ha sido movida.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={Link}
            to="/dashboard"
            variant="contained"
            color="secondary"
            size="large"
          >
            Ir al Panel
          </Button>
          <Button
            component={Link}
            to="/"
            variant="outlined"
            size="large"
            sx={{
              borderColor: 'rgba(255,255,255,0.5)',
              color: '#fff',
              '&:hover': { borderColor: '#fff' },
            }}
          >
            Volver al Inicio
          </Button>
        </Box>
      </Container>
    </Box>
  </>
);

export default NotFoundPage;

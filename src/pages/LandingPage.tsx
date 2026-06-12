import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  AppBar,
  Toolbar,
  Chip,
  TextField,
  Snackbar,
  Alert,
  Fab,
  Zoom,
} from '@mui/material';
import { Link } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import PeopleIcon from '@mui/icons-material/People';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SEOHead from '../components/seo/SEOHead';
import camionImg from '../assets/img-camion.svg';
import panelImg from '../assets/img-panel.svg';
import salidaTransporteImg from '../assets/img/salida_transporte_carga.webp';
import entregaEnviosImg from '../assets/img/entrega_envios.webp';
import coberturaNacionalImg from '../assets/img/envios_cobertura_nacional.webp';
import gerenteAlmacenImg from '../assets/img/gerente_almacen.webp';
import logisticaRutaImg from '../assets/img/logistica_ruta.webp';
import serviciosLogisticaImg from '../assets/img/servicios_logistica.webp';

const FEATURES = [
  {
    icon: <TrackChangesIcon sx={{ fontSize: 40, color: '#1565C0' }} />,
    title: 'Rastreo en tiempo real',
    desc: 'Monitorea tus envíos en cada etapa del proceso de entrega con actualizaciones de estado en vivo.',
  },
  {
    icon: <WarehouseIcon sx={{ fontSize: 40, color: '#1565C0' }} />,
    title: 'Gestión de almacenes',
    desc: 'Administra múltiples almacenes, inventario y operaciones en toda la cadena logística.',
  },
  {
    icon: <PeopleIcon sx={{ fontSize: 40, color: '#1565C0' }} />,
    title: 'Control de flota y conductores',
    desc: 'Asigna conductores a envíos y rastrea tu flota de vehículos en tiempo real.',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 40, color: '#1565C0' }} />,
    title: 'Optimización de rutas',
    desc: 'Planifica y gestiona rutas de entrega para reducir tiempos de tránsito y costos operativos.',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40, color: '#1565C0' }} />,
    title: 'Acceso por roles',
    desc: 'Acceso multi-rol seguro: Administradores gestionan todo, empleados operan y clientes rastrean sus envíos.',
  },
  {
    icon: <LocalShippingIcon sx={{ fontSize: 40, color: '#1565C0' }} />,
    title: 'Visibilidad total',
    desc: 'Desde el pedido hasta la entrega final, cada paso queda registrado y accesible en el sistema.',
  },
];

const STEPS = [
  { num: '01', title: 'Crear envío', desc: 'Registra un nuevo envío con origen, destino y detalles del paquete.' },
  { num: '02', title: 'Asignar recursos', desc: 'Asigna un conductor, vehículo y ruta de entrega al envío.' },
  { num: '03', title: 'Rastrear y actualizar', desc: 'Monitorea el estado en tiempo real y actualiza en cada punto de control del almacén.' },
  { num: '04', title: 'Entregar y confirmar', desc: 'Completa la entrega y registra la confirmación para el cliente.' },
];

const STATS = [
  { value: '10,000+', label: 'Envíos procesados' },
  { value: '500+', label: 'Clientes activos' },
  { value: '50+', label: 'Vehículos en flota' },
  { value: '99.8%', label: 'Entregas a tiempo' },
];

const PHOTO_STRIP = [
  {
    src: salidaTransporteImg,
    alt: 'Camión de carga LogiTrack saliendo del centro de distribución para iniciar la ruta de entrega hacia su destino',
    caption: 'Salida a tiempo',
    sub: 'Despacho puntual desde cada centro de distribución',
  },
  {
    src: entregaEnviosImg,
    alt: 'Mensajero de LogiTrack entregando paquete al cliente final, completando la última milla del envío de forma segura',
    caption: 'Entrega garantizada',
    sub: 'Confirmación en destino para cada paquete',
  },
  {
    src: coberturaNacionalImg,
    alt: 'Mapa de cobertura nacional de envíos LogiTrack con rutas trazadas entre las principales ciudades de Bolivia',
    caption: 'Cobertura nacional',
    sub: 'Conectamos ciudades en todo el país',
  },
];

const OPS_CARDS = [
  {
    src: gerenteAlmacenImg,
    alt: 'Gerente de almacén LogiTrack supervisando la organización y el inventario de paquetes en el centro de distribución',
    title: 'Gestión de almacenes',
    desc: 'Supervisión de inventario, control de capacidad y coordinación operativa en cada almacén.',
  },
  {
    src: logisticaRutaImg,
    alt: 'Vista aérea de rutas logísticas trazadas en un mapa para optimizar los tiempos de entrega y reducir costos',
    title: 'Planificación de rutas',
    desc: 'Diseño estratégico de rutas para minimizar tiempos de tránsito y maximizar la eficiencia.',
  },
  {
    src: serviciosLogisticaImg,
    alt: 'Equipo de LogiTrack coordinando servicios logísticos integrales de transporte, almacenamiento y distribución',
    title: 'Servicios integrales',
    desc: 'Transporte, almacenamiento, distribución y seguimiento en una sola plataforma unificada.',
  },
];

const CONTACT_INFO = [
  { icon: <EmailIcon sx={{ color: '#FFB74D' }} />, label: 'Correo', value: 'contacto@logitrack.bo' },
  { icon: <PhoneIcon sx={{ color: '#FFB74D' }} />, label: 'Teléfono', value: '+591 2 234 5678' },
  { icon: <LocationOnIcon sx={{ color: '#FFB74D' }} />, label: 'Dirección', value: 'Av. América #1234, Cochabamba, Bolivia' },
];

const LandingPage: React.FC = () => {
  const [form, setForm] = useState({ nombre: '', correo: '', mensaje: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState('');
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.correo.trim() || !form.mensaje.trim()) {
      setFormError('Por favor, completa todos los campos.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
      setFormError('Ingresa un correo electrónico válido.');
      return;
    }
    setFormError('');
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setForm({ nombre: '', correo: '', mensaje: '' });
    }, 1500);
  };

  return (
    <>
      <SEOHead
        title="Inicio"
        description="LogiTrack — Plataforma inteligente de gestión de envíos y logística. Rastrea paquetes, gestiona flotas y optimiza tus operaciones de entrega."
        ogTitle="LogiTrack | Plataforma de Envíos y Logística"
      />

      {/* Navbar */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#0D1B2A' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <LocalShippingIcon sx={{ color: '#F57C00' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
              LogiTrack
            </Typography>
          </Box>
          <Button component={Link} to="/login" variant="contained" color="secondary" sx={{ fontWeight: 600 }}>
            Iniciar Sesión
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero */}
      <Box
        component="header"
        sx={{
          background: 'linear-gradient(135deg, #0D1B2A 0%, #1565C0 60%, #0D47A1 100%)',
          color: '#fff',
          py: { xs: 10, md: 14 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, mb: 3 }}>
                <Chip label="Plataforma de Envíos y Logística" color="warning" sx={{ fontWeight: 600 }} />
              </Box>
              <Typography
                component="h1"
                variant="h2"
                sx={{
                  mb: 2,
                  fontWeight: 800,
                  fontSize: { xs: '2rem', md: '3.2rem' },
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                Logística inteligente,{' '}
                <Box component="span" sx={{ color: '#FFB74D' }}>
                  entrega rápida
                </Box>
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 5,
                  color: 'rgba(255,255,255,0.75)',
                  maxWidth: 520,
                  mx: { xs: 'auto', md: 0 },
                  fontWeight: 400,
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                Gestiona envíos, rastrea paquetes, controla tu flota y optimiza rutas.
                Todo desde una sola plataforma!
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' }, flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
                >
                  Comenzar
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  href="#caracteristicas"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: '#fff',
                    '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.08)' },
                  }}
                >
                  Ver más
                </Button>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={camionImg}
                alt="Camión de reparto LogiTrack transportando paquetes con seguimiento GPS en tiempo real sobre una ruta trazada"
                style={{ width: '100%', maxWidth: 520 }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Estadísticas */}
      <Box sx={{ bgcolor: '#F57C00', py: 3 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} sx={{ justifyContent: 'center', textAlign: 'center' }}>
            {STATS.map((stat) => (
              <Grid key={stat.label} size={{ xs: 6, sm: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                  {stat.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Tira fotográfica */}
      <Box component="section" sx={{ py: { xs: 6, md: 8 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {PHOTO_STRIP.map((item) => (
              <Grid key={item.caption} size={{ xs: 12, sm: 4 }}>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    height: 260,
                    cursor: 'pointer',
                    '&:hover img': { transform: 'scale(1.06)' },
                    '&:hover .photo-overlay': { background: 'linear-gradient(to top, rgba(13,27,42,0.97) 0%, rgba(13,27,42,0.2) 100%)' },
                  }}
                >
                  <Box
                    component="img"
                    src={item.src}
                    alt={item.alt}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                  />
                  <Box
                    className="photo-overlay"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(13,27,42,0.92) 0%, transparent 100%)',
                      px: 2.5,
                      py: 2,
                      transition: 'background 0.4s ease',
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ color: '#FFB74D', fontWeight: 700 }}>
                      {item.caption}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {item.sub}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Características */}
      <Box component="section" id="caracteristicas" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography variant="h3" sx={{ fontWeight: 700 }} color="primary">
              Todo lo que necesitas
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 1, fontWeight: 400 }}>
              Una plataforma completa para la gestión logística moderna
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {FEATURES.map((f) => (
              <Grid key={f.title} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={{ height: '100%', p: 1, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                  <CardContent>
                    <Box sx={{ mb: 2 }}>{f.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
                      {f.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {f.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Plataforma en acción */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <img
                src={panelImg}
                alt="Panel de control de LogiTrack mostrando tarjetas de estadísticas con total de envíos, clientes, paquetes y conductores, junto a una tabla de envíos recientes con sus estados"
                style={{ width: '100%', borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.12)', display: 'block' }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }} color="primary">
                Tu plataforma logística en acción
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: '1.05rem', lineHeight: 1.7 }}>
                Gestiona envíos, clientes, conductores y almacenes desde un panel centralizado.
                Métricas en tiempo real para tomar decisiones más rápidas con datos siempre actualizados.
              </Typography>
              <Button component={Link} to="/login" variant="contained" color="primary" size="large" sx={{ px: 4 }}>
                Acceder al sistema
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Operaciones y Equipo */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography variant="h3" sx={{ fontWeight: 700 }} color="primary">
              Operaciones de alto rendimiento
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 1, fontWeight: 400 }}>
              Desde el almacén hasta el cliente final, cubrimos cada eslabón de la cadena
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {OPS_CARDS.map((card) => (
              <Grid key={card.title} size={{ xs: 12, sm: 4 }}>
                <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                  <CardMedia component="img" height="220" image={card.src} alt={card.alt} sx={{ objectFit: 'cover' }} />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }} color="primary">
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Cómo funciona */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography variant="h3" sx={{ fontWeight: 700 }} color="primary">
              ¿Cómo funciona?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 1, fontWeight: 400 }}>
              Pasos simples para optimizar tus operaciones logísticas
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {STEPS.map((step) => (
              <Grid key={step.num} size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h2" sx={{ color: '#1565C0', mb: 1, fontSize: '3.5rem', fontWeight: 800 }}>
                    {step.num}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom color="primary">
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Contáctanos */}
      <Box
        component="section"
        id="contacto"
        sx={{ bgcolor: '#0D1B2A', py: { xs: 8, md: 12 }, color: '#fff' }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#fff' }}>
              Contáctanos
            </Typography>
            <Typography variant="h6" sx={{ mt: 1, fontWeight: 400, color: 'rgba(255,255,255,0.65)' }}>
              ¿Tienes alguna pregunta? <br />
              Escríbenos y te responderemos a la brevedad
            </Typography>
          </Box>

          <Grid container spacing={6} sx={{ alignItems: 'flex-start' }}>
            {/* Info de contacto */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#fff' }}>
                Información de contacto
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.65)', mb: 4, lineHeight: 1.8 }}>
                Estamos disponibles para ayudarte con cualquier consulta sobre nuestros
                servicios logísticos, integraciones o soporte técnico.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {CONTACT_INFO.map((item) => (
                  <Box key={item.label} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    {item.icon}
                    <Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
                        {item.label}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#fff', fontWeight: 500 }}>
                        {item.value}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Formulario */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Box
                component="form"
                onSubmit={handleSend}
                noValidate
                sx={{
                  bgcolor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  p: { xs: 3, md: 4 },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', mb: 3 }}>
                  Envíanos un mensaje
                </Typography>

                {formError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {formError}
                  </Alert>
                )}

                <Grid container spacing={2}>
                  <Grid size={12}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5, display: 'block' }}>
                      Nombre completo *
                    </Typography>
                    <TextField
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      placeholder="Ej: Juan Pérez"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                          '&.Mui-focused fieldset': { borderColor: '#F57C00' },
                        },
                        '& input::placeholder': { color: 'rgba(255,255,255,0.35)' },
                      }}
                    />
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5, display: 'block' }}>
                      Correo electrónico *
                    </Typography>
                    <TextField
                      name="correo"
                      value={form.correo}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      type="email"
                      placeholder="Ej: juan@empresa.com"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                          '&.Mui-focused fieldset': { borderColor: '#F57C00' },
                        },
                        '& input::placeholder': { color: 'rgba(255,255,255,0.35)' },
                      }}
                    />
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5, display: 'block' }}>
                      Mensaje *
                    </Typography>
                    <TextField
                      name="mensaje"
                      value={form.mensaje}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Escribe tu consulta aquí..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                          '&.Mui-focused fieldset': { borderColor: '#F57C00' },
                        },
                        '& textarea::placeholder': { color: 'rgba(255,255,255,0.35)' },
                      }}
                    />
                  </Grid>
                  <Grid size={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                      size="large"
                      fullWidth
                      disabled={sending}
                      sx={{ py: 1.5, fontSize: '1rem', fontWeight: 700 }}
                    >
                      {sending ? 'Enviando...' : 'Enviar mensaje'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{ bgcolor: '#060d14', py: 3, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} LogiTrack - Sistema de Gestión de Envíos y Logística
        </Typography>
      </Box>

      {/* Botón scroll to top */}
      <Zoom in={showScroll}>
        <Fab
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          size="medium"
          color="primary"
          aria-label="volver arriba"
          sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1200 }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>

      {/* Snackbar éxito */}
      <Snackbar
        open={sent}
        autoHideDuration={5000}
        onClose={() => setSent(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSent(false)} sx={{ width: '100%' }}>
          ¡Mensaje enviado! Te responderemos pronto.
        </Alert>
      </Snackbar>
    </>
  );
};

export default LandingPage;

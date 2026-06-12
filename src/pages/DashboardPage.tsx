import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../hooks/useAuth';
import SEOHead from '../components/seo/SEOHead';
import StatusChip from '../components/common/StatusChip';
import { getShipments } from '../services/shipmentService';
import { getCustomers } from '../services/customerService';
import { getPackages } from '../services/packageService';
import { getDrivers } from '../services/driverService';
import type { ShipmentDto } from '../types/shipment.types';

interface StatCard {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ shipments: 0, customers: 0, packages: 0, drivers: 0 });
  const [recentShipments, setRecentShipments] = useState<ShipmentDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [s, c, p, d] = await Promise.allSettled([
          getShipments({ pageNumber: 1, pageSize: 5 }),
          getCustomers({ pageNumber: 1, pageSize: 1 }),
          getPackages({ pageNumber: 1, pageSize: 1 }),
          getDrivers({ pageNumber: 1, pageSize: 1 }),
        ]);

        if (s.status === 'fulfilled') {
          setRecentShipments(s.value.data ?? []);
          setStats((prev) => ({
            ...prev,
            shipments: s.value.pagination?.totalCount ?? s.value.data?.length ?? 0,
          }));
        }
        if (c.status === 'fulfilled') {
          setStats((prev) => ({
            ...prev,
            customers: c.value.pagination?.totalCount ?? c.value.data?.length ?? 0,
          }));
        }
        if (p.status === 'fulfilled') {
          setStats((prev) => ({
            ...prev,
            packages: p.value.pagination?.totalCount ?? p.value.data?.length ?? 0,
          }));
        }
        if (d.status === 'fulfilled') {
          setStats((prev) => ({
            ...prev,
            drivers: d.value.pagination?.totalCount ?? d.value.data?.length ?? 0,
          }));
        }
      } catch {
        setError('No se pudo conectar a la API. Verifica que el backend esté activo.');
      }
    };
    fetchStats();
  }, []);

  const statCards: StatCard[] = [
    { title: 'Total de envíos', value: stats.shipments, icon: <LocalShippingIcon />, color: '#1565C0', bg: '#E3ECF8' },
    { title: 'Total de clientes', value: stats.customers, icon: <PeopleIcon />, color: '#2e7d32', bg: '#E8F5E9' },
    { title: 'Total de paquetes', value: stats.packages, icon: <InventoryIcon />, color: '#F57C00', bg: '#FFF3E0' },
    { title: 'Conductores activos', value: stats.drivers, icon: <PersonIcon />, color: '#6a1b9a', bg: '#F3E5F5' },
  ];

  return (
    <>
      <SEOHead
        title="Panel"
        description="Panel de operaciones de LogiTrack - resumen de envíos, clientes y flota."
      />

      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }} color="primary">
            Bienvenido, {user?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Resumen de tus operaciones logísticas
          </Typography>
        </Box>

        {error && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statCards.map((card) => (
            <Grid key={card.title} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {card.title}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: card.color }}>
                        {card.value}
                      </Typography>
                    </Box>
                    <Box sx={{ bgcolor: card.bg, color: card.color, borderRadius: 2, p: 1.5, display: 'flex' }}>
                      {card.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom color="primary">
              Envíos recientes
            </Typography>
            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>N° Seguimiento</TableCell>
                    <TableCell>ID Cliente</TableCell>
                    <TableCell>ID Ruta</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Fecha de Envío</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentShipments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        Sin envíos registrados
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentShipments.map((s) => (
                      <TableRow key={s.id} hover>
                        <TableCell>#{s.id}</TableCell>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{s.trackingNumber}</TableCell>
                        <TableCell>#{s.customerId}</TableCell>
                        <TableCell>#{s.routeId}</TableCell>
                        <TableCell><StatusChip label={s.state} /></TableCell>
                        <TableCell>
                          {s.shippingDate ? new Date(s.shippingDate).toLocaleDateString('es-BO') : '—'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default DashboardPage;

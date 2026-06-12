import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Alert, Snackbar, Tooltip, Grid, Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SEOHead from '../../components/seo/SEOHead';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { getRoutes, createRoute, updateRoute, deleteRoute } from '../../services/routeService';
import type { RouteDto } from '../../types/route.types';

const routeSchema = z.object({
  origin: z.string().min(2, 'El origen es requerido'),
  destination: z.string().min(2, 'El destino es requerido'),
  distanceKm: z.coerce.number().positive('La distancia debe ser mayor a 0'),
  baseCost: z.coerce.number().positive('El costo base debe ser mayor a 0'),
  isActive: z.boolean().optional(),
});

type RouteForm = z.infer<typeof routeSchema>;
const PAGE_SIZE = 10;

const RoutesPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [routes, setRoutes] = useState<RouteDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<RouteDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RouteForm>({
    resolver: zodResolver(routeSchema) as unknown as Resolver<RouteForm>,
    defaultValues: { isActive: true },
  });

  const fetchRoutes = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await getRoutes({ pageNumber: page + 1, pageSize: PAGE_SIZE });
      setRoutes(res.data ?? []);
      setTotalCount(res.pagination?.totalCount ?? res.data?.length ?? 0);
    } catch { setFetchError('No se pudieron cargar las rutas. Verifica tu conexión.'); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchRoutes(); }, [fetchRoutes]);

  const openCreate = () => {
    setEditItem(null);
    reset({ origin: '', destination: '', distanceKm: 0, baseCost: 0, isActive: true });
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (item: RouteDto) => {
    setEditItem(item);
    reset({ origin: item.origin, destination: item.destination, distanceKm: item.distanceKm, baseCost: item.baseCost, isActive: item.isActive });
    setFormError(null);
    setFormOpen(true);
  };

  const onSubmit = async (data: RouteForm) => {
    setSubmitLoading(true);
    setFormError(null);
    try {
      if (editItem) {
        await updateRoute(editItem.id, data);
        setSuccessMsg(`Ruta "${data.origin} → ${data.destination}" actualizada correctamente.`);
      } else {
        await createRoute(data);
        setSuccessMsg(`Ruta "${data.origin} → ${data.destination}" registrada correctamente.`);
      }
      setFormOpen(false);
      fetchRoutes();
    } catch { setFormError('Operación fallida. Verifica los datos e intenta nuevamente.'); }
    finally { setSubmitLoading(false); }
  };

  const handleDelete = async () => {
    if (deleteTarget === null) return;
    try {
      await deleteRoute(deleteTarget);
      setSuccessMsg(`Ruta #${deleteTarget} eliminada correctamente.`);
      setDeleteTarget(null);
      fetchRoutes();
    } catch { setFetchError('No se pudo eliminar la ruta.'); setDeleteTarget(null); }
  };

  return (
    <>
      <SEOHead title="Rutas" description="Gestiona las rutas de entrega en LogiTrack." />
      <PageHeader title="Rutas" subtitle="Planifica y administra las rutas de entrega" showAdd={isAdmin} onAdd={openCreate} addLabel="Nueva Ruta" />
      {fetchError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFetchError(null)}>{fetchError}</Alert>}
      <Card>
        {loading ? <LoadingSpinner /> : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Origen</TableCell>
                  <TableCell>Destino</TableCell>
                  <TableCell>Distancia (km)</TableCell>
                  <TableCell>Costo Base</TableCell>
                  <TableCell>Estado</TableCell>
                  {isAdmin && <TableCell align="right">Acciones</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {routes.length === 0 ? (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 5, color: 'text.secondary' }}>No se encontraron rutas</TableCell></TableRow>
                ) : routes.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell>#{r.id}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{r.origin}</TableCell>
                    <TableCell>{r.destination}</TableCell>
                    <TableCell>{r.distanceKm} km</TableCell>
                    <TableCell>${r.baseCost.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip label={r.isActive ? 'Activa' : 'Inactiva'} size="small" color={r.isActive ? 'success' : 'default'} />
                    </TableCell>
                    {isAdmin && (
                      <TableCell align="right">
                        <Tooltip title="Editar ruta"><IconButton size="small" color="primary" onClick={() => openEdit(r)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Eliminar ruta"><IconButton size="small" color="error" onClick={() => setDeleteTarget(r.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <TablePagination component="div" count={totalCount} page={page} rowsPerPage={PAGE_SIZE} rowsPerPageOptions={[PAGE_SIZE]} onPageChange={(_, p) => setPage(p)} />
      </Card>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editItem ? `Editar Ruta #${editItem.id}` : 'Registrar Nueva Ruta'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogContent>
            {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
            <Grid container spacing={2}>
              <Grid size={6}>
                <label htmlFor="origin" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Origen *</label>
                <TextField id="origin" {...register('origin')} fullWidth size="small" placeholder="Ej: La Paz" error={!!errors.origin} helperText={errors.origin?.message} />
              </Grid>
              <Grid size={6}>
                <label htmlFor="dest" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Destino *</label>
                <TextField id="dest" {...register('destination')} fullWidth size="small" placeholder="Ej: Santa Cruz" error={!!errors.destination} helperText={errors.destination?.message} />
              </Grid>
              <Grid size={6}>
                <label htmlFor="distance" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Distancia (km) *</label>
                <TextField id="distance" {...register('distanceKm')} fullWidth size="small" type="number" slotProps={{ htmlInput: { min: 0, step: 0.1 } }} error={!!errors.distanceKm} helperText={errors.distanceKm?.message} />
              </Grid>
              <Grid size={6}>
                <label htmlFor="baseCost" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Costo Base ($) *</label>
                <TextField id="baseCost" {...register('baseCost')} fullWidth size="small" type="number" slotProps={{ htmlInput: { min: 0, step: 0.01 } }} error={!!errors.baseCost} helperText={errors.baseCost?.message} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setFormOpen(false)} disabled={submitLoading}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={submitLoading}>
              {submitLoading ? 'Guardando...' : editItem ? 'Actualizar Ruta' : 'Registrar Ruta'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        message={`¿Eliminar la ruta #${deleteTarget}? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <Snackbar open={!!successMsg} autoHideDuration={5000} onClose={() => setSuccessMsg(null)} message={successMsg} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />
    </>
  );
};

export default RoutesPage;

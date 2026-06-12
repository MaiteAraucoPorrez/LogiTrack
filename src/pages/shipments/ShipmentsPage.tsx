import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Alert, Snackbar, Tooltip, FormControl, InputLabel,
  Select, MenuItem, FormHelperText, Grid, Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm, Controller, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SEOHead from '../../components/seo/SEOHead';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { getShipments, createShipment, updateShipment, deleteShipment } from '../../services/shipmentService';
import type { ShipmentDto } from '../../types/shipment.types';
import { SHIPMENT_STATES } from '../../types/shipment.types';

const STATE_COLORS: Record<string, 'default' | 'warning' | 'info' | 'success'> = {
  Pending: 'warning',
  'In transit': 'info',
  Delivered: 'success',
};

const STATE_LABELS: Record<string, string> = {
  Pending: 'Pendiente',
  'In transit': 'En Tránsito',
  Delivered: 'Entregado',
};

const shipmentSchema = z.object({
  shippingDate: z.string().min(1, 'La fecha de envío es requerida'),
  state: z.string().min(1, 'El estado es requerido'),
  customerId: z.coerce.number().int().positive('El ID del cliente es requerido'),
  routeId: z.coerce.number().int().positive('El ID de la ruta es requerido'),
  totalCost: z.coerce.number().positive('El costo total debe ser mayor a 0'),
  trackingNumber: z.string().min(3, 'El N° de seguimiento debe tener al menos 3 caracteres').max(50),
});

type ShipmentForm = z.infer<typeof shipmentSchema>;
const PAGE_SIZE = 10;

const ShipmentsPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [shipments, setShipments] = useState<ShipmentDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<ShipmentDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<ShipmentForm>({
    resolver: zodResolver(shipmentSchema) as unknown as Resolver<ShipmentForm>,
    defaultValues: { state: 'Pending' },
  });

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await getShipments({ pageNumber: page + 1, pageSize: PAGE_SIZE });
      setShipments(res.data ?? []);
      setTotalCount(res.pagination?.totalCount ?? res.data?.length ?? 0);
    } catch {
      setFetchError('No se pudieron cargar los envíos. Verifica que la API esté activa.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchShipments(); }, [fetchShipments]);

  const openCreate = () => {
    setEditItem(null);
    reset({ shippingDate: new Date().toISOString().split('T')[0], state: 'Pending', customerId: 0, routeId: 0, totalCost: 0, trackingNumber: '' });
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (item: ShipmentDto) => {
    setEditItem(item);
    reset({
      shippingDate: item.shippingDate ? item.shippingDate.split('T')[0] : '',
      state: item.state,
      customerId: item.customerId,
      routeId: item.routeId,
      totalCost: item.totalCost,
      trackingNumber: item.trackingNumber,
    });
    setFormError(null);
    setFormOpen(true);
  };

  const onSubmit = async (data: ShipmentForm) => {
    setSubmitLoading(true);
    setFormError(null);
    try {
      if (editItem) {
        await updateShipment(editItem.id, data);
        setSuccessMsg(`Envío #${editItem.id} actualizado correctamente.`);
      } else {
        await createShipment(data);
        setSuccessMsg('Nuevo envío registrado correctamente.');
      }
      setFormOpen(false);
      fetchShipments();
    } catch {
      setFormError('Operación fallida. Verifica los datos e intenta nuevamente.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    if (deleteTarget === null) return;
    try {
      await deleteShipment(deleteTarget);
      setSuccessMsg(`Envío #${deleteTarget} eliminado correctamente.`);
      setDeleteTarget(null);
      fetchShipments();
    } catch {
      setFetchError('No se pudo eliminar el envío.');
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <SEOHead title="Envíos" description="Gestiona todos los envíos en LogiTrack." />
      <PageHeader title="Envíos" subtitle="Gestiona todas las operaciones de envío" showAdd={isAdmin} onAdd={openCreate} addLabel="Nuevo Envío" />
      {fetchError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFetchError(null)}>{fetchError}</Alert>}
      <Card>
        {loading ? <LoadingSpinner /> : (
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>N° Seguimiento</TableCell>
                  <TableCell>Fecha de Envío</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>ID Cliente</TableCell>
                  <TableCell>ID Ruta</TableCell>
                  <TableCell>Costo Total</TableCell>
                  {isAdmin && <TableCell align="right">Acciones</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {shipments.length === 0 ? (
                  <TableRow><TableCell colSpan={8} align="center" sx={{ py: 5, color: 'text.secondary' }}>No se encontraron envíos</TableCell></TableRow>
                ) : shipments.map((s) => (
                  <TableRow key={s.id} hover>
                    <TableCell>#{s.id}</TableCell>
                    <TableCell sx={{ fontWeight: 500, fontFamily: 'monospace' }}>{s.trackingNumber}</TableCell>
                    <TableCell>{s.shippingDate ? new Date(s.shippingDate).toLocaleDateString('es-BO') : '—'}</TableCell>
                    <TableCell>
                      <Chip label={STATE_LABELS[s.state] ?? s.state} size="small" color={STATE_COLORS[s.state] ?? 'default'} />
                    </TableCell>
                    <TableCell>#{s.customerId}</TableCell>
                    <TableCell>#{s.routeId}</TableCell>
                    <TableCell>${s.totalCost.toFixed(2)}</TableCell>
                    {isAdmin && (
                      <TableCell align="right">
                        <Tooltip title="Editar envío"><IconButton size="small" color="primary" onClick={() => openEdit(s)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Eliminar envío"><IconButton size="small" color="error" onClick={() => setDeleteTarget(s.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
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
        <DialogTitle>{editItem ? `Editar Envío #${editItem.id}` : 'Registrar Nuevo Envío'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogContent>
            {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <label htmlFor="trackingNumber" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>N° de Seguimiento *</label>
                <TextField id="trackingNumber" {...register('trackingNumber')} fullWidth size="small" placeholder="Ej: TRK-001" error={!!errors.trackingNumber} helperText={errors.trackingNumber?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <label htmlFor="shippingDate" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Fecha de Envío *</label>
                <TextField id="shippingDate" {...register('shippingDate')} fullWidth size="small" type="date" error={!!errors.shippingDate} helperText={errors.shippingDate?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <label htmlFor="scustomerId" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>ID del Cliente *</label>
                <TextField id="scustomerId" {...register('customerId')} fullWidth size="small" type="number" error={!!errors.customerId} helperText={errors.customerId?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <label htmlFor="srouteId" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>ID de la Ruta *</label>
                <TextField id="srouteId" {...register('routeId')} fullWidth size="small" type="number" error={!!errors.routeId} helperText={errors.routeId?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <label htmlFor="stotalCost" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Costo Total ($) *</label>
                <TextField id="stotalCost" {...register('totalCost')} fullWidth size="small" type="number" slotProps={{ htmlInput: { min: 0, step: 0.01 } }} error={!!errors.totalCost} helperText={errors.totalCost?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small" error={!!errors.state}>
                  <InputLabel id="sstate-label">Estado *</InputLabel>
                  <Controller name="state" control={control} render={({ field }) => (
                    <Select {...field} labelId="sstate-label" label="Estado *">
                      {SHIPMENT_STATES.map((s) => (
                        <MenuItem key={s} value={s}>{STATE_LABELS[s] ?? s}</MenuItem>
                      ))}
                    </Select>
                  )} />
                  {errors.state && <FormHelperText>{errors.state.message}</FormHelperText>}
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setFormOpen(false)} disabled={submitLoading}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={submitLoading}>
              {submitLoading ? 'Guardando...' : editItem ? 'Actualizar Envío' : 'Registrar Envío'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        message={`¿Eliminar el envío #${deleteTarget}? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <Snackbar open={!!successMsg} autoHideDuration={5000} onClose={() => setSuccessMsg(null)} message={successMsg} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />
    </>
  );
};

export default ShipmentsPage;

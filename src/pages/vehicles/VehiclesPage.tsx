import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Alert, Snackbar, Tooltip, Grid, FormControl, InputLabel,
  Select, MenuItem, FormHelperText,
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
import StatusChip from '../../components/common/StatusChip';
import { useAuth } from '../../hooks/useAuth';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '../../services/vehicleService';
import type { VehicleDto } from '../../types/vehicle.types';
import { VEHICLE_TYPE_VALUES, VEHICLE_STATUS_VALUES, VEHICLE_STATUS_LABELS } from '../../types/vehicle.types';

const vehicleSchema = z.object({
  plateNumber: z.string().min(4, 'La placa debe tener al menos 4 caracteres'),
  type: z.string().min(1, 'El tipo de vehículo es requerido'),
  maxWeightCapacityKg: z.coerce.number().positive('La capacidad de peso debe ser mayor a 0'),
  maxVolumeCapacityM3: z.coerce.number().positive('La capacidad de volumen debe ser mayor a 0'),
  status: z.string().min(1, 'El estado es requerido'),
  vin: z.string().optional(),
});

type VehicleForm = z.infer<typeof vehicleSchema>;
const PAGE_SIZE = 10;

const VehiclesPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [vehicles, setVehicles] = useState<VehicleDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<VehicleDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<VehicleForm>({
    resolver: zodResolver(vehicleSchema) as unknown as Resolver<VehicleForm>,
    defaultValues: { type: 'Van', status: 'Available' },
  });

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await getVehicles({ pageNumber: page + 1, pageSize: PAGE_SIZE });
      setVehicles(res.data ?? []);
      setTotalCount(res.pagination?.totalCount ?? res.data?.length ?? 0);
    } catch { setFetchError('No se pudieron cargar los vehículos. Verifica tu conexión.'); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  const openCreate = () => {
    setEditItem(null);
    reset({ plateNumber: '', type: 'Van', maxWeightCapacityKg: 0, maxVolumeCapacityM3: 0, status: 'Available', vin: '' });
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (item: VehicleDto) => {
    setEditItem(item);
    reset({
      plateNumber: item.plateNumber,
      type: item.type,
      maxWeightCapacityKg: item.maxWeightCapacityKg,
      maxVolumeCapacityM3: item.maxVolumeCapacityM3,
      status: item.status,
      vin: item.vin ?? '',
    });
    setFormError(null);
    setFormOpen(true);
  };

  const onSubmit = async (data: VehicleForm) => {
    setSubmitLoading(true);
    setFormError(null);
    try {
      if (editItem) {
        await updateVehicle(editItem.id, data);
        setSuccessMsg(`Vehículo "${data.plateNumber}" actualizado correctamente.`);
      } else {
        await createVehicle(data);
        setSuccessMsg(`Vehículo "${data.plateNumber}" registrado correctamente.`);
      }
      setFormOpen(false);
      fetchVehicles();
    } catch { setFormError('Operación fallida. Verifica los datos e intenta nuevamente.'); }
    finally { setSubmitLoading(false); }
  };

  const handleDelete = async () => {
    if (deleteTarget === null) return;
    try {
      await deleteVehicle(deleteTarget);
      setSuccessMsg(`Vehículo #${deleteTarget} eliminado correctamente.`);
      setDeleteTarget(null);
      fetchVehicles();
    } catch {
      setFetchError('No se pudo eliminar el vehículo.');
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <SEOHead title="Vehículos" description="Gestiona la flota de vehículos en LogiTrack." />
      <PageHeader title="Vehículos" subtitle="Administra tu flota de entrega" showAdd={isAdmin} onAdd={openCreate} addLabel="Nuevo Vehículo" />
      {fetchError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFetchError(null)}>{fetchError}</Alert>}
      <Card>
        {loading ? <LoadingSpinner /> : (
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Placa</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Cap. Peso (kg)</TableCell>
                  <TableCell>Cap. Volumen (m³)</TableCell>
                  <TableCell>Estado</TableCell>
                  {isAdmin && <TableCell align="right">Acciones</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicles.length === 0 ? (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 5, color: 'text.secondary' }}>No se encontraron vehículos</TableCell></TableRow>
                ) : vehicles.map((v) => (
                  <TableRow key={v.id} hover>
                    <TableCell>#{v.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{v.plateNumber}</TableCell>
                    <TableCell>{v.type}</TableCell>
                    <TableCell>{v.maxWeightCapacityKg} kg</TableCell>
                    <TableCell>{v.maxVolumeCapacityM3} m³</TableCell>
                    <TableCell><StatusChip label={VEHICLE_STATUS_LABELS[v.status] ?? v.status} /></TableCell>
                    {isAdmin && (
                      <TableCell align="right">
                        <Tooltip title="Editar vehículo"><IconButton size="small" color="primary" onClick={() => openEdit(v)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Eliminar vehículo"><IconButton size="small" color="error" onClick={() => setDeleteTarget(v.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
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
        <DialogTitle>{editItem ? `Editar Vehículo #${editItem.id}` : 'Registrar Nuevo Vehículo'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogContent>
            {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <label htmlFor="plate" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Placa *</label>
                <TextField id="plate" {...register('plateNumber')} fullWidth size="small" placeholder="Ej: ABC-1234" error={!!errors.plateNumber} helperText={errors.plateNumber?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <label htmlFor="vin" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>VIN</label>
                <TextField id="vin" {...register('vin')} fullWidth size="small" placeholder="Opcional" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small" error={!!errors.type}>
                  <InputLabel id="vtype-label">Tipo *</InputLabel>
                  <Controller name="type" control={control} render={({ field }) => (
                    <Select {...field} labelId="vtype-label" label="Tipo *">
                      {VEHICLE_TYPE_VALUES.map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                    </Select>
                  )} />
                  {errors.type && <FormHelperText>{errors.type.message}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small" error={!!errors.status}>
                  <InputLabel id="vstatus-label">Estado *</InputLabel>
                  <Controller name="status" control={control} render={({ field }) => (
                    <Select {...field} labelId="vstatus-label" label="Estado *">
                      {VEHICLE_STATUS_VALUES.map((v) => <MenuItem key={v} value={v}>{VEHICLE_STATUS_LABELS[v]}</MenuItem>)}
                    </Select>
                  )} />
                  {errors.status && <FormHelperText>{errors.status.message}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <label htmlFor="maxWeight" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Cap. Máxima de Peso (kg) *</label>
                <TextField id="maxWeight" {...register('maxWeightCapacityKg')} fullWidth size="small" type="number" slotProps={{ htmlInput: { min: 0, step: 0.1 } }} error={!!errors.maxWeightCapacityKg} helperText={errors.maxWeightCapacityKg?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <label htmlFor="maxVol" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Cap. Máxima de Volumen (m³) *</label>
                <TextField id="maxVol" {...register('maxVolumeCapacityM3')} fullWidth size="small" type="number" slotProps={{ htmlInput: { min: 0, step: 0.1 } }} error={!!errors.maxVolumeCapacityM3} helperText={errors.maxVolumeCapacityM3?.message} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setFormOpen(false)} disabled={submitLoading}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={submitLoading}>
              {submitLoading ? 'Guardando...' : editItem ? 'Actualizar Vehículo' : 'Registrar Vehículo'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        message={`¿Eliminar el vehículo #${deleteTarget}? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <Snackbar open={!!successMsg} autoHideDuration={5000} onClose={() => setSuccessMsg(null)} message={successMsg} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />
    </>
  );
};

export default VehiclesPage;

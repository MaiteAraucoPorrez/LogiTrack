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
import { getDrivers, createDriver, updateDriver, deleteDriver } from '../../services/driverService';
import type { DriverDto } from '../../types/driver.types';
import { DRIVER_STATUS_VALUES, DRIVER_STATUS_LABELS } from '../../types/driver.types';

const driverSchema = z.object({
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  licenseNumber: z.string().min(4, 'El N° de licencia debe tener al menos 4 caracteres'),
  phone: z.string().min(7, 'El teléfono debe tener al menos 7 caracteres'),
  email: z.string().email('Ingresa un correo electrónico válido'),
  dateOfBirth: z.string().min(1, 'La fecha de nacimiento es requerida'),
  status: z.string().min(1, 'El estado es requerido'),
  address: z.string().optional(),
  city: z.string().optional(),
});

type DriverForm = z.infer<typeof driverSchema>;
const PAGE_SIZE = 10;

const DriversPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [drivers, setDrivers] = useState<DriverDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<DriverDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<DriverForm>({
    resolver: zodResolver(driverSchema) as unknown as Resolver<DriverForm>,
    defaultValues: { status: 'Available' },
  });

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await getDrivers({ pageNumber: page + 1, pageSize: PAGE_SIZE });
      setDrivers(res.data ?? []);
      setTotalCount(res.pagination?.totalCount ?? res.data?.length ?? 0);
    } catch { setFetchError('No se pudieron cargar los conductores. Verifica tu conexión.'); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchDrivers(); }, [fetchDrivers]);

  const openCreate = () => {
    setEditItem(null);
    reset({ fullName: '', licenseNumber: '', phone: '', email: '', dateOfBirth: '', status: 'Available', address: '', city: '' });
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (item: DriverDto) => {
    setEditItem(item);
    reset({
      fullName: item.fullName,
      licenseNumber: item.licenseNumber,
      phone: item.phone,
      email: item.email,
      dateOfBirth: item.dateOfBirth ? item.dateOfBirth.split('T')[0] : '',
      status: item.status,
      address: item.address ?? '',
      city: item.city ?? '',
    });
    setFormError(null);
    setFormOpen(true);
  };

  const onSubmit = async (data: DriverForm) => {
    setSubmitLoading(true);
    setFormError(null);
    try {
      if (editItem) {
        await updateDriver(editItem.id, data);
        setSuccessMsg(`Conductor "${data.fullName}" actualizado correctamente.`);
      } else {
        await createDriver(data);
        setSuccessMsg(`Conductor "${data.fullName}" registrado correctamente.`);
      }
      setFormOpen(false);
      fetchDrivers();
    } catch { setFormError('Operación fallida. Verifica los datos e intenta nuevamente.'); }
    finally { setSubmitLoading(false); }
  };

  const handleDelete = async () => {
    if (deleteTarget === null) return;
    try {
      await deleteDriver(deleteTarget);
      setSuccessMsg(`Conductor #${deleteTarget} eliminado correctamente.`);
      setDeleteTarget(null);
      fetchDrivers();
    } catch {
      setFetchError('No se pudo eliminar el conductor.');
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <SEOHead title="Conductores" description="Gestiona los conductores en LogiTrack." />
      <PageHeader title="Conductores" subtitle="Administra tu equipo de conductores" showAdd={isAdmin} onAdd={openCreate} addLabel="Nuevo Conductor" />
      {fetchError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFetchError(null)}>{fetchError}</Alert>}
      <Card>
        {loading ? <LoadingSpinner /> : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre Completo</TableCell>
                  <TableCell>N° Licencia</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Correo</TableCell>
                  <TableCell>Estado</TableCell>
                  {isAdmin && <TableCell align="right">Acciones</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {drivers.length === 0 ? (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 5, color: 'text.secondary' }}>No se encontraron conductores</TableCell></TableRow>
                ) : drivers.map((d) => (
                  <TableRow key={d.id} hover>
                    <TableCell>#{d.id}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{d.fullName}</TableCell>
                    <TableCell>{d.licenseNumber}</TableCell>
                    <TableCell>{d.phone}</TableCell>
                    <TableCell>{d.email}</TableCell>
                    <TableCell><StatusChip label={DRIVER_STATUS_LABELS[d.status] ?? d.status} /></TableCell>
                    {isAdmin && (
                      <TableCell align="right">
                        <Tooltip title="Editar conductor"><IconButton size="small" color="primary" onClick={() => openEdit(d)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Eliminar conductor"><IconButton size="small" color="error" onClick={() => setDeleteTarget(d.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
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
        <DialogTitle>{editItem ? `Editar Conductor #${editItem.id}` : 'Registrar Nuevo Conductor'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogContent>
            {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
            <Grid container spacing={2}>
              <Grid size={12}>
                <label htmlFor="dname" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Nombre Completo *</label>
                <TextField id="dname" {...register('fullName')} fullWidth size="small" placeholder="Ej: Carlos Mamani" error={!!errors.fullName} helperText={errors.fullName?.message} />
              </Grid>
              <Grid size={6}>
                <label htmlFor="license" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>N° de Licencia *</label>
                <TextField id="license" {...register('licenseNumber')} fullWidth size="small" placeholder="Ej: LC-12345" error={!!errors.licenseNumber} helperText={errors.licenseNumber?.message} />
              </Grid>
              <Grid size={6}>
                <label htmlFor="dphone" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Teléfono *</label>
                <TextField id="dphone" {...register('phone')} fullWidth size="small" placeholder="Ej: 72345678" error={!!errors.phone} helperText={errors.phone?.message} />
              </Grid>
              <Grid size={6}>
                <label htmlFor="demail" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Correo Electrónico *</label>
                <TextField id="demail" {...register('email')} fullWidth size="small" type="email" placeholder="Ej: carlos@logitrack.com" error={!!errors.email} helperText={errors.email?.message} />
              </Grid>
              <Grid size={6}>
                <label htmlFor="dob" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Fecha de Nacimiento *</label>
                <TextField id="dob" {...register('dateOfBirth')} fullWidth size="small" type="date" error={!!errors.dateOfBirth} helperText={errors.dateOfBirth?.message} />
              </Grid>
              <Grid size={6}>
                <label htmlFor="dcity" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Ciudad</label>
                <TextField id="dcity" {...register('city')} fullWidth size="small" placeholder="Ej: La Paz (opcional)" />
              </Grid>
              <Grid size={6}>
                <FormControl fullWidth size="small" error={!!errors.status}>
                  <InputLabel id="dstatus-label">Estado *</InputLabel>
                  <Controller name="status" control={control} render={({ field }) => (
                    <Select {...field} labelId="dstatus-label" label="Estado *">
                      {DRIVER_STATUS_VALUES.map((v) => <MenuItem key={v} value={v}>{DRIVER_STATUS_LABELS[v]}</MenuItem>)}
                    </Select>
                  )} />
                  {errors.status && <FormHelperText>{errors.status.message}</FormHelperText>}
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setFormOpen(false)} disabled={submitLoading}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={submitLoading}>
              {submitLoading ? 'Guardando...' : editItem ? 'Actualizar Conductor' : 'Registrar Conductor'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        message={`¿Eliminar el conductor #${deleteTarget}? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <Snackbar open={!!successMsg} autoHideDuration={5000} onClose={() => setSuccessMsg(null)} message={successMsg} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />
    </>
  );
};

export default DriversPage;

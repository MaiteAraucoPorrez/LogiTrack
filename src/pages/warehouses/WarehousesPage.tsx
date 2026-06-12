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
import { useAuth } from '../../hooks/useAuth';
import { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse } from '../../services/warehouseService';
import type { WarehouseDto } from '../../types/warehouse.types';
import { WAREHOUSE_TYPE_VALUES } from '../../types/warehouse.types';

const warehouseSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  code: z.string().min(2, 'El código es requerido'),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  city: z.string().min(2, 'La ciudad es requerida'),
  department: z.string().min(2, 'El departamento es requerido'),
  phone: z.string().min(7, 'El teléfono es requerido'),
  maxCapacityM3: z.coerce.number().positive('La capacidad debe ser mayor a 0'),
  type: z.string().min(1, 'El tipo es requerido'),
  email: z.string().email('Ingresa un correo electrónico válido').optional().or(z.literal('')),
  managerName: z.string().optional(),
  operatingHours: z.string().optional(),
});

type WarehouseForm = z.infer<typeof warehouseSchema>;
const PAGE_SIZE = 10;

const WarehousesPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [warehouses, setWarehouses] = useState<WarehouseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<WarehouseDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<WarehouseForm>({
    resolver: zodResolver(warehouseSchema) as unknown as Resolver<WarehouseForm>,
    defaultValues: { type: 'Regional' },
  });

  const fetchWarehouses = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await getWarehouses({ pageNumber: page + 1, pageSize: PAGE_SIZE });
      setWarehouses(res.data ?? []);
      setTotalCount(res.pagination?.totalCount ?? res.data?.length ?? 0);
    } catch { setFetchError('No se pudieron cargar los almacenes. Verifica tu conexión.'); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchWarehouses(); }, [fetchWarehouses]);

  const openCreate = () => {
    setEditItem(null);
    reset({ name: '', code: '', address: '', city: '', department: '', phone: '', maxCapacityM3: 0, type: 'Regional', email: '', managerName: '', operatingHours: '' });
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (item: WarehouseDto) => {
    setEditItem(item);
    reset({
      name: item.name,
      code: item.code,
      address: item.address,
      city: item.city,
      department: item.department,
      phone: item.phone,
      maxCapacityM3: item.maxCapacityM3,
      type: item.type,
      email: item.email ?? '',
      managerName: item.managerName ?? '',
      operatingHours: item.operatingHours ?? '',
    });
    setFormError(null);
    setFormOpen(true);
  };

  const onSubmit = async (data: WarehouseForm) => {
    setSubmitLoading(true);
    setFormError(null);
    try {
      const payload = { ...data, email: data.email || undefined };
      if (editItem) {
        await updateWarehouse(editItem.id, payload);
        setSuccessMsg(`Almacén "${data.name}" actualizado correctamente.`);
      } else {
        await createWarehouse(payload);
        setSuccessMsg(`Almacén "${data.name}" registrado correctamente.`);
      }
      setFormOpen(false);
      fetchWarehouses();
    } catch { setFormError('Operación fallida. Verifica los datos e intenta nuevamente.'); }
    finally { setSubmitLoading(false); }
  };

  const handleDelete = async () => {
    if (deleteTarget === null) return;
    try {
      await deleteWarehouse(deleteTarget);
      setSuccessMsg(`Almacén #${deleteTarget} eliminado correctamente.`);
      setDeleteTarget(null);
      fetchWarehouses();
    } catch { setFetchError('No se pudo eliminar el almacén.'); setDeleteTarget(null); }
  };

  return (
    <>
      <SEOHead title="Almacenes" description="Gestiona los almacenes y centros de distribución en LogiTrack." />
      <PageHeader title="Almacenes" subtitle="Administra los centros de almacenamiento y distribución" showAdd={isAdmin} onAdd={openCreate} addLabel="Nuevo Almacén" />
      {fetchError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFetchError(null)}>{fetchError}</Alert>}
      <Card>
        {loading ? <LoadingSpinner /> : (
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Código</TableCell>
                  <TableCell>Ciudad</TableCell>
                  <TableCell>Departamento</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Cap. Máx. (m³)</TableCell>
                  {isAdmin && <TableCell align="right">Acciones</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {warehouses.length === 0 ? (
                  <TableRow><TableCell colSpan={8} align="center" sx={{ py: 5, color: 'text.secondary' }}>No se encontraron almacenes</TableCell></TableRow>
                ) : warehouses.map((w) => (
                  <TableRow key={w.id} hover>
                    <TableCell>#{w.id}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{w.name}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace' }}>{w.code}</TableCell>
                    <TableCell>{w.city}</TableCell>
                    <TableCell>{w.department}</TableCell>
                    <TableCell>{w.type}</TableCell>
                    <TableCell>{w.maxCapacityM3} m³</TableCell>
                    {isAdmin && (
                      <TableCell align="right">
                        <Tooltip title="Editar almacén"><IconButton size="small" color="primary" onClick={() => openEdit(w)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Eliminar almacén"><IconButton size="small" color="error" onClick={() => setDeleteTarget(w.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
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
        <DialogTitle>{editItem ? `Editar Almacén #${editItem.id}` : 'Registrar Nuevo Almacén'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogContent>
            {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 8 }}>
                <label htmlFor="wname" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Nombre *</label>
                <TextField id="wname" {...register('name')} fullWidth size="small" placeholder="Ej: Almacén Central La Paz" error={!!errors.name} helperText={errors.name?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <label htmlFor="wcode" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Código *</label>
                <TextField id="wcode" {...register('code')} fullWidth size="small" placeholder="Ej: WH-001" error={!!errors.code} helperText={errors.code?.message} />
              </Grid>
              <Grid size={12}>
                <label htmlFor="waddress" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Dirección *</label>
                <TextField id="waddress" {...register('address')} fullWidth size="small" placeholder="Ej: Av. Arce #1234" error={!!errors.address} helperText={errors.address?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <label htmlFor="wcity" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Ciudad *</label>
                <TextField id="wcity" {...register('city')} fullWidth size="small" placeholder="Ej: La Paz" error={!!errors.city} helperText={errors.city?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <label htmlFor="wdept" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Departamento *</label>
                <TextField id="wdept" {...register('department')} fullWidth size="small" placeholder="Ej: La Paz" error={!!errors.department} helperText={errors.department?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <label htmlFor="wphone" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Teléfono *</label>
                <TextField id="wphone" {...register('phone')} fullWidth size="small" placeholder="Ej: 22234567" error={!!errors.phone} helperText={errors.phone?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <label htmlFor="wemail" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Correo Electrónico</label>
                <TextField id="wemail" {...register('email')} fullWidth size="small" type="email" placeholder="Opcional" error={!!errors.email} helperText={errors.email?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <label htmlFor="wcap" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Cap. Máxima (m³) *</label>
                <TextField id="wcap" {...register('maxCapacityM3')} fullWidth size="small" type="number" slotProps={{ htmlInput: { min: 0, step: 0.1 } }} error={!!errors.maxCapacityM3} helperText={errors.maxCapacityM3?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small" error={!!errors.type}>
                  <InputLabel id="wtype-label">Tipo *</InputLabel>
                  <Controller name="type" control={control} render={({ field }) => (
                    <Select {...field} labelId="wtype-label" label="Tipo *">
                      {WAREHOUSE_TYPE_VALUES.map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                    </Select>
                  )} />
                  {errors.type && <FormHelperText>{errors.type.message}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <label htmlFor="wmgr" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Nombre del Encargado</label>
                <TextField id="wmgr" {...register('managerName')} fullWidth size="small" placeholder="Opcional" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <label htmlFor="whours" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Horario de Operación</label>
                <TextField id="whours" {...register('operatingHours')} fullWidth size="small" placeholder="Ej: 8:00 - 18:00" />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setFormOpen(false)} disabled={submitLoading}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={submitLoading}>
              {submitLoading ? 'Guardando...' : editItem ? 'Actualizar Almacén' : 'Registrar Almacén'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        message={`¿Eliminar el almacén #${deleteTarget}? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <Snackbar open={!!successMsg} autoHideDuration={5000} onClose={() => setSuccessMsg(null)} message={successMsg} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />
    </>
  );
};

export default WarehousesPage;

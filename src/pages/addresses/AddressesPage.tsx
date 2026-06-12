import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Alert, Snackbar, Tooltip, Grid, FormControl, InputLabel,
  Select, MenuItem, FormHelperText, Chip, FormControlLabel, Checkbox,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
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
import { getAddresses, createAddress, updateAddress, deleteAddress } from '../../services/addressService';
import type { AddressDto } from '../../types/address.types';
import { ADDRESS_TYPE_VALUES } from '../../types/address.types';

const BOLIVIAN_DEPARTMENTS = [
  'La Paz', 'Cochabamba', 'Santa Cruz', 'Oruro', 'Potosí',
  'Chuquisaca', 'Tarija', 'Beni', 'Pando',
] as const;

const addressSchema = z.object({
  customerId: z.coerce.number().int().positive('El ID del cliente es requerido y debe ser mayor a 0'),
  street: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  city: z.string().min(3, 'La ciudad debe tener al menos 3 caracteres'),
  department: z.string().min(1, 'El departamento es requerido'),
  type: z.string().min(1, 'El tipo de dirección es requerido'),
  isDefault: z.boolean().optional(),
  zone: z.string().optional(),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  reference: z.string().optional(),
});

type AddressForm = z.infer<typeof addressSchema>;
const PAGE_SIZE = 10;

function extractApiError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const res = (err as { response?: { data?: unknown } }).response?.data;
    if (res && typeof res === 'object') {
      
      if ('Errors' in res && Array.isArray((res as { Errors: unknown[] }).Errors)) {
        const errors = (res as { Errors: { ErrorMessage?: string }[] }).Errors;
        const msgs = errors.map(e => e.ErrorMessage).filter(Boolean);
        if (msgs.length) return msgs.join(' • ');
      }

      if ('messages' in res && Array.isArray((res as { messages: unknown[] }).messages)) {
        const msgs = (res as { messages: { description?: string }[] }).messages;
        const desc = msgs.map(m => m.description).filter(Boolean);
        if (desc.length) return desc.join(' • ');
      }
    }
  }
  return 'Ocurrió un error inesperado. Intente nuevamente.';
}

const AddressesPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [addresses, setAddresses] = useState<AddressDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<AddressDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AddressDto | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema) as unknown as Resolver<AddressForm>,
    defaultValues: { type: 'Delivery', department: 'La Paz' },
  });

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await getAddresses({ pageNumber: page + 1, pageSize: PAGE_SIZE });
      setAddresses(res.data ?? []);
      setTotalCount(res.pagination?.totalCount ?? res.data?.length ?? 0);
    } catch { setFetchError('No se pudieron cargar las direcciones. Verifique su conexión.'); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchAddresses(); }, [fetchAddresses]);

  const openCreate = () => {
    setEditItem(null);
    reset({ customerId: 0, street: '', city: '', department: 'La Paz', type: 'Delivery', isDefault: false, zone: '', contactName: '', contactPhone: '', reference: '' });
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (item: AddressDto) => {
    setEditItem(item);
    reset({
      customerId: item.customerId,
      street: item.street,
      city: item.city,
      department: item.department,
      type: item.type,
      isDefault: item.isDefault,
      zone: item.zone ?? '',
      contactName: item.contactName ?? '',
      contactPhone: item.contactPhone ?? '',
      reference: item.reference ?? '',
    });
    setFormError(null);
    setFormOpen(true);
  };

  const onSubmit = async (data: AddressForm) => {
    setSubmitLoading(true);
    setFormError(null);
    try {
      if (editItem) {
        const payload = { ...data, isDefault: data.isDefault ?? editItem.isDefault, isActive: editItem.isActive };
        await updateAddress(editItem.id, payload as never);
        setSuccessMsg(`Dirección #${editItem.id} actualizada correctamente.`);
      } else {
        await createAddress({ ...data, isActive: true, isDefault: data.isDefault ?? false } as never);
        setSuccessMsg('Nueva dirección registrada correctamente.');
      }
      setFormOpen(false);
      fetchAddresses();
    } catch (err) {
      setFormError(extractApiError(err));
    } finally { setSubmitLoading(false); }
  };

  const handleDelete = async () => {
    if (deleteTarget === null) return;
    try {
      await deleteAddress(deleteTarget.id);
      setSuccessMsg(`Dirección en "${deleteTarget.street}" eliminada correctamente.`);
      setDeleteTarget(null);
      fetchAddresses();
    } catch (err) {
      setFetchError(extractApiError(err));
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <SEOHead title="Addresses" description="Manage customer addresses in LogiTrack." />
      <PageHeader title="Direcciones" subtitle="Gestión de direcciones de recogida y entrega" showAdd={isAdmin} onAdd={openCreate} addLabel="Nueva Dirección" />
      {fetchError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFetchError(null)}>{fetchError}</Alert>}
      <Card>
        {loading ? <LoadingSpinner /> : (
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Calle / Dirección</TableCell>
                  <TableCell>Ciudad</TableCell>
                  <TableCell>Departamento</TableCell>
                  <TableCell>Cliente ID</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Estado</TableCell>
                  {isAdmin && <TableCell align="right">Acciones</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {addresses.length === 0 ? (
                  <TableRow><TableCell colSpan={8} align="center" sx={{ py: 5, color: 'text.secondary' }}>No hay direcciones registradas</TableCell></TableRow>
                ) : addresses.map((a) => (
                  <TableRow key={a.id} hover>
                    <TableCell>#{a.id}</TableCell>
                    <TableCell>{a.street}</TableCell>
                    <TableCell>{a.city}</TableCell>
                    <TableCell>{a.department}</TableCell>
                    <TableCell>#{a.customerId}</TableCell>
                    <TableCell>
                      <Chip
                        label={a.type === 'Pickup' ? 'Recogida' : 'Entrega'}
                        size="small"
                        color={a.type === 'Pickup' ? 'primary' : 'secondary'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {a.isDefault && (
                        <Chip icon={<StarIcon fontSize="small" />} label="Predeterminada" size="small" color="warning" variant="filled" />
                      )}
                    </TableCell>
                    {isAdmin && (
                      <TableCell align="right">
                        <Tooltip title="Editar dirección"><IconButton size="small" color="primary" onClick={() => openEdit(a)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Eliminar dirección"><IconButton size="small" color="error" onClick={() => setDeleteTarget(a)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
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
        <DialogTitle>{editItem ? `Editar Dirección #${editItem.id}` : 'Registrar Nueva Dirección'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogContent>
            {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <label htmlFor="acustomerId" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>ID del Cliente *</label>
                <TextField id="acustomerId" {...register('customerId')} fullWidth size="small" type="number" placeholder="Ej: 1" error={!!errors.customerId} helperText={errors.customerId?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small" error={!!errors.type}>
                  <InputLabel id="atype-label">Tipo de Dirección *</InputLabel>
                  <Controller name="type" control={control} render={({ field }) => (
                    <Select {...field} labelId="atype-label" label="Tipo de Dirección *">
                      {ADDRESS_TYPE_VALUES.map((v) => <MenuItem key={v} value={v}>{v === 'Pickup' ? 'Recogida (Pickup)' : 'Entrega (Delivery)'}</MenuItem>)}
                    </Select>
                  )} />
                  {errors.type && <FormHelperText>{errors.type.message}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid size={12}>
                <Controller name="isDefault" control={control} render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={!!field.value} color="warning" />}
                    label="Marcar como dirección predeterminada"
                  />
                )} />
              </Grid>
              <Grid size={12}>
                <label htmlFor="street" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Calle / Dirección *</label>
                <TextField id="street" {...register('street')} fullWidth size="small" placeholder="Ej: Av. 6 de Agosto #2170" error={!!errors.street} helperText={errors.street?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <label htmlFor="acity" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Ciudad *</label>
                <TextField id="acity" {...register('city')} fullWidth size="small" placeholder="Ej: La Paz" error={!!errors.city} helperText={errors.city?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small" error={!!errors.department}>
                  <InputLabel id="adept-label">Departamento *</InputLabel>
                  <Controller name="department" control={control} render={({ field }) => (
                    <Select {...field} labelId="adept-label" label="Departamento *">
                      {BOLIVIAN_DEPARTMENTS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                    </Select>
                  )} />
                  {errors.department && <FormHelperText>{errors.department.message}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <label htmlFor="azone" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Zona</label>
                <TextField id="azone" {...register('zone')} fullWidth size="small" placeholder="Ej: Sopocachi (opcional)" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <label htmlFor="aref" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Referencia</label>
                <TextField id="aref" {...register('reference')} fullWidth size="small" placeholder="Ej: Edificio azul (opcional)" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <label htmlFor="acontact" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Nombre de Contacto</label>
                <TextField id="acontact" {...register('contactName')} fullWidth size="small" placeholder="Opcional" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <label htmlFor="acontactPhone" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Teléfono de Contacto</label>
                <TextField id="acontactPhone" {...register('contactPhone')} fullWidth size="small" placeholder="Ej: 71234567 (opcional)" />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setFormOpen(false)} disabled={submitLoading}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={submitLoading}>
              {submitLoading ? 'Guardando...' : editItem ? 'Actualizar Dirección' : 'Registrar Dirección'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        message={
          deleteTarget?.isDefault
            ? `⚠️ "${deleteTarget?.street}" es la dirección predeterminada del cliente #${deleteTarget?.customerId}. Solo se puede eliminar si el cliente tiene otra dirección predeterminada activa.`
            : `¿Eliminar la dirección "${deleteTarget?.street}" del cliente #${deleteTarget?.customerId}? Esta acción no se puede deshacer.`
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <Snackbar open={!!successMsg} autoHideDuration={5000} onClose={() => setSuccessMsg(null)} message={successMsg} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />
    </>
  );
};

export default AddressesPage;

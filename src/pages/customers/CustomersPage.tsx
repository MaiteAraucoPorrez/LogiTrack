import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Alert, Snackbar, Tooltip, InputAdornment, Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SEOHead from '../../components/seo/SEOHead';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../../services/customerService';
import type { CustomerDto } from '../../types/customer.types';

const customerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Ingresa un correo electrónico válido'),
  phone: z.string().min(7, 'El teléfono debe tener al menos 7 caracteres').regex(/^[\d\s\-+()]+$/, 'Formato de teléfono inválido'),
});

type CustomerForm = z.infer<typeof customerSchema>;
const PAGE_SIZE = 10;

const CustomersPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<CustomerDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),
  });

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await getCustomers({ name: search || undefined, pageNumber: page + 1, pageSize: PAGE_SIZE });
      setCustomers(res.data ?? []);
      setTotalCount(res.pagination?.totalCount ?? res.data?.length ?? 0);
    } catch {
      setFetchError('No se pudieron cargar los clientes. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const openCreate = () => {
    setEditItem(null);
    reset({ name: '', email: '', phone: '' });
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (item: CustomerDto) => {
    setEditItem(item);
    reset({ name: item.name, email: item.email, phone: item.phone });
    setFormError(null);
    setFormOpen(true);
  };

  const onSubmit = async (data: CustomerForm) => {
    setSubmitLoading(true);
    setFormError(null);
    try {
      if (editItem) {
        await updateCustomer(editItem.id, data);
        setSuccessMsg(`Cliente "${data.name}" actualizado correctamente.`);
      } else {
        await createCustomer(data);
        setSuccessMsg(`Cliente "${data.name}" registrado correctamente.`);
      }
      setFormOpen(false);
      fetchCustomers();
    } catch {
      setFormError('Operación fallida. Verifica los datos e intenta nuevamente.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    if (deleteTarget === null) return;
    try {
      await deleteCustomer(deleteTarget);
      setSuccessMsg(`Cliente #${deleteTarget} eliminado correctamente.`);
      setDeleteTarget(null);
      fetchCustomers();
    } catch {
      setFetchError('No se pudo eliminar el cliente.');
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <SEOHead title="Clientes" description="Gestiona los clientes en LogiTrack." />
      <PageHeader title="Clientes" subtitle="Gestiona tu base de clientes" showAdd={isAdmin} onAdd={openCreate} addLabel="Nuevo Cliente" />
      {fetchError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFetchError(null)}>{fetchError}</Alert>}

      <Box sx={{ mb: 2 }}>
        <TextField
          placeholder="Buscar por nombre..."
          size="small"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          sx={{ width: 280 }}
          slotProps={{
            input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> },
            htmlInput: { 'aria-label': 'buscar clientes' },
          }}
        />
      </Box>

      <Card>
        {loading ? <LoadingSpinner /> : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Correo</TableCell>
                  <TableCell>Teléfono</TableCell>
                  {isAdmin && <TableCell align="right">Acciones</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.length === 0 ? (
                  <TableRow><TableCell colSpan={5} align="center" sx={{ py: 5, color: 'text.secondary' }}>No se encontraron clientes</TableCell></TableRow>
                ) : customers.map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell>#{c.id}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{c.name}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.phone}</TableCell>
                    {isAdmin && (
                      <TableCell align="right">
                        <Tooltip title="Editar cliente"><IconButton size="small" color="primary" onClick={() => openEdit(c)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Eliminar cliente"><IconButton size="small" color="error" onClick={() => setDeleteTarget(c.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
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
        <DialogTitle>{editItem ? `Editar Cliente #${editItem.id}` : 'Registrar Nuevo Cliente'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogContent>
            {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
            <Grid container spacing={2}>
              <Grid size={12}>
                <label htmlFor="cname" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Nombre Completo *</label>
                <TextField id="cname" {...register('name')} fullWidth size="small" placeholder="Ej: Juan Pérez" error={!!errors.name} helperText={errors.name?.message} />
              </Grid>
              <Grid size={12}>
                <label htmlFor="cemail" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Correo Electrónico *</label>
                <TextField id="cemail" {...register('email')} fullWidth size="small" type="email" placeholder="Ej: juan@empresa.com" error={!!errors.email} helperText={errors.email?.message} />
              </Grid>
              <Grid size={12}>
                <label htmlFor="cphone" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Teléfono *</label>
                <TextField id="cphone" {...register('phone')} fullWidth size="small" placeholder="Ej: 72345678" error={!!errors.phone} helperText={errors.phone?.message} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setFormOpen(false)} disabled={submitLoading}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={submitLoading}>
              {submitLoading ? 'Guardando...' : editItem ? 'Actualizar Cliente' : 'Registrar Cliente'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        message={`¿Eliminar el cliente #${deleteTarget}? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <Snackbar open={!!successMsg} autoHideDuration={5000} onClose={() => setSuccessMsg(null)} message={successMsg} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />
    </>
  );
};

export default CustomersPage;

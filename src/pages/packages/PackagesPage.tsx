import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Alert, Snackbar, Tooltip, Grid,
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
import { getPackages, createPackage, updatePackage, deletePackage } from '../../services/packageService';
import type { PackageDto } from '../../types/package.types';

const packageSchema = z.object({
  description: z.string().min(3, 'La descripción debe tener al menos 3 caracteres'),
  weight: z.coerce.number().positive('El peso debe ser mayor a 0'),
  shipmentId: z.coerce.number().int().positive('El ID del envío es requerido'),
  price: z.coerce.number().positive('El precio debe ser mayor a 0'),
});

type PackageForm = z.infer<typeof packageSchema>;
const PAGE_SIZE = 10;

const PackagesPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [packages, setPackages] = useState<PackageDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<PackageDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PackageForm>({
    resolver: zodResolver(packageSchema) as unknown as Resolver<PackageForm>,
  });

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await getPackages({ pageNumber: page + 1, pageSize: PAGE_SIZE });
      setPackages(res.data ?? []);
      setTotalCount(res.pagination?.totalCount ?? res.data?.length ?? 0);
    } catch { setFetchError('No se pudieron cargar los paquetes. Verifica tu conexión.'); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchPackages(); }, [fetchPackages]);

  const openCreate = () => {
    setEditItem(null);
    reset({ description: '', weight: 0, shipmentId: 0, price: 0 });
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (item: PackageDto) => {
    setEditItem(item);
    reset({ description: item.description, weight: item.weight, shipmentId: item.shipmentId, price: item.price });
    setFormError(null);
    setFormOpen(true);
  };

  const onSubmit = async (data: PackageForm) => {
    setSubmitLoading(true);
    setFormError(null);
    try {
      if (editItem) {
        await updatePackage(editItem.id, data);
        setSuccessMsg(`Paquete #${editItem.id} actualizado correctamente.`);
      } else {
        await createPackage(data);
        setSuccessMsg('Nuevo paquete registrado correctamente.');
      }
      setFormOpen(false);
      fetchPackages();
    } catch { setFormError('Operación fallida. Verifica los datos e intenta nuevamente.'); }
    finally { setSubmitLoading(false); }
  };

  const handleDelete = async () => {
    if (deleteTarget === null) return;
    try {
      await deletePackage(deleteTarget);
      setSuccessMsg(`Paquete #${deleteTarget} eliminado correctamente.`);
      setDeleteTarget(null);
      fetchPackages();
    } catch { setFetchError('No se pudo eliminar el paquete.'); setDeleteTarget(null); }
  };

  return (
    <>
      <SEOHead title="Paquetes" description="Gestiona los paquetes y carga de envíos en LogiTrack." />
      <PageHeader title="Paquetes" subtitle="Administra los paquetes de cada envío" showAdd={isAdmin} onAdd={openCreate} addLabel="Nuevo Paquete" />
      {fetchError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFetchError(null)}>{fetchError}</Alert>}
      <Card>
        {loading ? <LoadingSpinner /> : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Peso (kg)</TableCell>
                  <TableCell>ID Envío</TableCell>
                  <TableCell>Precio ($)</TableCell>
                  {isAdmin && <TableCell align="right">Acciones</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {packages.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5, color: 'text.secondary' }}>No se encontraron paquetes</TableCell></TableRow>
                ) : packages.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell>#{p.id}</TableCell>
                    <TableCell>{p.description}</TableCell>
                    <TableCell>{p.weight.toFixed(2)}</TableCell>
                    <TableCell>#{p.shipmentId}</TableCell>
                    <TableCell>${p.price.toFixed(2)}</TableCell>
                    {isAdmin && (
                      <TableCell align="right">
                        <Tooltip title="Editar paquete"><IconButton size="small" color="primary" onClick={() => openEdit(p)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Eliminar paquete"><IconButton size="small" color="error" onClick={() => setDeleteTarget(p.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
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
        <DialogTitle>{editItem ? `Editar Paquete #${editItem.id}` : 'Registrar Nuevo Paquete'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogContent>
            {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
            <Grid container spacing={2}>
              <Grid size={12}>
                <label htmlFor="description" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Descripción *</label>
                <TextField id="description" {...register('description')} fullWidth size="small" placeholder="Descripción del contenido del paquete" error={!!errors.description} helperText={errors.description?.message} />
              </Grid>
              <Grid size={6}>
                <label htmlFor="weight" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Peso (kg) *</label>
                <TextField id="weight" {...register('weight')} fullWidth size="small" type="number" slotProps={{ htmlInput: { step: 0.01, min: 0 } }} error={!!errors.weight} helperText={errors.weight?.message} />
              </Grid>
              <Grid size={6}>
                <label htmlFor="price" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Precio ($) *</label>
                <TextField id="price" {...register('price')} fullWidth size="small" type="number" slotProps={{ htmlInput: { step: 0.01, min: 0 } }} error={!!errors.price} helperText={errors.price?.message} />
              </Grid>
              <Grid size={12}>
                <label htmlFor="shipmentId" style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>ID del Envío *</label>
                <TextField id="shipmentId" {...register('shipmentId')} fullWidth size="small" type="number" error={!!errors.shipmentId} helperText={errors.shipmentId?.message} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setFormOpen(false)} disabled={submitLoading}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={submitLoading}>
              {submitLoading ? 'Guardando...' : editItem ? 'Actualizar Paquete' : 'Registrar Paquete'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        message={`¿Eliminar el paquete #${deleteTarget}? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <Snackbar open={!!successMsg} autoHideDuration={5000} onClose={() => setSuccessMsg(null)} message={successMsg} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />
    </>
  );
};

export default PackagesPage;

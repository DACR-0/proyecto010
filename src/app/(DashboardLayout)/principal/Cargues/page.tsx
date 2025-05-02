'use client';
import {
  Typography, Table,
  TableBody, TableCell,
  TableContainer, TableHead,
  TableRow, Paper, CircularProgress,
  Grid, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, CardContent, Divider
} from '@mui/material';
import { useEffect, useState } from 'react';
import { IconEdit, IconPlus, IconRefresh, IconEye, IconSearch, IconDownload, IconTrash, IconInfoCircle } from '@tabler/icons-react';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import BlankCard from '@/app/(DashboardLayout)/components/shared/BlankCard';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import Ctotal from './total/page'
import Cdocente from './docentes_planta/page'
import DescargasA from './descargas_academicas/page'

const CarguePage = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false); // Estado para abrir/cerrar el modal
  const [openDialog2, setOpenDialog2] = useState<boolean>(false); // Estado para abrir/cerrar el modal 2
  const [openDialog3, setOpenDialog3] = useState<boolean>(false); // Estado para abrir/cerrar el modal 2
  const handleCloseDialog = () => {
    setOpenDialog(false); // Cierra el modal 
  };
  const handleCloseDialog2 = () => {
    setOpenDialog2(false); // Cierra el modal 2
  };
  const handleCloseDialog3 = () => {
    setOpenDialog3(false); // Cierra el modal 3
  };
  const handleOpenDialog = () => {
    setOpenDialog(true); // Abre el modal
  };
  const handleOpenDialog2 = () => {
    setOpenDialog2(true); // Abre el modal 2
  };
  const handleOpenDialog3 = () => {
    setOpenDialog3(true); // Abre el modal 3
  };
  return (
    <div>
      {/* Dialog Modal */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <Ctotal />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog Modal 2 */}
      <Dialog open={openDialog2} onClose={handleCloseDialog2}>
        <DialogContent>
          <Cdocente />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog2} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog Modal 3 */}
      <Dialog open={openDialog3} onClose={handleCloseDialog3}>
        <DialogContent>
          <DescargasA/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog3} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      <DashboardCard title="1. Cargue - Docentes (Planta)">
        {/* Botón de Agregar INCREMENTAL */}
        <Button
          variant="contained"
          startIcon={<IconPlus />}
          onClick={handleOpenDialog2}
          style={{ marginRight: '16px' }} // Espacio entre los botones
        >
          Cargar
        </Button>
      </DashboardCard>

      <Divider sx={{ my: 2 }} />

      <DashboardCard title="2. Cargue - Descargas academicas">
        {/* Botón de Agregar INCREMENTAL */}
        <Button
          variant="contained"
          startIcon={<IconPlus />}
          onClick={handleOpenDialog3}
          style={{ marginRight: '16px' }} // Espacio entre los botones
        >
          Cargar
        </Button>
      </DashboardCard>

      <Divider sx={{ my: 2 }} />

      <DashboardCard title="3. Cargue - Base programacion academica">
        {/* Botón de Agregar TOTAL */}
        <Button
          variant="contained"
          startIcon={<IconPlus />}
          onClick={handleOpenDialog}
          style={{ marginRight: '16px' }} // Espacio entre los botones
        >
          Cargar
        </Button>
      </DashboardCard>
      <Divider sx={{ my: 2 }} />
      

    </div>
  );
};

export default CarguePage;


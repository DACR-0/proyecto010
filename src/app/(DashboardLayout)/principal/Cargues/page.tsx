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
import CargueT from './total/page'

const CarguePage = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false); // Estado para abrir/cerrar el modal
  const [openDialog2, setOpenDialog2] = useState<boolean>(false); // Estado para abrir/cerrar el modal
  const handleCloseDialog = () => {
    setOpenDialog(false); // Cierra el modal 2
  };
  const handleCloseDialog2 = () => {
    setOpenDialog2(false); // Cierra el modal 2
  };
  const handleOpenDialog = () => {
    setOpenDialog(true); // Abre el modal
  };
  const handleOpenDialog2 = () => {
    setOpenDialog2(true); // Abre el modal
  };
  return (
    <div>
      {/* Dialog Modal */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogContent>
                <CargueT/>
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
                hola2
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog2} color="primary">
                  Cancelar
                </Button>
              </DialogActions>
            </Dialog>
      
      <DashboardCard title="Cargue Total">
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
      <DashboardCard title="Cargue Incremental">
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
    </div>
  );
};

export default CarguePage;


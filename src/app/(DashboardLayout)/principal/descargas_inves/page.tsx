'use client';

import { useEffect, useState } from 'react';
import {
  Typography, Table,
  TableBody, TableCell,
  TableContainer, TableHead,
  TableRow, Paper,CircularProgress ,
  Grid, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { IconEdit, IconPlus, IconRefresh } from '@tabler/icons-react';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import ECDescargasI from './ec_d_i'

interface Descarga {
  nombre_profesor: string;
  nombre_fi: string;
  porcentaje: number;
  soporte: string | null; // Permite que sea opcional o null
}

const DescargasIPage: React.FC = () => {
  const [descargas, setDescargas] = useState<Descarga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [openDialog, setOpenDialog] = useState<boolean>(false); // Estado para abrir/cerrar el modal
  const [openDialog2, setOpenDialog2] = useState<boolean>(false);

  useEffect(() => {
    const fetchDescargas = async () => {
      try {
        const response = await fetch('/api/descargas_inves');
        if (!response.ok) {
          throw new Error('Error al obtener las descargas de investigación');
        }
        const data = await response.json();
        setDescargas(data);
      } catch (error) {
        console.error(error);
        setError('Hubo un problema al cargar los datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchDescargas();
  }, []);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (loading) {
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ height: '50vh' }}>
        <Grid item>
          <CircularProgress color="primary" />
          <Typography variant="h6" sx={{ mt: 2 }}>Cargando ...</Typography>
        </Grid>
      </Grid>
    );
  }

  const handleOpenDialog = () => {
    setOpenDialog(true); // Abre el modal
  };
  const handleOpenDialog2 = () => {
    setOpenDialog2(true); // Abre el modal
  };
  const handleCloseDialog = () => {
    setOpenDialog(false); // Cierra el modal 2
  };
  const handleCloseDialog2 = () => {
    setOpenDialog2(false); // Cierra el modal 2
  };
  const handleRefresh = () => {
    window.location.reload(); // Recargar la página actual para volver a cargar las tablas
  };

  return (
    <div>
      <DashboardCard>
        <div>
          <Typography variant="h3" sx={{ color: (theme) => theme.palette.primary.main }} gutterBottom>
            <center>DESCARGAS DE INVESTIGACIÓN</center>
          </Typography>
          <Grid container spacing={2} style={{ marginTop: '16px', marginBottom: '16px' }} justifyContent="center">
            <Grid item xs={12} sm={6} style={{ display: 'flex', paddingRight: '16px', justifyContent: 'center' }}>
              {/* Botón de Agregar */}
              <Button
                variant="contained"
                startIcon={<IconPlus />}
                onClick={handleOpenDialog}
                style={{ marginRight: '16px' }} // Espacio entre los botones
              >
                Agregar
              </Button>

              {/* Botón de Actualizar */}
              <Button
                variant="contained"
                startIcon={<IconRefresh />}
                onClick={handleRefresh}
              >
                Actualizar
              </Button>
            </Grid>
          </Grid>
        </div>
      </DashboardCard>


      {/* Dialog Modal */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent>
           {/* Aquí insertas el formulario de ec_d_a <ECDescargasA />*/
           <ECDescargasI />
           }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog Modal2 */}
      <Dialog open={openDialog2} onClose={handleCloseDialog2}>
        <DialogTitle>Editar Descargas Académicas</DialogTitle>
        <DialogContent>
          {/* Aquí insertas el formulario de ec_d_a <ECDescargasA /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog2} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center"><Typography variant="h6">Profesor</Typography></TableCell>
              <TableCell align="center"><Typography variant="h6">F. Investigación</Typography></TableCell>
              <TableCell align="center"><Typography variant="h6">Porcentaje</Typography></TableCell>
              <TableCell align="center"><Typography variant="h6">Ver Soporte</Typography></TableCell>
              <TableCell align="center"><Typography variant="h6">Editar descarga</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {descargas.map((descarga, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:hover': {
                    backgroundColor: '#d3d4d5', // Cambia el color de fondo al pasar el mouse
                    cursor: 'pointer',          // Cambia el cursor a pointer
                  },
                }}
              >
                <TableCell>{descarga.nombre_profesor}</TableCell>
                <TableCell>{descarga.nombre_fi}</TableCell>
                <TableCell>{descarga.porcentaje}%</TableCell>
                <TableCell align="center">
                  {descarga.soporte ? (
                    <button
                      style={{
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '5px 10px',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        if (!descarga.soporte) return; // Evita errores si es null o undefined
                        const soporteFileName = descarga.soporte; // Extrae el nombre del archivo
                        if (!soporteFileName) return; // Si sigue vacío, no hace nada
                        const fileUrl = `http://localhost:4000/uploads/${encodeURIComponent(soporteFileName)}`;
                        window.open(fileUrl, '_blank'); // Abre en nueva pestaña
                      }}

                    >
                      Ver Soporte
                    </button>
                  ) : (
                    'No disponible'
                  )}
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenDialog2}
                    startIcon={<IconEdit />} // Aquí se coloca el ícono
                  >
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DescargasIPage;

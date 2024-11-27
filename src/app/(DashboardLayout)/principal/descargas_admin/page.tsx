'use client';

import { useEffect, useState } from 'react';
import {
  Typography, Table,
  TableBody, TableCell,
  TableContainer, TableHead,
  TableRow, Paper,
  Grid, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { IconEdit } from '@tabler/icons-react';
//import ECDescargasA from './ec_d_a'

interface Descarga {
  nombre_profesor: string;
  nombre_cargo: string;
  porcentaje: number;
  soporte: File | null; // Puede ser null si no hay archivo asociado
}

const DescargasAPage: React.FC = () => {
  const [descargas, setDescargas] = useState<Descarga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [openDialog, setOpenDialog] = useState<boolean>(false); // Estado para abrir/cerrar el modal
  const [openDialog2, setOpenDialog2] = useState<boolean>(false);

  useEffect(() => {
    const fetchDescargas = async () => {
      try {
        const response = await fetch('/api/descargas_admin'); // Asegúrate de que este endpoint sea correcto
        if (!response.ok) {
          throw new Error('Error al obtener las descargas académicas');
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
    return <Typography>Cargando...</Typography>;
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

  return (
    <div>
      <Typography
        variant="h3"
        sx={{ color: (theme) => theme.palette.primary.main }}
        gutterBottom
      >
        <center>DESCARGAS ACADÉMICAS</center>
      </Typography>
      <Grid container spacing={2} style={{ marginTop: '16px', marginBottom: '16px' }}>
        <Grid container spacing={2} style={{ marginTop: '16px' }} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              component="label"
              fullWidth
              style={{ textTransform: 'none' }}
              onClick={handleOpenDialog} // Abre el modal cuando se presiona el botón
            >
              Agregar
            </Button>
          </Grid>
        </Grid>
      </Grid>

      {/* Dialog Modal */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Agregar Descargas Académicas</DialogTitle>
        <DialogContent>
           {/* Aquí insertas el formulario de ec_d_a <ECDescargasA />*/}
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
              <TableCell align="center">
                <Typography variant="h6">Nombre del Profesor</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Cargo Administrativo</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Porcentaje de Descarga</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Ver Soporte</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Editar descarga</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {descargas.map((descarga, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    cursor: 'pointer',
                  },
                }}
              >
                <TableCell align="center">{descarga.nombre_profesor}</TableCell>
                <TableCell align="center">{descarga.nombre_cargo}</TableCell>
                <TableCell align="center">{descarga.porcentaje}%</TableCell>
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
                        const link = document.createElement('a');
                        link.href = `data:application/octet-stream;base64,${descarga.soporte}`;
                        link.download = `soporte_${index}.pdf`; // Cambia la extensión según el tipo de archivo esperado
                        link.click();
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

export default DescargasAPage;

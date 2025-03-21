'use client';

import { useEffect, useState } from 'react';
import {
  Typography, Table,
  TableBody, TableCell,
  TableContainer, TableHead,
  TableRow, Paper, CircularProgress,
  Grid, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, CardContent
} from '@mui/material';
import { IconEdit, IconPlus, IconRefresh, IconEye, IconSearch, IconDownload, IconTrash, IconInfoCircle } from '@tabler/icons-react';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import ECDescargasI from './ec_d_i';
import * as XLSX from 'xlsx'; // Importa la librería xlsx
import BlankCard from '@/app/(DashboardLayout)/components/shared/BlankCard';

interface Descarga {
  id_di: number;
  id_profesor: string;
  nombre_profesor: string;
  nombre_fi: string;
  porcentaje: number;
  soporte: string | null; // Permite que sea opcional o null
  fecha_inicio: string | null;
  fecha_fin: string | null;
}

const DescargasIPage: React.FC = () => {
  const [descargas, setDescargas] = useState<Descarga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para el término de búsqueda

  const [openDialog, setOpenDialog] = useState<boolean>(false); // Estado para abrir/cerrar el modal
  const [openDialog2, setOpenDialog2] = useState<boolean>(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);  // Estado para guardar el id de la descarga a eliminar

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

  // Filtra las descargas basadas en el término de búsqueda
  const filteredDescargas = descargas.filter((descarga) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      descarga.id_profesor.toLowerCase().includes(searchLower) ||
      descarga.nombre_profesor.toLowerCase().includes(searchLower) ||
      descarga.nombre_fi.toLowerCase().includes(searchLower)
    );
  });

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
    setOpenDialog(false); // Cierra el modal
  };
  const handleCloseDialog2 = () => {
    setOpenDialog2(false); // Cierra el modal
  };
  const handleRefresh = () => {
    window.location.reload(); // Recargar la página actual para volver a cargar las tablas
  };
  // Función para exportar los datos a Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredDescargas); // Convierte los datos a formato Excel
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Profesores'); // Crea un libro de trabajo con la hoja "Profesores"
    XLSX.writeFile(wb, 'Profesores.xlsx'); // Descarga el archivo Excel
  };
  
  const handleDelete = async () => {
      try {
        // Hacer la solicitud DELETE a la API
        const response = await fetch('/api/descargas_inves/eliminar', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id_di: idToDelete }),
        });

        if (!response.ok) {
          throw new Error('No se pudo eliminar el registro');
        }

        // Eliminar el registro del estado
        setDescargas(descargas.filter((descarga) => descarga.id_di !== idToDelete));
        setOpenDialog2(false);  // Cerrar el modal
        alert('Registro eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar el registro:', error);
        alert('Error al eliminar el registro');
      }
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
                style={{ marginRight: '16px' }} // Espacio entre los botones
                onClick={handleRefresh}
              >
                Actualizar
              </Button>
              {/* Botón de exportar */}
              <Button variant="contained"
                startIcon={<IconDownload />}
                color="primary" onClick={exportToExcel}>
                Exportar
              </Button>
            </Grid>
          </Grid>
        </div>
      </DashboardCard>

      {/* Dialog Modal */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xl" fullWidth>
        <DialogContent>
          <ECDescargasI />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Modal2 */}
      <Dialog open={openDialog2} onClose={handleCloseDialog2}>
        <DialogTitle><IconInfoCircle /></DialogTitle>
        <DialogContent>
          <BlankCard>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Typography
                variant="h5"
                sx={{
                  color: (theme) => theme.palette.error.main,
                  mb: 2, // Añadir espacio debajo del título
                }}
              >
                Advertencia
              </Typography>

              <Typography
                variant="body1"
                color="text.primary"
                sx={{
                  mb: 3, // Añadir espacio debajo del texto
                  textAlign: 'justify', // Justificar el texto
                  width: '100%', // Asegurar que el texto ocupe todo el espacio disponible
                }}
              >
                ¿Está seguro de que desea eliminar este registro? Tenga en cuenta que esta acción es permanente y no se podrá recuperar.
              </Typography>

              <Button
                variant="contained"
                color="error"
                sx={{
                  mt: 2, // Añadir espacio encima del botón
                  textAlign: 'center', // Centrar el texto del botón
                }}
                onClick={handleDelete} // Llama a la función de eliminación
              >
                Eliminar
              </Button>
            </CardContent>
          </BlankCard>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog2} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Buscador */}
      <div>
        <Grid item xs={12} sm={10}>
          <TextField
            fullWidth
            label="Buscar por Documento, Nombre de Profesor o Funcion investigativa"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center"><Typography variant="h6">Documento</Typography></TableCell>
              <TableCell align="center"><Typography variant="h6">Profesor</Typography></TableCell>
              <TableCell align="center"><Typography variant="h6">F. Investigación</Typography></TableCell>
              <TableCell align="center"><Typography variant="h6">Porcentaje</Typography></TableCell>
              <TableCell align="center"><Typography variant="h6">Fecha de inicio</Typography></TableCell>
              <TableCell align="center"><Typography variant="h6">Fecha de fin</Typography></TableCell>
              <TableCell align="center"><Typography variant="h6">Ver Soporte</Typography></TableCell>
              <TableCell align="center"><Typography variant="h6">Eliminar descarga</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDescargas.map((descarga) => (
              <TableRow
                key={descarga.id_di}
                sx={{
                  '&:hover': {
                    backgroundColor: '#d3d4d5',
                    cursor: 'pointer',
                  },
                }}
              >
                <TableCell>{descarga.id_profesor}</TableCell>
                <TableCell>{descarga.nombre_profesor}</TableCell>
                <TableCell>{descarga.nombre_fi}</TableCell>
                <TableCell>{descarga.porcentaje}%</TableCell>
                <TableCell>{descarga.fecha_inicio}</TableCell>
                <TableCell>{descarga.fecha_fin}</TableCell>
                <TableCell align="center">
                  {descarga.soporte ? (
                    <Button
                      style={{
                        backgroundColor: '#1976d2',
                        color: 'white',
                      }}
                      variant="contained"
                      startIcon={<IconEye />}
                      onClick={() => {
                        if (!descarga.soporte) return;
                        const soporteFileName = descarga.soporte;
                        if (!soporteFileName) return;

                        if (soporteFileName.startsWith('file')) {
                          const fileUrl = `http://localhost:4000/uploads/${encodeURIComponent(soporteFileName)}`;
                          window.open(fileUrl, '_blank');
                        } else if (soporteFileName.includes('drive.google.com')) {
                          window.open(soporteFileName, '_blank');
                        } else {
                          alert('Tipo de archivo o enlace no soportado');
                        }
                      }}
                    >
                      Ver
                    </Button>
                  ) : (
                    'No disponible'
                  )}
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      setIdToDelete(descarga.id_di);  // Guardamos el id del registro que se va a eliminar
                      handleOpenDialog2();             // Abrimos el modal de confirmación
                    }}
                    startIcon={<IconTrash />}
                  >
                    Eliminar
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

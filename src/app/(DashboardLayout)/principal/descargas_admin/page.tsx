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
import ECDescargasA from './ec_d_a';
import EditarA from './edit';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import BlankCard from '@/app/(DashboardLayout)/components/shared/BlankCard';
import * as XLSX from 'xlsx'; // Importa la librería xlsx

interface Descarga {
  id_da: number;
  id_profesor: string;
  nombre_profesor: string;
  nombre_cargo: string;
  porcentaje: number;
  soporte: string | null; // Permite que sea opcional o null
}

const DescargasAPage: React.FC = () => {
  const [descargas, setDescargas] = useState<Descarga[]>([]);
  const [filteredDescargas, setFilteredDescargas] = useState<Descarga[]>([]); // Nuevo estado para las descargas filtradas
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Nuevo estado para el término de búsqueda

  const [openDialog, setOpenDialog] = useState<boolean>(false); // Estado para abrir/cerrar el modal
  const [openDialog2, setOpenDialog2] = useState<boolean>(false);
  const [selectedDescarga, setSelectedDescarga] = useState<Descarga | null>(null); // Estado para almacenar la descarga seleccionada
  const [selectedDescargaForEdit, setSelectedDescargaForEdit] = useState<Descarga | null>(null); // Estado para manejar la descarga seleccionada para editar
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false); // Estado para abrir/cerrar el modal de edición

  useEffect(() => {
    const fetchDescargas = async () => {
      try {
        const response = await fetch('/api/descargas_admin'); // Asegúrate de que este endpoint sea correcto
        if (!response.ok) {
          throw new Error('Error al obtener las descargas académicas');
        }
        const data = await response.json();
        setDescargas(data);
        setFilteredDescargas(data); // Inicializa las descargas filtradas
      } catch (error) {
        console.error(error);
        setError('Hubo un problema al cargar los datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchDescargas();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      // Filtra las descargas por id_profesor o nombre_profesor
      setFilteredDescargas(
        descargas.filter(
          (descarga) =>
            descarga.id_profesor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            descarga.nombre_profesor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            descarga.nombre_cargo.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      // Si no hay término de búsqueda, muestra todas las descargas
      setFilteredDescargas(descargas);
    }
  }, [searchTerm, descargas]);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (loading) {
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ height: '50vh' }}>
        <Grid item>
          <CircularProgress color="primary" />
          <Typography variant="h6" sx={{ mt: 2 }}>Cargando descargas académicas...</Typography>
        </Grid>
      </Grid>
    );
  }

  const handleOpenDialog = () => {
    setOpenDialog(true); // Abre el modal
  };
  const handleOpenDialog2 = (descarga: Descarga) => {
    setSelectedDescarga(descarga); // Establece el registro a eliminar
    setOpenDialog2(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Cierra el modal 2
  };
  const handleCloseDialog2 = () => {
    setOpenDialog2(false); // Cierra el modal 2
  };
  const handleRefresh = async () => {
    setLoading(true); // Muestra el indicador de carga mientras se obtienen los datos
    try {
      const response = await fetch('/api/descargas_admin'); // Asegúrate de que este endpoint sea correcto
      if (!response.ok) {
        throw new Error('Error al obtener las descargas académicas');
      }
      const data = await response.json();
      setDescargas(data); // Actualiza las descargas con los nuevos datos
      setFilteredDescargas(data); // Actualiza las descargas filtradas también
    } catch (error) {
      console.error(error);
      setError('Hubo un problema al cargar los datos.');
    } finally {
      setLoading(false); // Oculta el indicador de carga una vez que los datos estén listos
    }
  };
  const handleOpenEditDialog = (descarga: Descarga) => {
    setSelectedDescargaForEdit(descarga); // Establece la descarga seleccionada para editar
    setOpenEditDialog(true); // Abre el modal de edición
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false); // Cierra el modal de edición
  };

  // Función para exportar los datos a Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredDescargas); // Convierte los datos a formato Excel
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Profesores'); // Crea un libro de trabajo con la hoja "Profesores"
    XLSX.writeFile(wb, 'Profesores.xlsx'); // Descarga el archivo Excel
  };
  // hacer la solicitud DELETE a la AP
  const handleDelete = async () => {
    if (selectedDescarga) {
      try {
        const response = await fetch('/api/descargas_admin/eliminar', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_da: selectedDescarga.id_da }),
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el registro');
        }

        // Elimina la descarga de la lista local
        setDescargas((prev) => prev.filter((descarga) => descarga.id_da !== selectedDescarga.id_da));
        setFilteredDescargas((prev) => prev.filter((descarga) => descarga.id_da !== selectedDescarga.id_da));
        alert('Registro eliminado correctamente');
        handleCloseDialog2(); // Cierra el modal
      } catch (error) {
        console.error(error);
        setError('Hubo un problema al eliminar el registro.');
      }
    }
  };

  return (
    <div>
      <DashboardCard>
        <div>
          <Typography variant="h3" sx={{ color: (theme) => theme.palette.primary.main }} gutterBottom>
            <center>DESCARGAS ACADÉMICAS</center>
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
                style={{ marginRight: '16px' }} // Espacio entre los botones
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
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <ECDescargasA />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Modal 2 */}
      <Dialog open={openDialog2} onClose={handleCloseDialog2}>
        <DialogTitle><IconInfoCircle /></DialogTitle>
        <DialogContent>
          <BlankCard>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Typography variant="h5" sx={{ color: (theme) => theme.palette.error.main, mb: 2 }}>
                Advertencia
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, textAlign: 'justify', width: '100%' }}>
                ¿Está seguro de que desea eliminar este registro? Tenga en cuenta que esta acción es permanente y no se podrá recuperar.
              </Typography>
              <Button
                variant="contained"
                color="error"
                sx={{ mt: 2 }}
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
      {/*modal 3*/}
      {/* Modal de edición */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogContent>
          {/* Pasa el idDescarga y la función onClose como prop */}
          {selectedDescargaForEdit && (
            <EditarA
              idDescarga={String(selectedDescargaForEdit.id_da)}
              onClose={handleCloseEditDialog} // Pasa la función para cerrar el modal
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      <div>
        <Grid item xs={12} sm={10}>
          {/* Buscador */}
          <TextField
            fullWidth
            label="Buscar por Documento o Nombre de Profesor"
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
              <TableCell align="center">
                <Typography variant="h6">Documento</Typography>
              </TableCell>
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
                <Typography variant="h6">Editar</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Eliminar descarga</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDescargas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="h6" color="textSecondary">
                    No se encontraron resultados
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredDescargas.map((descarga) => (
                <TableRow
                  key={descarga.id_da}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                      cursor: 'pointer',
                    },
                  }}
                >
                  <TableCell align="center">{descarga.id_profesor}</TableCell>
                  <TableCell align="center">{descarga.nombre_profesor}</TableCell>
                  <TableCell align="center">{descarga.nombre_cargo}</TableCell>
                  <TableCell align="center">{descarga.porcentaje}%</TableCell>
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
                          if (!descarga.soporte) return; // Evita errores si es null o undefined
                          const soporteFileName = descarga.soporte; // Extrae el nombre del archivo
                          if (!soporteFileName) return; // Si sigue vacío, no hace nada

                          // Verifica si el soporte es un archivo local o un enlace de Google Drive
                          if (soporteFileName.startsWith('file')) {
                            // Si es un archivo local, crea la URL para acceder a él
                            const fileUrl = `http://localhost:4000/uploads/${encodeURIComponent(soporteFileName)}`;
                            window.open(fileUrl, '_blank'); // Abre en nueva pestaña
                          } else if (soporteFileName.includes('drive.google.com')) {
                            // Si es un enlace de Google Drive, abre el enlace directamente
                            window.open(soporteFileName, '_blank');
                          } else {
                            // En caso de que no sea ninguno de los dos, podrías manejarlo aquí
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
                      color="primary"
                      startIcon={<IconEdit />}
                      onClick={() => handleOpenEditDialog(descarga)} // Acción al hacer clic en editar
                    >
                      Editar
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleOpenDialog2(descarga)} // Pasa el registro seleccionado
                      startIcon={<IconTrash />}
                    >
                      Eliminar
                    </Button>

                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

        </Table>
      </TableContainer>
    </div>
  );
};
export default DescargasAPage;
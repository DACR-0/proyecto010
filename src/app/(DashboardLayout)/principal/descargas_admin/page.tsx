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
  soporte2?: string | null; // Nuevo campo opcional para el anexo
}

const DescargasAPage: React.FC = () => {
  const [descargas, setDescargas] = useState<Descarga[]>([]);
  const [filteredDescargas, setFilteredDescargas] = useState<Descarga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDialog2, setOpenDialog2] = useState<boolean>(false);
  const [selectedDescarga, setSelectedDescarga] = useState<Descarga | null>(null);
  const [selectedDescargaForEdit, setSelectedDescargaForEdit] = useState<Descarga | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);

  useEffect(() => {
    const fetchDescargas = async () => {
      try {
        const response = await fetch('/api/descargas_admin');
        if (!response.ok) {
          throw new Error('Error al obtener las descargas académicas');
        }
        const data = await response.json();
        setDescargas(data);
        setFilteredDescargas(data);
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
      setFilteredDescargas(
        descargas.filter(
          (descarga) =>
            descarga.id_profesor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            descarga.nombre_profesor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            descarga.nombre_cargo.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
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
    setOpenDialog(true);
  };
  const handleOpenDialog2 = (descarga: Descarga) => {
    setSelectedDescarga(descarga);
    setOpenDialog2(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleCloseDialog2 = () => {
    setOpenDialog2(false);
  };
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/descargas_admin');
      if (!response.ok) {
        throw new Error('Error al obtener las descargas académicas');
      }
      const data = await response.json();
      setDescargas(data);
      setFilteredDescargas(data);
    } catch (error) {
      console.error(error);
      setError('Hubo un problema al cargar los datos.');
    } finally {
      setLoading(false);
    }
  };
  const handleOpenEditDialog = (descarga: Descarga) => {
    setSelectedDescargaForEdit(descarga);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredDescargas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Profesores');
    XLSX.writeFile(wb, 'Profesores.xlsx');
  };

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

        setDescargas((prev) => prev.filter((descarga) => descarga.id_da !== selectedDescarga.id_da));
        setFilteredDescargas((prev) => prev.filter((descarga) => descarga.id_da !== selectedDescarga.id_da));
        alert('Registro eliminado correctamente');
        handleCloseDialog2();
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
              <Button
                variant="contained"
                startIcon={<IconPlus />}
                onClick={handleOpenDialog}
                style={{ marginRight: '16px' }}
              >
                Agregar
              </Button>
              <Button
                variant="contained"
                startIcon={<IconRefresh />}
                onClick={handleRefresh}
                style={{ marginRight: '16px' }}
              >
                Actualizar
              </Button>
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
                onClick={handleDelete}
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
      {/* Modal de edición */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogContent>
          {selectedDescargaForEdit && (
            <EditarA
              idDescarga={String(selectedDescargaForEdit.id_da)}
              onClose={handleCloseEditDialog}
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
                <Typography variant="h6">Ver Anexo</Typography>
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
                <TableCell colSpan={8} align="center">
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
                    {descarga.soporte2 ? (
                      <Button
                        style={{
                          backgroundColor: '#1976d2',
                          color: 'white',
                        }}
                        variant="contained"
                        startIcon={<IconEye />}
                        onClick={() => {
                          if (!descarga.soporte2) return;
                          const soporte2FileName = descarga.soporte2;
                          if (!soporte2FileName) return;

                          if (soporte2FileName.startsWith('file')) {
                            const fileUrl = `http://localhost:4000/uploads/${encodeURIComponent(soporte2FileName)}`;
                            window.open(fileUrl, '_blank');
                          } else if (soporte2FileName.includes('drive.google.com')) {
                            window.open(soporte2FileName, '_blank');
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
                      color="primary"
                      startIcon={<IconEdit />}
                      onClick={() => handleOpenEditDialog(descarga)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleOpenDialog2(descarga)}
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
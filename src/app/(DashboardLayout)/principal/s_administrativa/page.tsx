'use client';

import { useEffect, useState } from 'react';
import {
    Typography, Table,
    TableBody, TableCell,
    TableContainer, TableHead,
    TableRow, Paper, CircularProgress,
    Grid, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, CardContent
} from '@mui/material';
import { IconEdit, IconPlus, IconRefresh, IconSearch, IconEye, IconTrash, IconInfoCircle, IconDownload } from '@tabler/icons-react';
import ECSituacionesA from './ec_s_a';
import * as XLSX from 'xlsx'; // Importa la librería xlsx
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import BlankCard from '@/app/(DashboardLayout)/components/shared/BlankCard';
import EditarA from './edit';

interface Situaciones {
    idsituacion_admin: number;
    id_profesor: string;
    nombre_profesor: string;
    nombre_sa: string;
    fecha_inicio_str: string;
    fecha_fin_str: string;
    soporte: string | null; // Permite que sea opcional o null
}

const SituacionesAPage: React.FC = () => {
    const [situaciones, setSituaciones] = useState<Situaciones[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para el término de búsqueda

    const [openDialog, setOpenDialog] = useState<boolean>(false); // Estado para abrir/cerrar el modal
    const [openDialog2, setOpenDialog2] = useState<boolean>(false);
    const [idToDelete, setIdToDelete] = useState<number | null>(null);  // Estado para guardar el id a eliminar
    const [selectedDescargaForEdit, setSelectedDescargaForEdit] = useState<Situaciones | null>(null); // Estado para manejar la descarga seleccionada para editar
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false); // Estado para abrir/cerrar el modal de edición


    useEffect(() => {
        const fetchSituaciones = async () => {
            try {
                const response = await fetch('/api/situacion_admin');
                if (!response.ok) {
                    throw new Error('Error al obtener las situaciones');
                }
                const data = await response.json();
                console.log(data);
                setSituaciones(data);
            } catch (error) {
                console.error(error);
                setError('Hubo un problema al cargar los datos.');
            } finally {
                setLoading(false);
            }
        };

        fetchSituaciones();
    }, []);

    // Filtrar las situaciones basadas en el término de búsqueda
    const filteredSituaciones = situaciones.filter((situacion) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            situacion.id_profesor.toLowerCase().includes(searchLower) ||
            situacion.nombre_profesor.toLowerCase().includes(searchLower) ||
            situacion.nombre_sa.toLowerCase().includes(searchLower)
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
        setOpenDialog2(true); // Abre el modal 2
    };
    const handleCloseDialog = () => {
        setOpenDialog(false); // Cierra el modal 
    };
    const handleCloseDialog2 = () => {
        setOpenDialog2(false); // Cierra el modal 2
    };
    const handleRefresh = async () => {
        setLoading(true); // Activa el estado de carga
        setError(null); // Resetea cualquier mensaje de error
    
        try {
          const response = await fetch('/api/situacion_admin'); // Obtiene los datos de la API
          if (!response.ok) {
            throw new Error('Error al obtener las Situasiones administrativas');
          }
          const data = await response.json(); // Convierte la respuesta en formato JSON
          setSituaciones(data); // Actualiza el estado con los nuevos datos de las descargas
        } catch (error) {
          console.error(error);
          setError('Hubo un problema al cargar los datos.'); // Muestra un mensaje de error
        } finally {
          setLoading(false); // Desactiva el estado de carga
        }
      };
    const handleOpenEditDialog = (situacion: Situaciones) => {
        setSelectedDescargaForEdit(situacion); // Establece la descarga seleccionada para editar
        setOpenEditDialog(true); // Abre el modal de edición
    };
    const handleCloseEditDialog = () => {
        setOpenEditDialog(false); // Cierra el modal de edición
    };
    const handleDelete = async () => {
        try {
            // Hacer la solicitud DELETE a la API
            const response = await fetch('/api/situacion_admin/eliminar', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idsituacion_admin: idToDelete }),
            });

            if (!response.ok) {
                throw new Error('No se pudo eliminar el registro');
            }

            // Eliminar el registro del estado
            setSituaciones(situaciones.filter((situacion) => situacion.idsituacion_admin !== idToDelete));
            setOpenDialog2(false);  // Cerrar el modal
            alert('Registro eliminado correctamente');
        } catch (error) {
            console.error('Error al eliminar el registro:', error);
            alert('Error al eliminar el registro');
        }
    };
    // Función para exportar los datos a Excel
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredSituaciones); // Convierte los datos a formato Excel
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Profesores'); // Crea un libro de trabajo con la hoja "Profesores"
        XLSX.writeFile(wb, 'Profesores.xlsx'); // Descarga el archivo Excel
    };

    return (
        <div>
            <DashboardCard>
                <div>
                    <Typography variant="h3" sx={{ color: (theme) => theme.palette.primary.main }} gutterBottom>
                        <center>SITUACIONES ADMINISTRATIVAS</center>
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
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xl">
                <DialogContent>
                    <ECSituacionesA />
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
                    {/* Aquí insertas el formulario de para editar <DAedit> */}
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
            {/* Modal de edición */}
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="xl">
                <DialogContent>
                    {/* Pasa el idDescarga y la función onClose como prop */}
                    {selectedDescargaForEdit && (
                        <EditarA
                            idDescarga={String(selectedDescargaForEdit.idsituacion_admin)}
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

            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Buscar por Documento, Profesor o Situación"
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
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center"><Typography variant="h6">Documento</Typography></TableCell>
                            <TableCell align="center"><Typography variant="h6">Profesor</Typography></TableCell>
                            <TableCell align="center"><Typography variant="h6">Situación Administrativa</Typography></TableCell>
                            <TableCell align="center"><Typography variant="h6">Fecha de inicio</Typography></TableCell>
                            <TableCell align="center"><Typography variant="h6">Fecha de fin</Typography></TableCell>
                            <TableCell align="center"><Typography variant="h6">Ver Soporte</Typography></TableCell>
                            <TableCell align="center"><Typography variant="h6">Editar</Typography></TableCell>
                            <TableCell align="center"><Typography variant="h6">Eliminar situación administrativa</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredSituaciones.map((situacion) => (
                            <TableRow
                                key={situacion.idsituacion_admin}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: '#d3d4d5', // Cambia el color de fondo al pasar el mouse
                                        cursor: 'pointer',          // Cambia el cursor a pointer
                                    },
                                }}
                            >
                                <TableCell>{situacion.id_profesor}</TableCell>
                                <TableCell>{situacion.nombre_profesor}</TableCell>
                                <TableCell>{situacion.nombre_sa}</TableCell>
                                <TableCell>{situacion.fecha_inicio_str}</TableCell>
                                <TableCell>{situacion.fecha_fin_str}</TableCell>
                                <TableCell align="center">
                                    {situacion.soporte ? (
                                        <Button
                                            style={{
                                                backgroundColor: '#1976d2',
                                                color: 'white',
                                            }}
                                            variant="contained"
                                            startIcon={<IconEye />}
                                            onClick={() => {
                                                if (!situacion.soporte) return; // Evita errores si es null o undefined
                                                const soporteFileName = situacion.soporte; // Extrae el nombre del archivo
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
                                    <div style={{ display: 'flex', gap: '8px' }}> {/* Contenedor flex para los botones */}
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<IconEdit />}
                                            onClick={() => handleOpenEditDialog(situacion)} // Acción al hacer clic en editar
                                        > Editar
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell align="center">
                                    <div style={{ display: 'flex', gap: '12px' }}> {/* Contenedor flex para los botones */}
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => {
                                                setIdToDelete(situacion.idsituacion_admin);  // Guardamos el id del registro que se va a eliminar
                                                handleOpenDialog2();             // Abrimos el modal de confirmación
                                            }}
                                            startIcon={<IconTrash />}
                                        > Eliminar
                                        </Button>
                                    </div>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default SituacionesAPage;

'use client'; // Marca el archivo como un Componente del Cliente

import { useEffect, useState } from 'react';
import { IconDownload, IconSearch } from '@tabler/icons-react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Grid, Button, Box, TextField, InputAdornment, } from '@mui/material';
import * as XLSX from 'xlsx'; // Importa la librería xlsx

interface Profesor {
  identificacion: string;
  docente: string;
  total_horas: string;
  factultad_adscripcion: string;
}

const ProfesorescPage: React.FC = () => {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const response = await fetch('/api/profesores_catedra');
        if (!response.ok) {
          throw new Error('Error al obtener los profesores');
        }
        const data = await response.json();
        setProfesores(data);
      } catch (error) {
        console.error(error);
        setError('Hubo un problema al cargar los datos.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfesores();
  }, []);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(profesores); // Convierte los datos a formato Excel
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Profesores');
    XLSX.writeFile(wb, 'Profesores.xlsx');
  };

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

  // Filtrar los profesores según los filtros aplicados
  const filteredProfesores = profesores.filter((profesor) => {
    const matchesSearchTerm = profesor.docente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profesor.factultad_adscripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profesor.identificacion.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearchTerm
  });

  return (
    <div>
      <Typography variant="h3" sx={{ color: (theme) => theme.palette.primary.main }} gutterBottom>
        <center>PROFESORES</center>
      </Typography>
      <Grid container sx={{ mb: 2 }} alignItems="center" justifyContent="space-between">
        <Grid item xs={12} sm={10}>
          <TextField
            fullWidth
            label="Buscar por nombre, facultad o documento"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch/>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item>
          {/* Botón de exportar */}
          <Button variant="contained" color="primary" onClick={exportToExcel}>
            Exportar
            <Box sx={{ ml: 1 }}>
              <IconDownload />
            </Box>
          </Button>
        </Grid>
      </Grid>

      {/* Tabla de Profesores */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><h2>Facultad de adscripción</h2></TableCell>
              <TableCell><h2>Documento</h2></TableCell>
              <TableCell><h2>Nombre</h2></TableCell>
              <TableCell><h2>Horas dedicación</h2></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProfesores.map((profesor, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:hover': {
                    backgroundColor: '#d3d4d5',
                    cursor: 'pointer',
                  },
                }}
              >
                <TableCell>{profesor.factultad_adscripcion}</TableCell>
                <TableCell>{profesor.identificacion}</TableCell>
                <TableCell>{profesor.docente}</TableCell>
                <TableCell>{profesor.total_horas}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ProfesorescPage;
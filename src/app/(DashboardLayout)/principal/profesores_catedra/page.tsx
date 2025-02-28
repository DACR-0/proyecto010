'use client'; // Marca el archivo como un Componente del Cliente

import { useEffect, useState } from 'react';
import { IconDownload } from '@tabler/icons-react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Grid, Button, Box } from '@mui/material';
import * as XLSX from 'xlsx'; // Importa la librería xlsx

interface Profesor {
  Identificación: string;
  DOCENTE: string;
  total_horas: string;
  factultad_adscripcion: string;
}

const ProfesoresPage: React.FC = () => {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div>
      <Typography variant="h3" sx={{ color: (theme) => theme.palette.primary.main }} gutterBottom>
        <center>PROFESORES</center>
      </Typography>

      {/* Botón de exportar */}
      <Button variant="contained" color="primary" onClick={exportToExcel} sx={{ mb: 2 }}>
        Exportar
        <Box sx={{ ml: 1 }}>
          <IconDownload />
        </Box>
      </Button>

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
            {profesores.map((profesor) => (
              <TableRow key={profesor.Identificación} sx={{ '&:hover': { backgroundColor: '#d3d4d5', cursor: 'pointer' } }}>
                <TableCell>{profesor.factultad_adscripcion}</TableCell>
                <TableCell>{profesor.Identificación}</TableCell>
                <TableCell>{profesor.DOCENTE}</TableCell>
                <TableCell>{profesor.total_horas}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ProfesoresPage;

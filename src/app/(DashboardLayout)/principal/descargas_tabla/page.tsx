'use client';

import { useEffect, useState } from 'react';
import { IconDownload, IconSearch } from '@tabler/icons-react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Grid, Button, Box, TextField, InputAdornment } from '@mui/material';
import * as XLSX from 'xlsx';

interface Descarga {
  nombre: string;
  id_profesor: string;
  porcentaje_admin: number;
  porcentaje_exten: number;
  porcentaje_inve: number;
  total_ie: number;
  descarga_total: number;
  horas_dedicacion: number;
  horas_descarga: number;
  horas_totales: number;
}

const DescargasTPage: React.FC = () => {
  const [descargas, setDescargas] = useState<Descarga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchDescargas = async () => {
      try {
        const response = await fetch('/api/descargas_tabla');
        if (!response.ok) {
          throw new Error('Error al obtener los datos de las descargas');
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

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(descargas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Descargas');
    XLSX.writeFile(wb, 'Descargas.xlsx');
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

  // Filtrar las descargas según el término de búsqueda
  const filteredDescargas = descargas.filter((descarga) => {
    const matchesSearchTerm =
      descarga.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      descarga.id_profesor.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearchTerm;
  });

  return (
    <div>
      <Typography variant="h3" sx={{ color: (theme) => theme.palette.primary.main }} gutterBottom>
        <center>DESCARGAS DE PROFESORES</center>
      </Typography>
      <Grid container sx={{ mb: 2 }} alignItems="center" justifyContent="space-between">
        <Grid item xs={12} sm={10}>
          <TextField
            fullWidth
            label="Buscar por nombre o documento"
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
        <Grid item>
          <Button variant="contained" color="primary" onClick={exportToExcel}>
            Exportar
            <Box sx={{ ml: 1 }}>
              <IconDownload />
            </Box>
          </Button>
        </Grid>
      </Grid>

      {/* Tabla de Descargas */}
      <TableContainer component={Paper} sx={{ maxHeight: 600, overflowY: 'auto' }}>
        <Table stickyHeader aria-label="Tabla de descargas">
          <TableHead>
            <TableRow>
              <TableCell><h2>Nombre</h2></TableCell>
              <TableCell><h2>Documento</h2></TableCell>
              <TableCell><h2>Funcion Administrativa</h2></TableCell>
              <TableCell><h2>Extensión</h2></TableCell>
              <TableCell><h2>Investigación</h2></TableCell>
              <TableCell><h2>Total I+E</h2></TableCell>
              <TableCell><h2>Descarga Total</h2></TableCell>
              <TableCell><h2>Horas dedicacion</h2></TableCell>
              <TableCell><h2>Horas Descargas</h2></TableCell>
              <TableCell><h2>Horas Totales</h2></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDescargas.map((descarga, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:hover': {
                    backgroundColor: '#d3d4d5',
                    cursor: 'pointer',
                  },
                }}
              >
                <TableCell>{descarga.nombre}</TableCell>
                <TableCell>{descarga.id_profesor}</TableCell>
                <TableCell>{descarga.porcentaje_admin}%</TableCell>
                <TableCell>{descarga.porcentaje_exten}%</TableCell>
                <TableCell>{descarga.porcentaje_inve}%</TableCell>
                <TableCell>{descarga.total_ie}%</TableCell>
                <TableCell>{descarga.descarga_total}%</TableCell>
                <TableCell>{descarga.horas_dedicacion}</TableCell>
                <TableCell>{descarga.horas_descarga}</TableCell>
                <TableCell>{descarga.horas_totales}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DescargasTPage;

'use client';

import { useEffect, useState } from 'react';
import { IconDownload, IconSearch } from '@tabler/icons-react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Grid, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Button, Box } from '@mui/material';
import * as XLSX from 'xlsx'; // Importa la librería xlsx

interface Profesor {
  numero_doc: string;
  nombre: string;
  dedicacion: string;
  programa: string;
  tipo_doc: string;
}

interface Programa {
  id: string;
  nombre: string;
}

const ProfesoresPage: React.FC = () => {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPrograma, setSelectedPrograma] = useState<string>('');
  const [selectedDedicacion, setSelectedDedicacion] = useState<string>('');

  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const response = await fetch('/api/profesores');
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

    const fetchProgramas = async () => {
      try {
        const response = await fetch('/api/programas');
        if (!response.ok) {
          throw new Error('Error al obtener los programas');
        }
        const data = await response.json();
        setProgramas(data); // Guarda los programas obtenidos de la API
      } catch (error) {
        console.error(error);
        setError('Hubo un problema al cargar los programas.');
      }
    };

    fetchProfesores();
    fetchProgramas();
  }, []);

  const mostrarDedicacion = (dedicacion: string): string => {
    const ded = dedicacion.trim().toLowerCase(); // Elimina espacios al inicio y al final y convierte a minúsculas
    switch (ded) {
      case 'medio tiempo':
        return '20';
      case 'tiempo completo':
        return '40';
      case 'parcial':
        return '20'; // Asumí que "parcial" es como "medio tiempo"
      default:
        return 'Desconocido';
    }
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
    const matchesSearchTerm = profesor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profesor.programa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profesor.numero_doc.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPrograma = selectedPrograma ? profesor.programa === selectedPrograma : true;
    const matchesDedicacion = selectedDedicacion ? profesor.dedicacion === selectedDedicacion : true;

    return matchesSearchTerm && matchesPrograma && matchesDedicacion;
  });

  // Función para exportar los datos a Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredProfesores); // Convierte los datos a formato Excel
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Profesores'); // Crea un libro de trabajo con la hoja "Profesores"
    XLSX.writeFile(wb, 'Profesores.xlsx'); // Descarga el archivo Excel
  };

  return (
    <div>
      <Typography variant="h3" sx={{ color: (theme) => theme.palette.primary.main }} gutterBottom>
        <center>PROFESORES</center>
      </Typography>

      {/* Filtros */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Buscar por nombre, programa o documento"
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
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Programa</InputLabel>
            <Select
              value={selectedPrograma}
              onChange={(e) => setSelectedPrograma(e.target.value)}
              label="Programa"
            >
              <MenuItem value="">Todos</MenuItem>
              {programas.map((programa) => (
                <MenuItem key={programa.id} value={programa.nombre}>
                  {programa.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Dedicación</InputLabel>
            <Select
              value={selectedDedicacion}
              onChange={(e) => setSelectedDedicacion(e.target.value)}
              label="Dedicación"
            >
              <MenuItem value="">Todos</MenuItem>
              {['Medio Tiempo', 'Tiempo Completo', 'Parcial'].map((dedicacion) => (
                <MenuItem key={dedicacion} value={dedicacion}>
                  {dedicacion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

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
              <TableCell><h2>Programa</h2></TableCell>
              <TableCell><h2>Documento</h2></TableCell>
              <TableCell><h2>Nombre</h2></TableCell>
              <TableCell><h2>Dedicación</h2></TableCell>
              <TableCell><h2>Horas dedicación</h2></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProfesores.map((profesor) => (
              <TableRow
                key={profesor.numero_doc}
                sx={{
                  '&:hover': {
                    backgroundColor: '#d3d4d5',
                    cursor: 'pointer',
                  },
                }}
              >
                <TableCell>{profesor.programa}</TableCell>
                <TableCell>{profesor.tipo_doc} {profesor.numero_doc}</TableCell>
                <TableCell>{profesor.nombre}</TableCell>
                <TableCell>{profesor.dedicacion}</TableCell>
                <TableCell>{mostrarDedicacion(profesor.dedicacion)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ProfesoresPage;
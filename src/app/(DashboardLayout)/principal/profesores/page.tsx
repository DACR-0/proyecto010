'use client';

import { useEffect, useState } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

interface Profesor {
  numero_doc: string;
  nombre: string;
  dedicacion: string;
  id_programa: string;
  tipo_doc: string;
}

const ProfesoresPage: React.FC = () => {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

    fetchProfesores();
  }, []);

  const mostrarDedicacion = (dedicacion: string): string => {
    switch (dedicacion.toLowerCase()) {
      case 'medio tiempo':
        return '20';
      case 'tiempo completo':
        return '40';
      default:
        return 'Desconocido';
    }
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <div>
      <Typography variant="h3" sx={{ color: (theme) => theme.palette.primary.main }} gutterBottom>
        <center>PROFESORES</center> 
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><h2>Documento</h2></TableCell>
              <TableCell><h2>Nombre</h2></TableCell>
              <TableCell><h2>Dedicación</h2></TableCell>
              <TableCell><h2>Horas dedicación</h2></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {profesores.map((profesor) => (
              <TableRow
              key={profesor.numero_doc}
              sx={{
                '&:hover': {
                  backgroundColor: '#d3d4d5', // Cambia el color de fondo al pasar el mouse
                  cursor: 'pointer',          // Cambia el cursor a pointer
                },
              }}
            >
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
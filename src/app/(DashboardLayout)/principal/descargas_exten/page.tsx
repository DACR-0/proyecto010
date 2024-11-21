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

interface Descarga {
  nombre_profesor: string;
  nombre_fe: string;
  porcentaje: number;
}

const DescargasEPage: React.FC = () => {
  const [descargas, setDescargas] = useState<Descarga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDescargas = async () => {
      try {
        const response = await fetch('/api/descargas_exten');
        if (!response.ok) {
          throw new Error('Error al obtener las descargas de Extención');
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

  return (
    <div>
      <Typography variant="h3" sx={{ color: (theme) => theme.palette.primary.main }} gutterBottom>
        <center>DESCARGAS DE EXTENCIÓN</center>
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><h2>Profesor</h2></TableCell>
              <TableCell><h2>F. Extencion</h2></TableCell>
              <TableCell><h2>Porcentaje</h2></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {descargas.map((descarga, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:hover': {
                    backgroundColor: '#d3d4d5', // Cambia el color de fondo al pasar el mouse
                    cursor: 'pointer',          // Cambia el cursor a pointer
                  },
                }}
              >
                <TableCell>{descarga.nombre_profesor}</TableCell>
                <TableCell>{descarga.nombre_fe}</TableCell>
                <TableCell>{descarga.porcentaje}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DescargasEPage;

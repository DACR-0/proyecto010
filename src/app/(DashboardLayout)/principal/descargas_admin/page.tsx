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
  Grid, TextField, Button,
} from '@mui/material';

interface Descarga {
  nombre_profesor: string;
  nombre_cargo: string;
  porcentaje: number;
  soporte: string | null; // Puede ser null si no hay archivo asociado
}

const DescargasAPage: React.FC = () => {
  const [descargas, setDescargas] = useState<Descarga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDescargas = async () => {
      try {
        const response = await fetch('/api/descargas_admin'); // Asegúrate de que este endpoint sea correcto
        if (!response.ok) {
          throw new Error('Error al obtener las descargas académicas');
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
      <Typography
        variant="h3"
        sx={{ color: (theme) => theme.palette.primary.main }}
        gutterBottom
      >
        <center>DESCARGAS ACADÉMICAS</center>
      </Typography>
      <Grid container style={{ marginTop: '16px', width:100 }}>
      <Button
        variant="contained"
        component="label"
        fullWidth
        style={{ textTransform: 'none' }}
      >
        Agregar
      </Button>
      <br/>
      </Grid>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {descargas.map((descarga, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    cursor: 'pointer',
                  },
                }}
              >
                <TableCell align="center">{descarga.nombre_profesor}</TableCell>
                <TableCell align="center">{descarga.nombre_cargo}</TableCell>
                <TableCell align="center">{descarga.porcentaje}%</TableCell>
                <TableCell align="center">
                  {descarga.soporte ? (
                    <button
                      style={{
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '5px 10px',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = `data:application/octet-stream;base64,${descarga.soporte}`;
                        link.download = `soporte_${index}.png`; // Cambia la extensión según el tipo de archivo esperado
                        link.click();
                      }}
                    >
                      Ver Soporte
                    </button>
                  ) : (
                    'No disponible'
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DescargasAPage;

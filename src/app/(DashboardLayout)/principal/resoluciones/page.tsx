'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Grid,
  CircularProgress,
} from '@mui/material';
import { IconSearch, IconPlus, IconDownload } from '@tabler/icons-react';
import ModalResolucion from './modalResolucion';

interface Resolucion {
  idresolucion: number;
  nombre: string;
  archivo: string | null;
  programa: string | null;
}

const fetchResoluciones = async (): Promise<Resolucion[]> => {
  const res = await fetch('/api/resoluciones');
  if (!res.ok) throw new Error('Error al obtener resoluciones');
  return res.json();
};

const Page = () => {
  const [resoluciones, setResoluciones] = useState<Resolucion[]>([]);
  const [filtered, setFiltered] = useState<Resolucion[]>([]);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar resoluciones al montar
  useEffect(() => {
    setLoading(true);
    fetchResoluciones()
      .then(data => {
        setResoluciones(data);
        setFiltered(data);
      })
      .catch(() => setResoluciones([]))
      .finally(() => setLoading(false));
  }, []);

  // Filtrar resoluciones
  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(
      resoluciones.filter(
        r =>
          r.nombre.toLowerCase().includes(s) ||
          (r.programa ?? '').toLowerCase().includes(s)
      )
    );
  }, [search, resoluciones]);

  // Guardar nueva resolución (simulado, deberías hacer POST a tu API)
  const handleSaveResolucion = (data: any) => {
    setOpenModal(false);
    // Aquí deberías hacer POST a tu API y recargar la lista
    // Simulación:
    setResoluciones(prev => [
      ...prev,
      {
        idresolucion: prev.length + 1,
        nombre: data.nombreResolucion,
        archivo: data.enlaceArchivo,
        programa: data.programa,
      },
    ]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Resoluciones
      </Typography>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Buscar por nombre, código o programa"
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<IconPlus />}
            onClick={() => setOpenModal(true)}
          >
            Agregar
          </Button>
        </Grid>
      </Grid>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre/Código</TableCell>
                <TableCell>Programa</TableCell>
                <TableCell>Archivo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No hay resoluciones para mostrar.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(res => (
                  <TableRow key={res.idresolucion}>
                    <TableCell>{res.nombre}</TableCell>
                    <TableCell>{res.programa ?? '-'}</TableCell>
                    <TableCell>
                      {res.archivo ? (
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          startIcon={<IconDownload />}
                          href={res.archivo}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ver archivo
                        </Button>
                      ) : (
                        <Typography color="text.secondary" variant="body2">
                          No hay resolución adjunta
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ModalResolucion
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSaveResolucion}
      />
    </Box>
  );
};

export default Page;
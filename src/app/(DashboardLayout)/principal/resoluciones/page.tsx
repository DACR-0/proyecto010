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
import { IconSearch, IconPlus, IconDownload, IconTrash, IconEye } from '@tabler/icons-react';
import ModalResolucion from './modalResolucion';
import * as XLSX from 'xlsx';

interface Resolucion {
  idresolucion: number;
  nombre: string;
  archivo: string | null;
  programa: string | null;
  viabilidades?: string | null; // <-- Añadido
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
  const cargarResoluciones = () => {
    setLoading(true);
    fetchResoluciones()
      .then(data => {
        setResoluciones(data);
        setFiltered(data);
      })
      .catch(() => setResoluciones([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarResoluciones();
  }, []);

  // Filtrar resoluciones (incluye viabilidades)
  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(
      resoluciones.filter(
        r =>
          r.nombre.toLowerCase().includes(s) ||
          (r.programa ?? '').toLowerCase().includes(s) ||
          (r.viabilidades ?? '').toLowerCase().includes(s)
      )
    );
  }, [search, resoluciones]);

  // Guardar nueva resolución: solo recarga la lista después del guardado
  const handleSaveResolucion = () => {
    setOpenModal(false);
    cargarResoluciones();
  };

  // Eliminar resolución
  const handleDelete = async (idresolucion: number) => {
    if (!window.confirm('¿Está seguro de eliminar esta resolución?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/resoluciones?id=${idresolucion}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'Error al eliminar');
      }
    } catch (e) {
      alert('Error de red al eliminar');
    } finally {
      cargarResoluciones();
    }
  };

  // Exportar a Excel (incluye viabilidades)
  const handleExport = () => {
    const data = filtered.map(res => ({
      'ID': res.idresolucion,
      'Nombre/Código': res.nombre,
      'Programa': res.programa ?? '',
      'Viabilidades': res.viabilidades ?? '',
      'Archivo': res.archivo ?? '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Resoluciones');
    XLSX.writeFile(workbook, 'resoluciones.xlsx');
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
            placeholder="Buscar por nombre, código, programa o viabilidad"
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
            startIcon={<IconDownload />}
            onClick={handleExport}
            sx={{ mr: 1 }}
          >
            Exportar
          </Button>
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
                <TableCell>Viabilidades</TableCell>
                <TableCell>Archivo</TableCell>
                <TableCell align="center">Eliminar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay resoluciones para mostrar.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(res => (
                  <TableRow key={res.idresolucion}>
                    <TableCell>{res.nombre}</TableCell>
                    <TableCell>{res.programa ?? '-'}</TableCell>
                    <TableCell>
                      {res.viabilidades
                        ? res.viabilidades
                        : <Typography color="text.secondary" variant="body2">-</Typography>}
                    </TableCell>
                    <TableCell>
                      {res.archivo ? (
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ marginRight: 8 }}
                          startIcon={<IconEye />}
                          href={res.archivo}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ver
                        </Button>
                      ) : (
                        <Typography color="text.secondary" variant="body2">
                          No hay resolución adjunta
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(res.idresolucion)}
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
      )}

      <ModalResolucion
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          cargarResoluciones();
        }}
        onSave={handleSaveResolucion}
      />
    </Box>
  );
};

export default Page;
'use client';

import React, { useState, useEffect } from 'react';
import { Grid, Typography, TextField, Button, MenuItem } from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

interface Situaciones {
  ids_admin: number;
  nombre: string;
}

interface Row {
  id: number;
  cargo: number | null;
  soporte: File | string | null; // soporte puede ser un archivo o un enlace
  fecha_inicio: string | null;
  fecha_fin: string | null;
}

const ECSituacionesAPage = () => {
  const [rows, setRows] = useState<Row[]>([
    { id: 1, cargo: null, soporte: null, fecha_inicio: null, fecha_fin: null },
  ]);
  const [profesores, setProfesores] = useState<{ id: number; nombre: string; numero_doc: string }[]>([]);
  const [profesorSeleccionado, setProfesorSeleccionado] = useState<string>('');
  const [cargos, setCargos] = useState<Situaciones[]>([]);

  // Cargar datos de la API de profesores
  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const response = await fetch('/api/profesores');
        if (!response.ok) throw new Error('Error al obtener los profesores');
        const data = await response.json();
        setProfesores(data); // Asignar los datos obtenidos al estado
      } catch (error) {
        console.error('Error al obtener los profesores:', error);
      }
    };

    fetchProfesores();
  }, []);

  // Cargar datos de la API de cargos
  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const response = await fetch('/api/ec_s_a');
        if (!response.ok) throw new Error('Error al obtener los cargos');
        const data = await response.json();
        setCargos(data); // Asignar los datos obtenidos al estado
      } catch (error) {
        console.error('Error al obtener los cargos:', error);
      }
    };

    fetchCargos();
  }, []);

  // Función para agregar filas
  const handleAddRow = () => {
    setRows([...rows, { id: rows.length + 1, cargo: null, soporte: null, fecha_inicio: null, fecha_fin: null }]);
  };

  // Función para eliminar la última fila
  const handleRemoveRow = () => {
    if (rows.length > 1) {
      setRows(rows.slice(0, -1));
    }
  };

  // Validación de formulario
  const isFormValid = () => {
    return rows.every((row) => row.cargo && row.soporte && row.fecha_inicio && row.fecha_fin);
  };

  // Función para finalizar
  const handleFinalizar = async () => {
    try {
      if (!profesorSeleccionado) {
        alert('Por favor, selecciona un profesor.');
        return;
      }

      if (!isFormValid()) {
        alert('Por favor, completa todos los campos y adjunta los soportes necesarios.');
        return;
      }

      // Subir archivos y obtener sus rutas
      const rowsWithFilePaths = await Promise.all(
        rows.map(async (row) => {
          if (row.soporte instanceof File) {
            const formData = new FormData();
            formData.append('file', row.soporte);

            try {
              const uploadResponse = await fetch('http://localhost:4000/upload', {
                method: 'POST',
                body: formData,
              });

              if (!uploadResponse.ok) {
                throw new Error('Error al subir el archivo');
              }

              const { filePath } = await uploadResponse.json();
              return { ...row, soporte: filePath }; // Asegúrate de incluir el soporte en el objeto
            } catch (error) {
              console.error('Error al subir archivo:', error);
              alert('Error al subir archivo: ' + (error as Error).message);
              return row; // Devolver la fila original sin modificar
            }
          } else if (typeof row.soporte === 'string') {
            // Si es un enlace de Google Drive, no hacemos nada y solo lo guardamos
            return { ...row, soporte: row.soporte };
          }
          return row;
        })
      );

      // Enviar datos a la API con el soporte, fecha de inicio y fecha de fin
      const response = await fetch('/api/s_admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profesor: profesorSeleccionado,
          rows: rowsWithFilePaths.map(row => ({
            cargo: row.cargo,
            soporte: row.soporte,
            fecha_inicio: row.fecha_inicio,
            fecha_fin: row.fecha_fin,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar las descargas');
      }

      const result = await response.json();
      alert('guardada exitosamente');

      // Resetear el formulario
      setProfesorSeleccionado('');
      setRows([{ id: 1, cargo: null, soporte: null, fecha_inicio: null, fecha_fin: null }]);
    } catch (error) {
      console.error('Error al guardar:', error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Hubo un problema al guardar');
      }
    }
  };

  return (
    <DashboardCard title="Editar y Crear Descargas Académicas" sx={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Grid container spacing={3}>
        {/* Selección del profesor */}
        <Grid item xs={12}>
          <Typography variant="h6">Descargas de:</Typography>
          <br />
          <TextField
            fullWidth
            select
            label="Nombre y apellido profesor"
            variant="outlined"
            value={profesorSeleccionado}
            onChange={(e) => setProfesorSeleccionado(e.target.value)} // Ahora guarda el numero_doc
          >
            {profesores.map((profesor) => (
              <MenuItem key={profesor.id} value={profesor.numero_doc}>
                {profesor.nombre}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Botones para agregar y eliminar fila */}
        <Grid item xs={12} style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          <Button
            variant="contained"
            onClick={handleAddRow}
            style={{ backgroundColor: '#007bff', color: '#fff', textTransform: 'none' }}
          >
            Agregar
          </Button>
          <Button
            variant="contained"
            onClick={handleRemoveRow}
            style={{ backgroundColor: '#dc3545', color: '#fff', textTransform: 'none' }}
          >
            Eliminar Último
          </Button>
        </Grid>

        {/* Encabezados */}
        <Grid container spacing={2} style={{ marginTop: '16px', marginBottom: '16px' }}>
          <Grid item xs={3}>
            <Typography variant="h6" align="center">
              Situación Administrativa
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" align="center">
              Fecha de inicio
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" align="center">
              Fecha de fin
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" align="center">
              Soporte de Descarga
            </Typography>
          </Grid>
        </Grid>

        {/* Filas dinamicas */}
        {rows.map((row, index) => (
          <Grid container spacing={2} key={row.id} alignItems="center" style={{ marginTop: '2px', marginBottom: '2px' }}>
            {/* Situación Administrativa */}
            <Grid item xs={3}>
              <TextField
                fullWidth
                select
                variant="outlined"
                label="Situación Administrativa"
                value={row.cargo ?? ''}
                onChange={(e) => {
                  const selectedCargoId = Number(e.target.value);
                  const updatedRows = [...rows];
                  updatedRows[index].cargo = selectedCargoId;
                  setRows(updatedRows);
                }}
              >
                {cargos.map((cargo) => (
                  <MenuItem key={cargo.ids_admin} value={cargo.ids_admin}>
                    {cargo.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Fecha Inicio */}
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="Fecha Inicio"
                type="date"
                value={row.fecha_inicio ?? ''}
                onChange={(e) => {
                  const updatedRows = [...rows];
                  updatedRows[index].fecha_inicio = e.target.value;
                  setRows(updatedRows);
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Fecha Fin */}
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="Fecha Fin"
                type="date"
                value={row.fecha_fin ?? ''}
                onChange={(e) => {
                  const updatedRows = [...rows];
                  updatedRows[index].fecha_fin = e.target.value;
                  setRows(updatedRows);
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Soporte */}
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="Enlace de Google Drive"
                variant="outlined"
                value={typeof row.soporte === 'string' ? row.soporte : ''}
                onChange={(e) => {
                  const updatedRows = [...rows];
                  updatedRows[index].soporte = e.target.value;
                  setRows(updatedRows);
                }}
                style={{ marginBottom: '8px' }}
              />
              <Button
                variant="outlined"
                component="label"
                fullWidth
                style={{ textTransform: 'none' }}
              >
                Subir Soporte
                <input
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const updatedRows = [...rows];
                      updatedRows[index].soporte = file;
                      setRows(updatedRows);
                    }
                  }}
                />
              </Button>
              {row.soporte && typeof row.soporte !== 'string' && (
                <Typography variant="body2" style={{ marginTop: '8px', textAlign: 'center' }}>
                  {row.soporte.name}
                </Typography>
              )}
            </Grid>
          </Grid>
        ))}

        {/* Botones de acción */}
        <Grid container spacing={2} style={{ marginTop: '16px' }}>
          <Grid container spacing={2} style={{ marginTop: '16px' }} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <Button variant="contained" color="success" fullWidth onClick={handleFinalizar} disabled={!isFormValid()}>
                Finalizar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default ECSituacionesAPage;

'use client';

import React, { useState, useEffect } from 'react';
import { Grid, Typography, TextField, Button, MenuItem } from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

interface Cargo {
  id_fe: number;
  nombre_fe: string;
  porcentaje_max_fe: number;
}

interface Row {
  id: number;
  cargo: number | null;
  porcentaje: number | null;
  soporte: File | string | null;
  soporte2: string | null; // Nuevo campo para el segundo soporte
  enlaceDrive: string | null;
  enlaceDrive2: string | null; // Nuevo campo para el segundo enlace
}

const ECDescargasEPage = () => {
  const [rows, setRows] = useState<Row[]>([
    { id: 1, cargo: null, porcentaje: null, soporte: null, soporte2: '', enlaceDrive: '', enlaceDrive2: '' },
  ]);
  const [profesores, setProfesores] = useState<{ id: number; nombre: string; numero_doc: string }[]>([]);
  const [profesorSeleccionado, setProfesorSeleccionado] = useState<string>('');
  const [cargos, setCargos] = useState<Cargo[]>([]);

  // Cargar datos de la API de profesores
  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const response = await fetch('/api/profesores');
        if (!response.ok) throw new Error('Error al obtener los profesores');
        const data = await response.json();
        setProfesores(data);
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
        const response = await fetch('/api/ec_d_e');
        if (!response.ok) throw new Error('Error al obtener los cargos');
        const data = await response.json();
        setCargos(data);
      } catch (error) {
        console.error('Error al obtener los cargos:', error);
      }
    };

    fetchCargos();
  }, []);

  // Función para agregar filas
  const handleAddRow = () => {
    setRows([
      ...rows,
      { id: rows.length + 1, cargo: null, porcentaje: null, soporte: null, soporte2: '', enlaceDrive: '', enlaceDrive2: '' },
    ]);
  };

  // Función para eliminar la última fila
  const handleRemoveRow = () => {
    if (rows.length > 1) {
      setRows(rows.slice(0, -1));
    }
  };

  // Validación de formulario
  const isFormValid = () => {
    return rows.every((row) => row.cargo && (row.soporte || row.enlaceDrive));
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
          let soporteValue = row.soporte;
          let soporte2Value = row.soporte2;

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
              soporteValue = filePath;
            } catch (error) {
              console.error('Error al subir archivo:', error);
              alert('Error al subir archivo: ' + (error as Error).message);
              return row;
            }
          } else if (row.enlaceDrive) {
            soporteValue = row.enlaceDrive;
          }

          // soporte2 toma el valor de enlaceDrive2 si existe
          if (row.enlaceDrive2) {
            soporte2Value = row.enlaceDrive2;
          } else {
            soporte2Value = '';
          }

          return { ...row, soporte: soporteValue, soporte2: soporte2Value };
        })
      );

      // Enviar datos a la API con el porcentaje y soporte2
      const response = await fetch('/api/d_exten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profesor: profesorSeleccionado,
          periodo: '2025-1',
          rows: rowsWithFilePaths.map(row => ({
            cargo: row.cargo,
            porcentaje: row.porcentaje,
            soporte: row.soporte,
            soporte2: row.soporte2 // Enviar soporte2
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar las descargas');
      }

      alert('Descargas guardadas exitosamente');
      setProfesorSeleccionado('');
      setRows([{ id: 1, cargo: null, porcentaje: null, soporte: null, soporte2: '', enlaceDrive: '', enlaceDrive2: '' }]);
    } catch (error) {
      console.error('Error al guardar las descargas:', error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Hubo un problema al guardar las descargas');
      }
    }
  };

  return (
    <DashboardCard title="Crear Descargas Académicas">
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
            onChange={(e) => setProfesorSeleccionado(e.target.value)}
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
          <Grid item xs={4}>
            <Typography variant="h6" align="center">
              Actividad de
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" align="center">
              Porcentaje Descarga
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" align="center">
              Soporte de Descarga
            </Typography>
          </Grid>
        </Grid>

        {/* Filas dinámicas */}
        {rows.map((row, index) => (
          <Grid container spacing={2} key={row.id} alignItems="center" style={{ marginTop: '2px', marginBottom: '2px' }}>
            {/* Cargos */}
            <Grid item xs={4}>
              <TextField
                fullWidth
                select
                variant="outlined"
                label="Cargo"
                value={row.cargo ?? ''}
                onChange={(e) => {
                  const selectedCargoId = Number(e.target.value);
                  const foundCargo = cargos.find((cargo) => cargo.id_fe === selectedCargoId);
                  const updatedRows = [...rows];
                  updatedRows[index].cargo = selectedCargoId;
                  updatedRows[index].porcentaje = null;
                  setRows(updatedRows);
                }}
              >
                {cargos.map((cargo) => (
                  <MenuItem key={cargo.id_fe} value={cargo.id_fe}>
                    {cargo.nombre_fe}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Porcentaje */}
            <Grid item xs={4}>
              <TextField
                fullWidth
                variant="outlined"
                type="number"
                label="Porcentaje"
                value={row.porcentaje ?? ''}
                onChange={(e) => {
                  const newValue = Number(e.target.value);
                  if (newValue >= 0 && newValue <= (cargos.find(cargo => cargo.id_fe === row.cargo)?.porcentaje_max_fe ?? 100)) {
                    const updatedRows = [...rows];
                    updatedRows[index].porcentaje = newValue;
                    setRows(updatedRows);
                  } else {
                    alert(`El porcentaje máximo de descarga permitido para este cargo es ${(cargos.find(cargo => cargo.id_fe === row.cargo)?.porcentaje_max_fe ?? 100)}%`);
                  }
                }}
                inputProps={{
                  min: 0,
                  max: cargos.find(cargo => cargo.id_fe === row.cargo)?.porcentaje_max_fe ?? 100,
                }}
              />
            </Grid>

            {/* Soporte */}
            <Grid item xs={4}>
              {/* Enlace Google Drive - Soporte 1 */}
              <TextField
                fullWidth
                variant="outlined"
                label="Enlace Google Drive - Soporte 1"
                value={row.enlaceDrive ?? ''}
                onChange={(e) => {
                  const updatedRows = [...rows];
                  updatedRows[index].enlaceDrive = e.target.value;
                  updatedRows[index].soporte = null;
                  setRows(updatedRows);
                }}
                disabled={row.soporte !== null}
              />
              {/* Enlace Google Drive - Soporte 2 */}
              <TextField
                fullWidth
                variant="outlined"
                label="Enlace Google Drive - Soporte 2"
                value={row.enlaceDrive2 ?? ''}
                onChange={(e) => {
                  const updatedRows = [...rows];
                  updatedRows[index].enlaceDrive2 = e.target.value;
                  updatedRows[index].soporte2 = e.target.value; // Actualiza soporte2 con el valor de enlaceDrive2
                  setRows(updatedRows);
                }}
                disabled={row.soporte !== null}
              />
              <Button
                variant="outlined"
                component="label"
                fullWidth
                style={{ textTransform: 'none', marginTop: '8px' }}
                disabled={row.enlaceDrive !== ''}
              >
                Subir Archivo
                <input
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const updatedRows = [...rows];
                      updatedRows[index].soporte = file;
                      updatedRows[index].enlaceDrive = '';
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
        <Grid container spacing={2} style={{ marginTop: '16px' }} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="success" fullWidth onClick={handleFinalizar} disabled={!isFormValid()}>
              Finalizar
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default ECDescargasEPage;
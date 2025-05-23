'use client';

import React, { useState, useEffect } from 'react';
import { Grid, Typography, TextField, Button, MenuItem } from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

interface Cargo {
  id_fi: number;
  nombre_fi: string;
  porcentaje_max_fi: number;
}

interface Row {
  id: number;
  cargo: number | null;
  porcentaje: number | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  soporte: File | string | null;
  googleDriveLink: string | null;
  soporte2: string | null;       // Nuevo campo para el segundo soporte
  enlaceDrive2: string | null;   // Nuevo campo para el segundo enlace
}

const ECDescargasIPage = () => {
  const [rows, setRows] = useState<Row[]>([
    { id: 1, cargo: null, porcentaje: null, fecha_inicio: null, fecha_fin: null, soporte: null, googleDriveLink: '', soporte2: '', enlaceDrive2: '' },
  ]);
  const [profesores, setProfesores] = useState<{ id: number; nombre: string; numero_doc: string }[]>([]);
  const [profesorSeleccionado, setProfesorSeleccionado] = useState<string>('');
  const [cargos, setCargos] = useState<Cargo[]>([]);

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

  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const response = await fetch('/api/ec_d_i');
        if (!response.ok) throw new Error('Error al obtener los cargos');
        const data = await response.json();
        setCargos(data);
      } catch (error) {
        console.error('Error al obtener los cargos:', error);
      }
    };

    fetchCargos();
  }, []);

  const handleAddRow = () => {
    setRows([
      ...rows,
      { id: rows.length + 1, cargo: null, porcentaje: null, fecha_inicio: null, fecha_fin: null, soporte: null, googleDriveLink: '', soporte2: '', enlaceDrive2: '' },
    ]);
  };

  const handleRemoveRow = () => {
    if (rows.length > 1) {
      setRows(rows.slice(0, -1));
    }
  };

  const isFormValid = () => {
    return rows.every((row) => row.cargo && (row.soporte || row.googleDriveLink));
  };

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
          } else if (row.googleDriveLink) {
            soporteValue = row.googleDriveLink;
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

      const response = await fetch('/api/d_inves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profesor: profesorSeleccionado,
          periodo: '2025-1',
          rows: rowsWithFilePaths.map((row) => ({
            cargo: row.cargo,
            porcentaje: row.porcentaje,
            fecha_inicio: row.fecha_inicio,
            fecha_fin: row.fecha_fin,
            soporte: row.soporte,
            soporte2: row.soporte2, // Enviar soporte2
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar las descargas');
      }

      alert('Descargas guardadas exitosamente');
      setProfesorSeleccionado('');
      setRows([
        { id: 1, cargo: null, porcentaje: null, fecha_inicio: null, fecha_fin: null, soporte: null, googleDriveLink: '', soporte2: '', enlaceDrive2: '' },
      ]);
    } catch (error) {
      console.error('Error al guardar las descargas:', error);
      alert(error instanceof Error ? error.message : 'Hubo un problema al guardar las descargas');
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
          <Grid item xs={2}>
            <Typography variant="h6" align="center">Actividad de</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="h6" align="center">Porcentaje Descarga</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="h6" align="center">Fecha de inicio</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="h6" align="center">Fecha de fin</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" align="center">Soporte de Descarga</Typography>
          </Grid>
        </Grid>

        {/* Filas dinámicas */}
        {rows.map((row, index) => (
          <Grid container spacing={2} key={row.id} alignItems="center" style={{ marginTop: '2px', marginBottom: '2px' }}>
            <Grid item xs={2}>
              <TextField
                fullWidth
                select
                variant="outlined"
                label="Cargo"
                value={row.cargo ?? ''}
                onChange={(e) => {
                  const selectedCargoId = Number(e.target.value);
                  const updatedRows = [...rows];
                  updatedRows[index].cargo = selectedCargoId;
                  updatedRows[index].porcentaje = null;
                  setRows(updatedRows);
                }}
              >
                {cargos.map((cargo) => (
                  <MenuItem key={cargo.id_fi} value={cargo.id_fi}>
                    {cargo.nombre_fi}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={2}>
              <TextField
                fullWidth
                variant="outlined"
                type="number"
                label="Porcentaje"
                value={row.porcentaje ?? ''}
                onChange={(e) => {
                  const newValue = Number(e.target.value);
                  if (newValue >= 0 && newValue <= (cargos.find(cargo => cargo.id_fi === row.cargo)?.porcentaje_max_fi ?? 100)) {
                    const updatedRows = [...rows];
                    updatedRows[index].porcentaje = newValue;
                    setRows(updatedRows);
                  } else {
                    alert(`El porcentaje máximo de descarga permitido para este cargo es de ${cargos.find(cargo => cargo.id_fi === row.cargo)?.porcentaje_max_fi ?? 100}%`);
                  }
                }}
                inputProps={{
                  min: 0,
                  max: cargos.find(cargo => cargo.id_fi === row.cargo)?.porcentaje_max_fi ?? 100,
                }}
              />
            </Grid>

            <Grid item xs={2}>
              <TextField
                fullWidth
                type="date"
                variant="outlined"
                label="Fecha de inicio"
                InputLabelProps={{ shrink: true }}
                value={row.fecha_inicio ?? ''}
                onChange={(e) => {
                  const updatedRows = [...rows];
                  updatedRows[index].fecha_inicio = e.target.value;
                  setRows(updatedRows);
                }}
              />
            </Grid>

            <Grid item xs={2}>
              <TextField
                fullWidth
                type="date"
                variant="outlined"
                label="Fecha de fin"
                InputLabelProps={{ shrink: true }}
                value={row.fecha_fin ?? ''}
                onChange={(e) => {
                  const updatedRows = [...rows];
                  updatedRows[index].fecha_fin = e.target.value;
                  setRows(updatedRows);
                }}
              />
            </Grid>

            <Grid item xs={4}>
              <Grid container spacing={1} justifyContent="center" alignItems="center">
                {/* Campo de archivo */}
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    style={{ textTransform: 'none' }}
                    disabled={row.googleDriveLink !== ''}
                  >
                    Soporte (Archivo)
                    <input
                      type="file"
                      accept=".pdf"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const updatedRows = [...rows];
                          updatedRows[index].soporte = file;
                          updatedRows[index].googleDriveLink = '';
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

                {/* Campo de enlace Google Drive */}
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Enlace Google Drive"
                    value={row.googleDriveLink ?? ''}
                    onChange={(e) => {
                      const updatedRows = [...rows];
                      updatedRows[index].googleDriveLink = e.target.value;
                      updatedRows[index].soporte = null;
                      setRows(updatedRows);
                    }}
                    disabled={row.soporte !== null}
                  />
                </Grid>
                {/* Campo de enlace Google Drive 2 */}
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Enlace Google Drive 2"
                    value={row.enlaceDrive2 ?? ''}
                    onChange={(e) => {
                      const updatedRows = [...rows];
                      updatedRows[index].enlaceDrive2 = e.target.value;
                      updatedRows[index].soporte2 = e.target.value; // Actualiza soporte2 con el valor de enlaceDrive2
                      setRows(updatedRows);
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ))}

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

export default ECDescargasIPage;
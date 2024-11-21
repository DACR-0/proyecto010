'use client';

import React, { useState, useEffect } from 'react';
import { Grid, Typography, TextField, Button, MenuItem } from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

interface Cargo {
  nombre_cargo: string;
  porcentaje: number;
}

interface Row {
  id: number;
  cargo: string;
  porcentaje: number | null;
  soporte: string | null;
}

const ECDescargasAPage = () => {
  const [rows, setRows] = useState<Row[]>([
    { id: 1, cargo: '', porcentaje: null, soporte: null },
  ]);
  const [profesores, setProfesores] = useState<{ id: number; nombre: string }[]>([]);
  const [profesorSeleccionado, setProfesorSeleccionado] = useState<string>('');
  const [cargos, setCargos] = useState<Cargo[]>([]);

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
        const response = await fetch('/api/ec_d_a');
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
    setRows([...rows, { id: rows.length + 1, cargo: '', porcentaje: null, soporte: null }]);
  };

  // Función para eliminar la última fila
  const handleRemoveRow = () => {
    if (rows.length > 1) {
      setRows(rows.slice(0, -1));
    }
  };

  return (
    <DashboardCard title="Editar y Crear Descargas Académicas">
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
              <MenuItem key={profesor.id} value={profesor.nombre}>
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
            Agregar Cargo
          </Button>
          <Button
            variant="contained"
            onClick={handleRemoveRow}
            style={{ backgroundColor: '#dc3545', color: '#fff', textTransform: 'none' }}
          >
            Eliminar Último Cargo
          </Button>
        </Grid>

        {/* Encabezados */}
        <Grid container spacing={2} style={{ marginTop: '16px' }}>
          <Grid item xs={4}>
            <Typography variant="subtitle1" align="center">
              Cargos
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1" align="center">
              Porcentaje Descarga
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1" align="center">
              Soporte de Descarga
            </Typography>
          </Grid>
        </Grid>

        {/* Filas dinámicas */}
        {rows.map((row, index) => (
          <Grid container spacing={2} key={row.id} alignItems="center">
            {/* Cargos */}
            <Grid item xs={4}>
              <TextField
                fullWidth
                select
                variant="outlined"
                label="Cargo"
                value={row.cargo}
                onChange={(e) => {
                  const selectedCargo = e.target.value;
                  const foundCargo = cargos.find((cargo) => cargo.nombre_cargo === selectedCargo);

                  const updatedRows = [...rows];
                  updatedRows[index].cargo = selectedCargo;
                  updatedRows[index].porcentaje = foundCargo ? foundCargo.porcentaje : null;
                  setRows(updatedRows);
                }}
              >
                {cargos.map((cargo) => (
                  <MenuItem key={cargo.nombre_cargo} value={cargo.nombre_cargo}>
                    {cargo.nombre_cargo}
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
                InputProps={{ readOnly: true }}
              />
            </Grid>

            {/* Soporte */}
            <Grid item xs={4}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                style={{ textTransform: 'none' }}
              >
                Soporte
                <input
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const updatedRows = [...rows];
                      updatedRows[index].soporte = file.name;
                      setRows(updatedRows);
                    }
                  }}
                />
              </Button>
              {row.soporte && (
                <Typography variant="body2" style={{ marginTop: '8px', textAlign: 'center' }}>
                  {row.soporte}
                </Typography>
              )}
            </Grid>
          </Grid>
        ))}

        {/* Botones de acción */}
        <Grid container spacing={2} style={{ marginTop: '16px' }}>
          <Grid item xs={6}>
            <Button variant="contained" color="success" fullWidth>
              Finalizar
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" color="error" fullWidth>
              Cancelar
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default ECDescargasAPage;


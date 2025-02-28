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
  cargo: number | null; // Ahora es un número (id_fi) en vez de string
  porcentaje: number | null;
  soporte: File | null;
}

const ECDescargasIPage = () => {
  const [rows, setRows] = useState<Row[]>([
    { id: 1, cargo: null, porcentaje: null, soporte: null },
  ]);
  const [profesores, setProfesores] = useState<{ id: number; nombre: string; numero_doc: string }[]>([]);
  const [profesorSeleccionado, setProfesorSeleccionado] = useState<string>(''); // Ahora guardará el numero_doc
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
        const response = await fetch('/api/ec_d_i');
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
    setRows([...rows, { id: rows.length + 1, cargo: null, porcentaje: null, soporte: null }]);
  };

  // Función para eliminar la última fila
  const handleRemoveRow = () => {
    if (rows.length > 1) {
      setRows(rows.slice(0, -1));
    }
  };

  // Validación de formulario
  const isFormValid = () => {
    // Verificar si todas las filas tienen un cargo y un archivo adjunto
    return rows.every((row) => row.cargo && row.soporte);
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
          if (row.soporte instanceof File) { // Validar que es un archivo
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
              return { ...row, soporte: filePath }; // Asegúrate de incluir el porcentaje en el objeto
            } catch (error) {
              console.error('Error al subir archivo:', error);
              alert('Error al subir archivo: ' + (error as Error).message);
              return row; // Devolver la fila original sin modificar
            }
          }
          return row;
        })
      );
  
      // Enviar datos a la API con el porcentaje
      const response = await fetch('/api/d_inves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profesor: profesorSeleccionado,
          periodo: '2025-1',
          rows: rowsWithFilePaths.map(row => ({
            cargo: row.cargo,
            porcentaje: row.porcentaje, // Asegúrate de enviar el porcentaje
            soporte: row.soporte
          })),
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar las descargas');
      }
  
      const result = await response.json();
      alert('Descargas guardadas exitosamente');
  
      // Resetear el formulario
      setProfesorSeleccionado('');
      setRows([{ id: 1, cargo: null, porcentaje: null, soporte: null }]);
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
                  const selectedCargoId = Number(e.target.value); // Seleccionar el id_fa
                  const foundCargo = cargos.find((cargo) => cargo.id_fi === selectedCargoId);
                  const updatedRows = [...rows];
                  updatedRows[index].cargo = selectedCargoId; // Guardamos el id_fa
                  updatedRows[index].porcentaje = null; // Establecer el porcentaje como null para que el usuario lo edite
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

                  // Aseguramos que el nuevo valor esté entre 0 y el valor máximo
                  if (newValue >= 0 && newValue <= (cargos.find(cargo => cargo.id_fi === row.cargo)?.porcentaje_max_fi ?? 100)) {
                    const updatedRows = [...rows];
                    updatedRows[index].porcentaje = newValue;
                    setRows(updatedRows);
                  } else {
                    // Si el valor está fuera de rango, simplemente no se hace nada
                    alert(`El porcentaje maximo de descarga permitido para este cargo es de ${cargos.find(cargo => cargo.id_fi === row.cargo)?.porcentaje_max_fi ?? 100}%`);
                  }
                }}
                inputProps={{
                  min: 0, // Establecer mínimo permitido en 0
                  max: cargos.find(cargo => cargo.id_fi === row.cargo)?.porcentaje_max_fi ?? 100, // Establecer máximo permitido según el cargo
                }}
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
                      updatedRows[index].soporte = file;
                      setRows(updatedRows);
                    }
                  }}
                />
              </Button>
              {row.soporte && (
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

export default ECDescargasIPage;
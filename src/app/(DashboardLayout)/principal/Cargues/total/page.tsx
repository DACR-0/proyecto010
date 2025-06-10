"use client";
import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Typography, Box, MenuItem, Select, FormControl, InputLabel, Divider } from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const CtotalPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [serverResponse, setServerResponse] = useState<any>(null); // Para guardar la respuesta del servidor
  const [year, setYear] = useState('');
  const [period, setPeriod] = useState('');
  const [years, setYears] = useState<string[]>([]);
  const [periods, setPeriods] = useState<string[]>([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch('/api/historico/filters');
        const { years, periods } = await res.json();
        setYears(years);
        setPeriods(periods);
        setYear(years[0] || '');
        setPeriod(periods[0] || '');
      } catch (err) {
        console.error('Error al cargar filtros:', err);
      }
    };
    fetchFilters();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  const EXPRESS_API_URL = process.env.NEXT_PUBLIC_EXPRESS_API_URL;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor selecciona un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError(null); // Resetea cualquier error previo
    setSuccess(false);
    setServerResponse(null); // Resetea la respuesta del servidor

    try {
      // 1. Enviar el DELETE al API de Next.js antes de la inserción
      const deleteResponse = await fetch('/api/historico/eliminar', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ anno: year, per: period }), // Enviar los valores de año y periodo
      });

      const deleteResult = await deleteResponse.json();
      if (!deleteResult.success) {
        setError(deleteResult.message); // Mostrar error si el DELETE falla
        return;
      }

      // 2. Procesar el archivo
      const response = await fetch(`${EXPRESS_API_URL}/historicojson`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Hubo un error al subir el archivo');
      }

      const data = await response.json();
      setServerResponse(data); // Guardar la respuesta del servidor (datos procesados)
      setSuccess(true);

      // console.log('Datos procesados desde el servidor:', data);

      // 3. Enviar los datos al API de Next.js para hacer el insert en la base de datos
      const insertResponse = await fetch('/api/historico/insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: data.data }), // Enviar los datos procesados
      });

      const insertResult = await insertResponse.json();
      if (insertResult.success) {
        console.log('Datos insertados correctamente');
      } else {
        setError(insertResult.message); // Mostrar mensaje de error si algo falla en la inserción
      }

    } catch (error: any) {
      console.error('Error en la carga del archivo:', error.message);
      setError(error.message); // Muestra el error si ocurre uno
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardCard title="Cargar Plantilla - Base de Programacion academica">
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 120, marginRight: 2 }}>
            <InputLabel>Año</InputLabel>
            <Select value={year} onChange={(e) => setYear(e.target.value)}>
              {years.map((y) => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120, marginRight: 2 }}>
            <InputLabel>Periodo</InputLabel>
            <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
              {periods.map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <Divider sx={{ my: 2 }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,  // Espacio entre los elementos
            mt: 4,   // Margen superior
          }}
        >
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              style={{ marginBottom: '24px' }}  // Espacio entre el input y el botón
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth  // Asegura que el botón ocupe todo el ancho disponible
            >
              {loading ? <CircularProgress size={24} color="secondary" /> : 'Subir Archivo'}
            </Button>
          </form>

          {error && <Typography color="error" align="center">{error}</Typography>}
          {success && !error && <Typography color="primary" align="center">Archivo subido exitosamente!</Typography>}
          
        </Box>
      </div>
    </DashboardCard>
  );
};

export default CtotalPage;

"use client";
import React, { useState } from 'react';
import { Button, CircularProgress, Typography, Box, Divider } from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const MODPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [serverResponse, setServerResponse] = useState<any>(null); // Para guardar la respuesta del servidor

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
      // Enviar el archivo al servidor Express para procesarlo
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

      // Log para revisar lo que llegó del servidor
      console.log('Datos procesados desde el servidor:', data);

      // Ahora enviar los datos al API de Next.js para hacer el insert en la base de datos
      const insertResponse = await fetch('/api/modificaciones/insert', {
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
    <DashboardCard title="Cargar Plantilla - Modificaciones - Disminuciones">
      <div>
      <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,  // Espacio entre los elementos
            mt: 4,   // Margen superior
          }}
        >
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              style={{ marginBottom: '16px' }}  // Espacio entre el input y el botón
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

          {/* Mostrar la respuesta del servidor si está disponible */}
          {serverResponse && (
            <Box mt={2}>
              <Typography variant="h6" align="center">
                Respuesta del Servidor (Datos Procesados):
              </Typography>
              <pre>{JSON.stringify(serverResponse, null, 2)}</pre> {/* Formato bonito para la respuesta */}
            </Box>
          )}
        </Box>
      </div>
    </DashboardCard>

  );
};

export default MODPage; 

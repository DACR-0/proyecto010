'use client';
import { useEffect, useState } from 'react';
import { Typography, Grid, Card, CardContent } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import Image from "next/image";

const SamplePage = () => {
  // Estados para almacenar los datos de la API
  const [horasCatedra, setHorasCatedra] = useState(null);
  const [horasPlanta, setHorasPlanta] = useState(null);
  const [horasOcasionales, setHorasOcasionales] = useState(null);
  const [horasHonorarios, setHorasHonorarios] = useState(null);
  const [horasTotal, setHorasTotal] = useState(null);

  useEffect(() => {
    // Función para obtener los datos de la API
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/dashboard'); // Asegúrate de que la URL sea correcta
        const data = await response.json();
        
        // Asignamos los datos a los estados correspondientes
        setHorasCatedra(data[0].horas_catedra);
        setHorasPlanta(data[0].horas_planta);
        setHorasOcasionales(data[0].horas_ocasionales);
        setHorasHonorarios(data[0].horas_honorarios);
        setHorasTotal(data[0].horas_total);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  return (
    <PageContainer title="Sample Page" description="this is Sample page">
      
        <Typography variant="h6" gutterBottom>
          Resultados de Horas
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="body1">Horas Cátedra: {horasCatedra ?? 'Cargando...'}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="body1">Horas Planta: {horasPlanta ?? 'Cargando...'}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="body1">Horas Ocasionales: {horasOcasionales ?? 'Cargando...'}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="body1">Horas Honorarios: {horasHonorarios ?? 'Cargando...'}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="body1">Total Horas: {horasTotal ?? 'Cargando...'}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      
    </PageContainer>
  );
};

export default SamplePage;


'use client'
import { Grid, Box, Typography, Fab, Divider } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import SalesOverview from '@/app/(DashboardLayout)/components/dashboard/SalesOverview';
import MonthlyEarnings from '@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { IconClock, IconUsers } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  // Estados para almacenar los datos de la API
    const [horasCatedra, setHorasCatedra] = useState(null);
    const [horasPlanta, setHorasPlanta] = useState(null);
    const [horasOcasionales, setHorasOcasionales] = useState(null);
    const [horasHonorarios, setHorasHonorarios] = useState(null);
    const [horasTotal, setHorasTotal] = useState(null);

    const [docente_catedra, setDocente_catedra] = useState(null);
    const [docente_planta, setDocente_planta] = useState(null);
    const [docente_ocasional, seDocente_ocasional] = useState(null);
    const [personal_admin, setPersonal_admin] = useState(null);
    const [pensionados, setpensionados] = useState(null);
    const [total_docentes, setTotal_docentes] = useState(null);
    const [s_admin, setS_admin] = useState(null);
  
    useEffect(() => {
      // Función para obtener los datos de la API
      const fetchData = async () => {
        try {
          const response = await fetch('/api/dashboard'); // Asegúrate de que la URL sea correcta
          const data = await response.json();
          
          // Asignamos los datos a los estados correspondientes
          setHorasCatedra(data[0].horas_catedra);
          setHorasPlanta(data[0].horas_planta);
          setHorasOcasionales(data[0].horas_ocasionales);
          setHorasHonorarios(data[0].horas_honorarios);
          setHorasTotal(data[0].horas_total);
          setDocente_catedra(data[0].docente_catedra);
          setDocente_planta(data[0].docente_planta);
          seDocente_ocasional(data[0].docente_ocasional);
          setPersonal_admin(data[0].personal_admin);
          setpensionados(data[0].pensionados);
          setTotal_docentes(data[0].total_docentes);
          setS_admin(data[0].s_admin);
          
        } catch (error) {
          console.error('Error al obtener los datos:', error);
        }
      };
  
      fetchData();
    }, []); // Solo se ejecuta una vez cuando el componente se monta
  // incluir <SalesOverview />
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={3} justifyContent="center" sx={{ mb: 4, alignItems: 'stretch' }}> {/* Asegura que las tarjetas se estiren */}

          {/* Fila 1 */}
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard title="TOTAL HORAS DE CATEDRA" sx={{
              height: '100%',
              background: 'linear-gradient(to bottom,rgb(233, 244, 255), #ffffff)',  // Azul mucho más claro
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'  // Sombra sutil
            }}>
              <Box display="flex" alignItems="center">
                <Fab color="primary" size="medium" sx={{ backgroundColor: '#5d87ff', color: '#ffffff' }}>
                  <IconClock size={30} color="#ffffff" />
                </Fab>
                <Typography variant="h6" sx={{ ml: 1 }}>{horasCatedra ?? 'Cargando...'}</Typography>
              </Box>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard title="TOTAL HORAS DE PLANTA" sx={{
              height: '100%',
              background: 'linear-gradient(to bottom,rgb(233, 244, 255), #ffffff)',  // Azul mucho más claro
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'  // Sombra sutil
            }}>
              <Box display="flex" alignItems="center">
                <Fab color="primary" size="medium" sx={{ backgroundColor: '#5d87ff', color: '#ffffff' }}>
                  <IconClock size={30} color="#ffffff" />
                </Fab>
                <Typography variant="h6" sx={{ ml: 1 }}>{horasPlanta ?? 'Cargando...'}</Typography>
              </Box>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard title="TOTAL HORAS OCASIONALES" sx={{
              height: '100%',
              background: 'linear-gradient(to bottom,rgb(233, 244, 255), #ffffff)',  // Azul mucho más claro
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'  // Sombra sutil
            }}>
              <Box display="flex" alignItems="center">
                <Fab color="primary" size="medium" sx={{ backgroundColor: '#5d87ff', color: '#ffffff' }}>
                  <IconClock size={30} color="#ffffff" />
                </Fab>
                <Typography variant="h6" sx={{ ml: 1 }}>{horasOcasionales ?? 'Cargando...'}</Typography>
              </Box>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard title="TOTAL HORAS POR HONORARIOS" sx={{
              height: '100%',
              background: 'linear-gradient(to bottom,rgb(233, 244, 255), #ffffff)',  // Azul mucho más claro
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'  // Sombra sutil
            }}>
              <Box display="flex" alignItems="center">
                <Fab color="primary" size="medium" sx={{ backgroundColor: '#5d87ff', color: '#ffffff' }}>
                  <IconClock size={30} color="#ffffff" />
                </Fab>
                <Typography variant="h6" sx={{ ml: 1 }}>{horasHonorarios ?? 'Cargando...'}</Typography>
              </Box>
            </DashboardCard>
          </Grid>
        </Grid>
        {/* Otros contenidos */}
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
            <Box
                component="img"
                src="http://localhost:4000/cronograma/2025-1.png"
                alt="Cronograma 2025"
                sx={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                }}
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <DashboardCard title="TOTAL DE HORAS" sx={{
                    height: '100%',
                    background: 'linear-gradient(to bottom,rgb(233, 244, 255), #ffffff)',  // Azul mucho más claro
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'  // Sombra sutil
                  }}>
                    <Box display="flex" alignItems="center">
                      <Fab color="primary" size="medium" sx={{ backgroundColor: '#5d87ff', color: '#ffffff' }}>
                        <IconClock size={30} color="#ffffff" />
                      </Fab>
                      <Typography variant="h6" sx={{ ml: 1 }}>{horasTotal ?? 'Cargando...'}</Typography>
                    </Box>
                  </DashboardCard>
                </Grid>
                <Grid item xs={12}>
                  <MonthlyEarnings />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
        </Box>

        <Grid container spacing={3} justifyContent="center" sx={{ mb: 4, alignItems: 'stretch' }}>
          {/* Fila 2 */}
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard title="TOTAL PROFESORES CATEDRA" sx={{
              height: '100%',
              background: 'linear-gradient(to bottom,rgb(233, 244, 255), #ffffff)',  // Azul mucho más claro
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'  // Sombra sutil
            }}>
              <Box display="flex" alignItems="center">
                <Fab color="primary" size="medium" sx={{ backgroundColor: '#5d87ff', color: '#ffffff' }}>
                  <IconUsers size={30} color="#ffffff" />
                </Fab>
                <Typography variant="h6" sx={{ ml: 1 }}>{docente_catedra ?? 'Cargando...'}</Typography>
              </Box>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard title="TOTAL PROFESORES PLANTA" sx={{
              height: '100%',
              background: 'linear-gradient(to bottom,rgb(233, 244, 255), #ffffff)',  // Azul mucho más claro
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'  // Sombra sutil
            }}>
              <Box display="flex" alignItems="center">
                <Fab color="primary" size="medium" sx={{ backgroundColor: '#5d87ff', color: '#ffffff' }}>
                  <IconUsers size={30} color="#ffffff" />
                </Fab>
                <Typography variant="h6" sx={{ ml: 1 }}>{docente_planta ?? 'Cargando...'}</Typography>
              </Box>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard title="TOTAL PROFESORES OCASIONALES" sx={{
              height: '100%',
              background: 'linear-gradient(to bottom,rgb(233, 244, 255), #ffffff)',  // Azul mucho más claro
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'  // Sombra sutil
            }}>
              <Box display="flex" alignItems="center">
                <Fab color="primary" size="medium" sx={{ backgroundColor: '#5d87ff', color: '#ffffff' }}>
                  <IconUsers size={30} color="#ffffff" />
                </Fab>
                <Typography variant="h6" sx={{ ml: 1 }}>{docente_ocasional ?? 'Cargando...'}</Typography>
              </Box>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard title="TOTAL PROFESORES PERSONAL ADMINISTRATIVOS" sx={{
              height: '100%',
              background: 'linear-gradient(to bottom,rgb(233, 244, 255), #ffffff)',  // Azul mucho más claro
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'  // Sombra sutil
            }}>
              <Box display="flex" alignItems="center">
                <Fab color="primary" size="medium" sx={{ backgroundColor: '#5d87ff', color: '#ffffff' }}>
                  <IconUsers size={30} color="#ffffff" />
                </Fab>
                <Typography variant="h6" sx={{ ml: 1 }}>{personal_admin ?? 'Cargando...'}</Typography>
              </Box>
            </DashboardCard>
          </Grid>

          {/* Fila 3 */}
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard title="TOTAL PROFESORES PESIONADOS/JUBILADOS" sx={{
              height: '100%',
              background: 'linear-gradient(to bottom,rgb(233, 244, 255), #ffffff)',  // Azul mucho más claro
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'  // Sombra sutil
            }}>
              <Box display="flex" alignItems="center">
                <Fab color="primary" size="medium" sx={{ backgroundColor: '#5d87ff', color: '#ffffff' }}>
                  <IconUsers size={30} color="#ffffff" />
                </Fab>
                <Typography variant="h6" sx={{ ml: 1 }}>{pensionados ?? 'Cargando...'}</Typography>
              </Box>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard title="TOTAL PROFESORES PROGRAMADOS" sx={{
              height: '100%',
              background: 'linear-gradient(to bottom,rgb(233, 244, 255), #ffffff)',  // Azul mucho más claro
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'  // Sombra sutil
            }}>
              <Box display="flex" alignItems="center">
                <Fab color="primary" size="medium" sx={{ backgroundColor: '#5d87ff', color: '#ffffff' }}>
                  <IconUsers size={30} color="#ffffff" />
                </Fab>
                <Typography variant="h6" sx={{ ml: 1 }}>{total_docentes ?? 'Cargando...'}</Typography>
              </Box>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard title="TOTAL PROFESORES EN SITUACION ADMINISTRATIVA" sx={{
              height: '100%',
              background: 'linear-gradient(to bottom,rgb(233, 244, 255), #ffffff)',  // Azul mucho más claro
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'  // Sombra sutil
            }}>
              <Box display="flex" alignItems="center">
                <Fab color="primary" size="medium" sx={{ backgroundColor: '#5d87ff', color: '#ffffff' }}>
                  <IconUsers size={30} color="#ffffff" />
                </Fab>
                <Typography variant="h6" sx={{ ml: 1 }}>{s_admin ?? 'Cargando...'}</Typography>
              </Box>
            </DashboardCard>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  )
}
export default Dashboard;
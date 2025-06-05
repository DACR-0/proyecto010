'use client';
import {
  Typography, Table, Box,
  TableBody, TableCell,
  TableContainer, TableHead,
  TableRow, Paper, CircularProgress,
  Grid, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, CardContent, Divider
} from '@mui/material';
import { useEffect, useState } from 'react';
import { IconDownload } from '@tabler/icons-react';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import BlankCard from '@/app/(DashboardLayout)/components/shared/BlankCard';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';


const PlantillasPage = () => {

  return (
    <Box>
      <DashboardCard title="1. Plantilla - Docentes (Planta)">
        <Button
          variant="contained"
          startIcon={<IconDownload />}
          component="a"
          href="http://localhost:4000/plantillas/Plantilla-Docentes.xlsx"
          download
          style={{ marginRight: '16px' }}
        >
          DESCARGAR
        </Button>
      </DashboardCard>

      <Divider sx={{ my: 2 }} />

      <DashboardCard title="2. Plantilla - Descargas academicas">
      <Button
          variant="contained"
          startIcon={<IconDownload />}
          component="a"
          href="http://localhost:4000/plantillas/Plantilla-Descargas-academicas.xlsx"
          download
          style={{ marginRight: '16px' }}
        >
          DESCARGAR
        </Button>
      </DashboardCard>

      <Divider sx={{ my: 2 }} />

      <DashboardCard title="3. Plantilla - Base programacion academica">
      <Button
          variant="contained"
          startIcon={<IconDownload />}
          component="a"
          href="http://localhost:4000/plantillas/Plantilla-Base-programacion-academica.xlsx"
          download
          style={{ marginRight: '16px' }}
        >
          DESCARGAR
        </Button>
      </DashboardCard>
      <Divider sx={{ my: 2 }} />
      <DashboardCard title="4. Plantilla - Disminuciones - Modificaciones">
      <Button
          variant="contained"
          startIcon={<IconDownload />}
          component="a"
          href="http://localhost:4000/plantillas/Plantilla-Modificaciones.xlsx"
          download
          style={{ marginRight: '16px' }}
        >
          DESCARGAR
        </Button>
      </DashboardCard>
    </Box>
  );
};

export default PlantillasPage;


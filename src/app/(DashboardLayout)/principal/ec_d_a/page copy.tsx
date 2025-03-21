'use client';

import React, { useState, useEffect } from 'react';
import { Grid, Typography, TextField, Button, MenuItem,Divider } from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const EditAPage = () => {
  
  return (
    <DashboardCard title="Editar Descargas Académicas">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">Descargas de:</Typography>
          <TextField
                fullWidth
                variant="outlined"
                label="Docente"
              />
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2} style={{ marginTop: '16px', marginBottom: '16px' }}>
          <Grid item xs={4}><Typography variant="h6" align="center">Cargos</Typography></Grid>
          <Grid item xs={4}><Typography variant="h6" align="center">Porcentaje Descarga</Typography></Grid>
          <Grid item xs={4}><Typography variant="h6" align="center">Soporte de Descarga</Typography></Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center" style={{ marginTop: '2px', marginBottom: '2px' }}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              variant="outlined"
              type="number"
              label="Porcentaje"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              variant="outlined"
              label="pocentaje de descarga"
            />
          </Grid>
          <Grid item xs={4}>
            {/* Campo para ingresar el enlace de Google Drive solo si no se ha subido un archivo */}
            <TextField
              fullWidth
              variant="outlined"
              label="Enlace Google Drive"
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} style={{ marginTop: '16px' }} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="success" fullWidth /*onClick={}*/>
              Finalizar
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default EditAPage;
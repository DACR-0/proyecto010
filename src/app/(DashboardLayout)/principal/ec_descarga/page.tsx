'use client';

import React from 'react';
import { Grid, Typography, TextField, Button } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const ECDescargasPage = () => {
  return (
    <PageContainer title="ECDescargasPage" description="PÁGINA PARA EDITAR DESCARGAS">
      <DashboardCard title="Editar y Crear descargas Académicas">
        <Grid container spacing={2}>
          {/* Selección del profesor */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Descargas de:
            </Typography>
            <TextField
              fullWidth
              select
              label="Nombre y apellido profesor"
              variant="outlined"
            >
              <option value="Profesor 1">Profesor 1</option>
              <option value="Profesor 2">Profesor 2</option>
              <option value="Profesor 3">Profesor 3</option>
            </TextField>
          </Grid>

          {/* Encabezados */}
          <Grid container spacing={2} style={{ marginTop: '16px' }}>
            {['Cargos', '% Descarga', 'Soporte de Descarga', 'Actividad Investigación', '% Descarga', 'Soporte Investigación', 'Actividad Extensión', '% Descarga', 'Soporte Extensión'].map((label, index) => (
              <Grid item xs={12 / 9} key={index}>
                <Typography variant="subtitle1" align="center">
                  {label}
                </Typography>
              </Grid>
            ))}
          </Grid>

          {/* Filas dinámicas */}
          {[...Array(4)].map((_, index) => (
            <Grid container spacing={2} key={index} alignItems="center">
              {/* Cargos */}
              <Grid item xs={12 / 9}>
                <TextField
                  fullWidth
                  select
                  variant="outlined"
                  placeholder="Cargos"
                >
                  <option value="Cargo 1">Cargo 1</option>
                  <option value="Cargo 2">Cargo 2</option>
                  <option value="Cargo 3">Cargo 3</option>
                </TextField>
              </Grid>

              {/* % Descarga */}
              <Grid item xs={12 / 9}>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="number"
                  placeholder="%"
                />
              </Grid>

              {/* Soporte Descarga */}
              <Grid item xs={12 / 9}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  style={{ textTransform: 'none' }}
                >
                  Soporte
                  <input type="file" hidden />
                </Button>
              </Grid>

              {/* Actividad Investigación */}
              <Grid item xs={12 / 9}>
                <TextField
                  fullWidth
                  select
                  variant="outlined"
                  placeholder="Actividad Investigación"
                >
                  <option value="AI1">AI1</option>
                  <option value="AI2">AI2</option>
                  <option value="AI3">AI3</option>
                </TextField>
              </Grid>

              {/* % Investigación */}
              <Grid item xs={12 / 9}>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="number"
                  placeholder="%"
                />
              </Grid>

              {/* Soporte Investigación */}
              <Grid item xs={12 / 9}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  style={{ textTransform: 'none' }}
                >
                  Soporte
                  <input type="file" hidden />
                </Button>
              </Grid>

              {/* Actividad Extensión */}
              <Grid item xs={12 / 9}>
                <TextField
                  fullWidth
                  select
                  variant="outlined"
                  placeholder="Actividad Extensión"
                >
                  <option value="AE1">AE1</option>
                  <option value="AE2">AE2</option>
                  <option value="AE3">AE3</option>
                </TextField>
              </Grid>

              {/* % Extensión */}
              <Grid item xs={12 / 9}>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="number"
                  placeholder="%"
                />
              </Grid>

              {/* Soporte Extensión */}
              <Grid item xs={12 / 9}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  style={{ textTransform: 'none' }}
                >
                  Soporte
                  <input type="file" hidden />
                </Button>
              </Grid>
            </Grid>
          ))}

          {/* Botones de acción */}
          <Grid container spacing={2} style={{ marginTop: '16px' }}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="success"
                fullWidth
              >
                Finalizar
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="error"
                fullWidth
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </DashboardCard>
    </PageContainer>
  );
};

export default ECDescargasPage;

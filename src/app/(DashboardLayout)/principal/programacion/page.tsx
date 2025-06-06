'use client';

import { Button, Typography, Divider, TextField, Autocomplete, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import React, { useState, useEffect } from 'react';
import { IconSearch } from '@tabler/icons-react';
import * as XLSX from 'xlsx';

interface Profesor {
  docente: string;
  documento?: string;
}

interface Programacion {
  docente: string;
  Pograma: string;
  Cod_Materia: string;
  Curso: string;
  grupo: string;
  semestre: string;
  horas: string;
  tipo_hora: string;
  anno: string;
  per: string;
}

const ProgramacionPage = () => {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [programacion, setProgramacion] = useState<Programacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState<string>('');
  const [documento, setDocumento] = useState<string>('');

  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const response = await fetch('/api/historico/consulta_docente/nombres');
        const data = await response.json();
        setProfesores(data);
      } catch (error) {
        console.error('Error al obtener los profesores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfesores();
  }, []);

  const handleBuscar = async () => {
    if (!docenteSeleccionado && !documento) return;
    setLoading(true);
    try {
      let url = '';
      if (documento) {
        url = `/api/historico/consulta_docente?documento=${documento}`;
      } else {
        url = `/api/historico/consulta_docente?docente=${docenteSeleccionado}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setProgramacion(data);
    } catch (error) {
      console.error('Error al obtener los datos de la programación:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para exportar a Excel
  const exportToExcel = () => {
    if (programacion.length === 0) return;

    const exportData = programacion.map(item => ({
      'Programa': item.Pograma,
      'Materia': item.Cod_Materia,
      'Curso': item.Curso,
      'Grupo': item.grupo,
      'Semestre': item.semestre,
      'Horas': item.horas,
      'Tipo Hora': item.tipo_hora,
      'Año': item.anno,
      'Periodo': item.per,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Programacion');
    XLSX.writeFile(wb, 'programacion_docente.xlsx');
  };

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <PageContainer title="ProgramacionPage" description="Contiene las asignaturas asignadas a docentes">
      <DashboardCard title="Programacion Académica Docentes">
        <Box display="flex" alignItems="center" gap={2}>
          <Autocomplete
            disablePortal
            options={profesores}
            getOptionLabel={(option) => option?.docente ? String(option.docente) : ""}
            sx={{ width: 400 }}
            onChange={(event, value) => {
              setDocenteSeleccionado(value ? value.docente : '');
              setDocumento('');
            }}
            value={docenteSeleccionado ? { docente: docenteSeleccionado } : null}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Nombre y Apellido Docente"
                disabled={!!documento}
              />
            )}
            isOptionEqualToValue={(option, value) => option.docente === value.docente}
          />
          {!docenteSeleccionado && (
            <TextField
              label="Número de documento"
              value={documento}
              onChange={(e) => {
                setDocumento(e.target.value);
                if (e.target.value) setDocenteSeleccionado('');
              }}
              sx={{ width: 250 }}
              type="number"
              disabled={!!docenteSeleccionado}
            />
          )}
          <Button
            variant="contained"
            startIcon={<IconSearch />}
            onClick={handleBuscar}
            style={{ marginRight: '16px' }}
          >
            Buscar
          </Button>
          <Button
            variant="contained" // Cambia a "contained" para igualar el estilo
            color="primary"     // Igual que el de buscar
            onClick={exportToExcel}
            disabled={programacion.length === 0}
            style={{ marginRight: '16px' }} // Opcional, para igualar separación
          >
            Exportar
          </Button>
        </Box>
      </DashboardCard>
      <Divider sx={{ my: 2 }} />

      {programacion.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Programa</TableCell>
                <TableCell>Materia</TableCell>
                <TableCell>Curso</TableCell>
                <TableCell>Grupo</TableCell>
                <TableCell>Semestre</TableCell>
                <TableCell>Horas</TableCell>
                <TableCell>Tipo Hora</TableCell>
                <TableCell>Año</TableCell>
                <TableCell>Periodo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {programacion.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.Pograma}</TableCell>
                  <TableCell>{item.Cod_Materia}</TableCell>
                  <TableCell>{item.Curso}</TableCell>
                  <TableCell>{item.grupo}</TableCell>
                  <TableCell>{item.semestre}</TableCell>
                  <TableCell>{item.horas}</TableCell>
                  <TableCell>{item.tipo_hora}</TableCell>
                  <TableCell>{item.anno}</TableCell>
                  <TableCell>{item.per}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No hay datos disponibles</Typography>
      )}
    </PageContainer>
  );
};

export default ProgramacionPage;
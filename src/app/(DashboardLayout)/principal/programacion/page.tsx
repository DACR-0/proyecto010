'use client';

import { Button, Typography, Divider, TextField, Autocomplete, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import React, { useState, useEffect } from 'react';
import { IconSearch } from '@tabler/icons-react';

interface Profesor {
  docente: string; // Tipo de datos esperado
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
  const [profesores, setProfesores] = useState<Profesor[]>([]); // Definir el tipo de estado
  const [programacion, setProgramacion] = useState<Programacion[]>([]); // Almacena la respuesta de la consulta
  const [loading, setLoading] = useState(true); // Estado de carga
  const [docenteSeleccionado, setDocenteSeleccionado] = useState<string>(''); // Almacena el docente seleccionado

  // Función para obtener los datos de los profesores desde la API
  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const response = await fetch('/api/historico/consulta_docente/nombres'); // Asegúrate de que esta URL sea correcta
        const data = await response.json();
        setProfesores(data); // Establece los profesores en el estado
      } catch (error) {
        console.error('Error al obtener los profesores:', error);
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    fetchProfesores(); // Llama a la función para obtener los datos
  }, []); // Se ejecuta una sola vez cuando el componente se monta

  const handleBuscar = async () => {
    if (!docenteSeleccionado) return; // No hacer nada si no hay docente seleccionado
    setLoading(true);
    try {
      const response = await fetch(`/api/historico/consulta_docente?docente=${docenteSeleccionado}`);
      const data = await response.json();
      setProgramacion(data); // Establece los datos de la programación en el estado
    } catch (error) {
      console.error('Error al obtener los datos de la programación:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Cargando...</Typography>; // Muestra un mensaje mientras se cargan los datos
  }

  return (
    <PageContainer title="ProgramacionPage" description="Contiene las asignaturas asignadas a docentes">
      <DashboardCard title="Programacion Académica Docentes">
        <Box display="flex" alignItems="center" gap={2}> {/* Usamos 'Box' con flexbox */}
          <Autocomplete
            disablePortal
            options={profesores} // Pasamos el arreglo completo de profesores
            getOptionLabel={(option) => option.docente} // Usamos la propiedad 'docente' para mostrar
            sx={{ width: 400 }}
            onChange={(event, value) => setDocenteSeleccionado(value ? value.docente : '')}
            renderInput={(params) => <TextField {...params} label="Nombre y Apellido Docente" />}
          />
          <Button
            variant="contained"
            startIcon={<IconSearch />}
            onClick={handleBuscar} // Llama a la función handleBuscar
            style={{ marginRight: '16px' }} // Espacio entre los botones
          >
            Buscar
          </Button>
        </Box>
      </DashboardCard>
      <Divider sx={{ my: 2 }} />

      {/* Mostrar la tabla con la programación si existen datos */}
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

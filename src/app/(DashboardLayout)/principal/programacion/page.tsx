'use client';
import { useState } from 'react';
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

interface Programacion {
  id: number;
  nombre: string;
  horas: number;
  porcentajeDescarga: string;
  docenciaMinima: number;
  estado: string;
}

const ProgramacionPage = () => {
  const [programacion, setProgramacion] = useState<Programacion[]>([
    { id: 1, nombre: 'nombre profesor 1', horas: 20, porcentajeDescarga: '50%', docenciaMinima: 10, estado: 'ASIGNACIÓN INCOMPLETA' },
    { id: 2, nombre: 'nombre profesor 2', horas: 40, porcentajeDescarga: '50%', docenciaMinima: 20, estado: 'ASIGNACIÓN INCOMPLETA' },
    { id: 3, nombre: 'nombre profesor 3', horas: 40, porcentajeDescarga: '100%', docenciaMinima: 0, estado: 'ASIGNACIÓN COMPLETA' },
  ]);

  const verDetalles = (id: number) => {
    console.log(`Ver detalles del profesor con id ${id}`);
    // Aquí puedes implementar la lógica para navegar a otra página o mostrar un modal con los detalles
  };

  return (
    <PageContainer title="ProgramacionPage" description="Contiene las asignaturas asignadas a docentes">
      <DashboardCard title="Programacion Académica Docentes">
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>NOMBRE DE PROFESOR</TableCell>
                <TableCell>Horas según la dedicación</TableCell>
                <TableCell>Porcentaje Descarga</TableCell>
                <TableCell>Docencia Directa mínima (Hrs)</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Asignación</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {programacion.map((programa) => (
                <TableRow key={programa.id}>
                  <TableCell>
                    <Typography>{programa.nombre}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{programa.horas}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{programa.porcentajeDescarga}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{programa.docenciaMinima}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{programa.estado}</Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => verDetalles(programa.id)}
                    >
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DashboardCard>
    </PageContainer>
  );
};

export default ProgramacionPage;



'use client';
import { Typography, CircularProgress } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// Definir la interfaz de los datos
interface HistoricoData {
  idhistorico: number;
  cod_programa: string;
  Pograma: string;
  modalidad: string;
  Cod_Materia: string;
  Curso: string;
  grupo: string;
  semestre: string;
  Identificación: string;
  DOCENTE: string;
  tipo_docente: string;
  horas: number;
  horas_tot: number;
  tipo_hora: string;
  tipo_adscripción: string;
  cod_facultad: string;
  facultad_adscripcion: string;
  anno: number;
  per: number;
  Estado: string;
  cod_viab: string;
  fech_viab: string;
  jutif_viab: string;
}

const p_a_h = () => {
  const [data, setData] = useState<HistoricoData[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Estado para mostrar el mensaje de carga

  useEffect(() => {
    fetch('/api/historico')
      .then((res) => res.json())
      .then((data: HistoricoData[]) => {
        setData(data);
        setIsLoading(false); // Cuando los datos se cargan, quitamos el estado de carga
      })
      .catch((err) => {
        console.error('Error al cargar los datos:', err);
        setIsLoading(false); // Si hay error, también dejamos de cargar
      });
  }, []);

  return (
    <PageContainer title="p_a_h" description="Programacion academica historica">
      <DashboardCard title="HISTORICO DE PROGRAMACION ACADEMICA">
        {/*<Typography>HOLA MUNDO</Typography> */}
      </DashboardCard>

      <div style={{ width: '100%', overflowX: 'auto', position: 'relative' }}>
        {isLoading ? ( // Si está cargando, mostramos el mensaje y un spinner
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Cargando datos...
            </Typography>
          </div>
        ) : (
          <TableContainer component={Paper} sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>idhistorico</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>cod_programa</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Pograma</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>modalidad</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Cod_Materia</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Curso</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>grupo</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>semestre</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Identificación</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>DOCENTE</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>tipo_docente</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>horas</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>horas_tot</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>tipo_hora</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>tipo_adscripción</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>cod_facultad</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>facultad_adscripcion</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>anno</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>per</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Estado</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>cod_viab</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>fech_viab</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>jutif_viab</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.idhistorico}>
                    <TableCell>{row.idhistorico}</TableCell>
                    <TableCell>{row.cod_programa}</TableCell>
                    <TableCell>{row.Pograma}</TableCell>
                    <TableCell>{row.modalidad}</TableCell>
                    <TableCell>{row.Cod_Materia}</TableCell>
                    <TableCell>{row.Curso}</TableCell>
                    <TableCell>{row.grupo}</TableCell>
                    <TableCell>{row.semestre}</TableCell>
                    <TableCell>{row.Identificación}</TableCell>
                    <TableCell>{row.DOCENTE}</TableCell>
                    <TableCell>{row.tipo_docente}</TableCell>
                    <TableCell>{row.horas}</TableCell>
                    <TableCell>{row.horas_tot}</TableCell>
                    <TableCell>{row.tipo_hora}</TableCell>
                    <TableCell>{row.tipo_adscripción}</TableCell>
                    <TableCell>{row.cod_facultad}</TableCell>
                    <TableCell>{row.facultad_adscripcion}</TableCell>
                    <TableCell>{row.anno}</TableCell>
                    <TableCell>{row.per}</TableCell>
                    <TableCell>{row.Estado}</TableCell>
                    <TableCell>{row.cod_viab}</TableCell>
                    <TableCell>{row.fech_viab}</TableCell>
                    <TableCell>{row.jutif_viab}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </PageContainer>
  );
};

export default p_a_h;

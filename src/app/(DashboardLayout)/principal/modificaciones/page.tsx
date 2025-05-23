'use client';
import { Typography, CircularProgress, MenuItem, Select, FormControl, InputLabel, Button, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import * as XLSX from 'xlsx';

interface ModificacionesData {
  id_mod: number;
  cod_programa: string;
  Pograma: string;
  modalidad: string;
  Cod_Materia: string;
  Curso: string;
  GRP: string;
  SEM: string;
  ID: string;
  DOCENTE: string;
  tipo_docente: string;
  HRS: string;
  semanas: string;
  horas_tot: string;
  tipo_hora: string;
  tipo_adscripción: string;
  cod_facultad: string;
  factultad_adscripcion: string;
  estado_solicitud: string;
  anno: string;
  per: string;
  Columna_24: string;
  fecha_sol_dkn: string;
  std_decano: string;
  justif_decano: string;
  Estado: string;
  cod_viab: string;
  fech_viab: string;
  jutif_viab: string;
  docente_anterior: string;
  horas_anterior: string;
  Nro_Solicitud: string;
  Justificación: string;
  Cod_Viabilidad_mod: string;
}



const MOD = () => {
  const [data, setData] = useState<ModificacionesData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [year, setYear] = useState('');
  const [period, setPeriod] = useState('');
  const [years, setYears] = useState<string[]>([]);
  const [periods, setPeriods] = useState<string[]>([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch('/api/historico/filters');
        const { years, periods } = await res.json();
        setYears(years);
        setPeriods(periods);
        setYear(years[0] || '');
        setPeriod(periods[0] || '');
      } catch (err) {
        console.error('Error al cargar filtros:', err);
      }
    };
    fetchFilters();
  }, []);

  const fetchData = async (anno: string, per: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/modificaciones?anno=${anno}&per=${per}`);
      const data: ModificacionesData[] = await res.json();
      setData(data);
    } catch (err) {
      console.error('Error al cargar los datos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsult = () => {
    fetchData(year, period);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Historico');
    XLSX.writeFile(wb, 'Historico.xlsx');
  };

  return (
    <PageContainer title="PAH" description="Programacion academica historica">
      <DashboardCard title="MODIFICACIONES EN PROGRAMACION ACADEMICA">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 120, marginRight: 2 }}>
            <InputLabel>Año</InputLabel>
            <Select value={year} onChange={(e) => setYear(e.target.value)}>
              {years.map((y) => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120, marginRight: 2 }}>
            <InputLabel>Periodo</InputLabel>
            <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
              {periods.map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleConsult} sx={{ marginRight: 2 }}>Consultar</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={exportToExcel}
            disabled={data.length === 0}
            sx={{ backgroundColor: data.length === 0 ? 'grey' : 'primary.main' }}
          >
            Exportar
          </Button>
        </div>
      </DashboardCard>

      <div style={{ width: '100%', overflowX: 'auto', position: 'relative' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Cargando ...
            </Typography>
          </div>
        ) : (
          data.length > 0 && (
            <TableContainer component={Paper} sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>cod_programa</TableCell>
                    <TableCell>programa</TableCell>
                    <TableCell>modalidad</TableCell>
                    <TableCell>cod_materia</TableCell>
                    <TableCell>curso</TableCell>
                    <TableCell>grupo</TableCell>
                    <TableCell>semestre</TableCell>
                    <TableCell>identificacion</TableCell>
                    <TableCell>docente</TableCell>
                    <TableCell>tipo_docente</TableCell>
                    <TableCell>horas</TableCell>
                    <TableCell>semanas</TableCell>
                    <TableCell>horas_tot</TableCell>
                    <TableCell>tipo_hora</TableCell>
                    <TableCell>tipo_adscripcion</TableCell>
                    <TableCell>cod_facultad</TableCell>
                    <TableCell>facultad_adscripcion</TableCell>
                    <TableCell>estado_solicitud</TableCell>
                    <TableCell>anno</TableCell>
                    <TableCell>per</TableCell>
                    <TableCell>Columna_24</TableCell>
                    <TableCell>fecha_sol_dkn</TableCell>
                    <TableCell>std_decano</TableCell>
                    <TableCell>justif_decano</TableCell>
                    <TableCell>estado</TableCell>
                    <TableCell>cod_viab</TableCell>
                    <TableCell>fech_viab</TableCell>
                    <TableCell>justif_viab</TableCell>
                    <TableCell>docente_anterior</TableCell>
                    <TableCell>horas_anterior</TableCell>
                    <TableCell>Nro_Solicitud</TableCell>
                    <TableCell>Justificación</TableCell>
                    <TableCell>Cod_Viabilidad_mod</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row) => (
                    <TableRow key={row.id_mod}>
                      <TableCell>{row.cod_programa}</TableCell>
                      <TableCell>{row.Pograma}</TableCell>
                      <TableCell>{row.modalidad}</TableCell>
                      <TableCell>{row.Cod_Materia}</TableCell>
                      <TableCell>{row.Curso}</TableCell>
                      <TableCell>{row.GRP}</TableCell>
                      <TableCell>{row.SEM}</TableCell>
                      <TableCell>{row.ID}</TableCell>
                      <TableCell>{row.DOCENTE}</TableCell>
                      <TableCell>{row.tipo_docente}</TableCell>
                      <TableCell>{row.HRS}</TableCell>
                      <TableCell>{row.semanas}</TableCell>
                      <TableCell>{row.horas_tot}</TableCell>
                      <TableCell>{row.tipo_hora}</TableCell>
                      <TableCell>{row.tipo_adscripción}</TableCell>
                      <TableCell>{row.cod_facultad}</TableCell>
                      <TableCell>{row.factultad_adscripcion}</TableCell>
                      <TableCell>{row.estado_solicitud}</TableCell>
                      <TableCell>{row.anno}</TableCell>
                      <TableCell>{row.per}</TableCell>
                      <TableCell>{row.Columna_24}</TableCell>
                      <TableCell>{row.fecha_sol_dkn}</TableCell>
                      <TableCell>{row.std_decano}</TableCell>
                      <TableCell>{row.justif_decano}</TableCell>
                      <TableCell>{row.Estado}</TableCell>
                      <TableCell>{row.cod_viab}</TableCell>
                      <TableCell>{row.fech_viab}</TableCell>
                      <TableCell>{row.jutif_viab}</TableCell>
                      <TableCell>{row.docente_anterior}</TableCell>
                      <TableCell>{row.horas_anterior}</TableCell>
                      <TableCell>{row. Nro_Solicitud}</TableCell>
                      <TableCell>{row.Justificación}</TableCell>
                      <TableCell>{row.Cod_Viabilidad_mod}</TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
        )}
      </div>
    </PageContainer>
  );
};

export default MOD;

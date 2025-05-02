import React, { useState, useEffect } from 'react';
import { Grid, Typography, TextField, Button, MenuItem } from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

interface Cargo {
  id_fe: number;
  nombre_fe: string;
  porcentaje_max_fe: number;
}

interface Row {
  id: number;
  cargo: number | null;
  soporte: string | null;
  enlaceDrive: string | null;
  id_profesor: string;
  periodo: string;
  nombre: string;
  porcentaje: number;
}

interface EditarDescargaProps {
  idDescarga: string;
  onClose: () => void; // Función para cerrar el modal
}

const EditarAPage: React.FC<EditarDescargaProps> = ({ idDescarga, onClose }) => {
  const [rows, setRows] = useState<Row[]>([]); // Inicia el estado de filas vacío
  const [cargos, setCargos] = useState<Cargo[]>([]);

  // Obtener los datos de la descarga
  useEffect(() => {
    const fetchDescargaData = async () => {
      try {
        const response = await fetch(`/api/descargas_exten/consulta?id_de=${idDescarga}`);
        if (!response.ok) throw new Error('Error al obtener los datos de la descarga');
        const data = await response.json();

        if (data) {
          const rowsData = [{
            id: data.id_de,
            cargo: data.id_fe,
            soporte: data.soporte,
            enlaceDrive: data.soporte,
            id_profesor: data.id_profesor,
            periodo: data.periodo,
            nombre: data.nombre,
            porcentaje: data.porcentaje
          }];
          setRows(rowsData);
        } else {
          console.error('No se encontraron datos de descarga para el id:', idDescarga);
        }
      } catch (error) {
        console.error('Error al obtener los datos de la descarga:', error);
      }
    };

    fetchDescargaData();
  }, [idDescarga]);

  // Obtener los cargos
  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const response = await fetch('/api/ec_d_e');
        if (!response.ok) throw new Error('Error al obtener los cargos');
        const data = await response.json();
        setCargos(data);
      } catch (error) {
        console.error('Error al obtener los cargos:', error);
      }
    };

    fetchCargos();
  }, []);

  const isFormValid = () => {
    return rows.every((row) => row.cargo && row.enlaceDrive); // Verifica que haya un enlace
  };

  const handleFinalizar = async () => {
    try {
      if (!isFormValid()) {
        alert('Por favor, completa todos los campos y adjunta los soportes necesarios.');
        return;
      }

      const response = await fetch(`/api/d_exten/edit?idDescarga=${idDescarga}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rows: rows,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar las descargas');
      }

      alert('Descarga editada exitosamente');

      // Resetear el estado de las filas
      setRows([{ id: 1, cargo: null, soporte: null, enlaceDrive: '', id_profesor: '', periodo: '', nombre: '', porcentaje: 0 }]);

      // Llamar a onClose para cerrar el modal después de editar
      onClose();
    } catch (error) {
      console.error('Error al guardar las descargas:', error);
      alert('Hubo un problema al guardar las descargas');
    }
  };

  return (
    <DashboardCard title="Editar Descarga">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">ID de Descarga: {idDescarga}</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Documento del Docente: {rows[0]?.id_profesor || 'No disponible'}</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Nombre del Docente: {rows[0]?.nombre || 'No disponible'}</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Periodo de la Descarga: {rows[0]?.periodo || 'No disponible'}</Typography>
        </Grid>

        <Grid container spacing={2} style={{ marginTop: '16px', marginBottom: '16px' }} alignItems="center">
          <Grid item xs={4}><Typography variant="h6" align="center">Cargos</Typography></Grid>
          <Grid item xs={4}><Typography variant="h6" align="center">Porcentaje</Typography></Grid>
          <Grid item xs={4}><Typography variant="h6" align="center">Soporte de Descarga (Enlace Google Drive)</Typography></Grid>
        </Grid>

        {rows.map((row, index) => (
          <Grid container spacing={2} key={row.id} alignItems="center" style={{ marginTop: '2px', marginBottom: '2px' }}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                select
                variant="outlined"
                label="Cargo"
                value={row.cargo ?? ''}
                onChange={(e) => {
                  const selectedCargoId = Number(e.target.value);
                  const foundCargo = cargos.find((cargo) => cargo.id_fe === selectedCargoId);
                  const updatedRows = [...rows];
                  updatedRows[index].cargo = selectedCargoId;
                  setRows(updatedRows);
                }}
              >
                {cargos.map((cargo) => (
                  <MenuItem key={cargo.id_fe} value={cargo.id_fe}>
                    {cargo.nombre_fe}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                variant="outlined"
                type="number"
                label="Porcentaje"
                value={row.porcentaje ?? ''}
                onChange={(e) => {
                  const newValue = Number(e.target.value);
                  // Aseguramos que el nuevo valor esté entre 0 y el valor máximo
                  if (newValue >= 0 && newValue <= (cargos.find(cargo => cargo.id_fe === row.cargo)?.porcentaje_max_fe ?? 100)) {
                    const updatedRows = [...rows];
                    updatedRows[index].porcentaje = newValue;
                    setRows(updatedRows);
                  } else {
                    // Si el valor está fuera de rango, simplemente no se hace nada
                    alert(`El porcentaje máximo de descarga permitido para este cargo es ${(cargos.find(cargo => cargo.id_fe === row.cargo)?.porcentaje_max_fe ?? 100)}%`);
                  }
                  const updatedRows = [...rows];
                  updatedRows[index].porcentaje = newValue;
                  setRows(updatedRows);
                }}
                inputProps={{
                  min: 0, // Establecer mínimo permitido en 0
                  max: cargos.find(cargo => cargo.id_fe === row.cargo)?.porcentaje_max_fe ?? 100, // Establecer máximo permitido según el cargo
                }}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                variant="outlined"
                label="Enlace Google Drive"
                value={row.enlaceDrive ?? ''}
                onChange={(e) => {
                  const updatedRows = [...rows];
                  updatedRows[index].enlaceDrive = e.target.value;
                  updatedRows[index].soporte = e.target.value; // Si hay enlace, se usa como soporte
                  setRows(updatedRows);
                }}
              />
            </Grid>
          </Grid>
        ))}

        <Grid container spacing={2} style={{ marginTop: '16px' }} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="success" fullWidth onClick={handleFinalizar} disabled={!isFormValid()}>
              Finalizar
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default EditarAPage;

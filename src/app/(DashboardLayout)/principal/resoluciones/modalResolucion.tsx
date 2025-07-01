import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Typography,
  Autocomplete,
  Chip,
  Grid,
  InputLabel,
  FormControl,
} from '@mui/material';

// Simulación de datos (reemplaza por tus datos reales)
const programasDisponibles = [
  { id: 1, nombre: 'Ingeniería de Sistemas' },
  { id: 2, nombre: 'Administración' },
  { id: 3, nombre: 'Contaduría' },
];

const viabilidadesDisponibles = [
  { codigo: 'VIA001', descripcion: 'Viabilidad 1' },
  { codigo: 'VIA002', descripcion: 'Viabilidad 2' },
  { codigo: 'VIA003', descripcion: 'Viabilidad 3' },
];

interface ModalResolucionProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const ModalResolucion: React.FC<ModalResolucionProps> = ({ open, onClose, onSave }) => {
  const [nombreResolucion, setNombreResolucion] = useState('');
  const [enlaceArchivo, setEnlaceArchivo] = useState('');
  const [programa, setPrograma] = useState('');
  const [viabilidades, setViabilidades] = useState<any[]>([]);
  const [viabilidadInput, setViabilidadInput] = useState('');

  // Filtrado para autocompletar viabilidades
  const viabilidadOptions = viabilidadesDisponibles.filter(
    v =>
      v.codigo.toLowerCase().includes(viabilidadInput.toLowerCase()) &&
      !viabilidades.some(sel => sel.codigo === v.codigo)
  );

  const handleAddViabilidad = (event: any, value: any) => {
    if (value && !viabilidades.some(v => v.codigo === value.codigo)) {
      setViabilidades([...viabilidades, value]);
      setViabilidadInput('');
    }
  };

  const handleDeleteViabilidad = (codigo: string) => {
    setViabilidades(viabilidades.filter(v => v.codigo !== codigo));
  };

  const handleSave = () => {
    onSave({
      nombreResolucion,
      enlaceArchivo,
      programa,
      viabilidades,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography fontWeight="bold" variant="inherit">
          Nueva Resolución
        </Typography>
      </DialogTitle>
      <DialogContent>
        {/* Parte superior: tres campos */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Nombre o Código Resolución"
              value={nombreResolucion}
              onChange={e => setNombreResolucion(e.target.value)}
              fullWidth
              inputProps={{ maxLength: 45 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Enlace del Archivo"
              value={enlaceArchivo}
              onChange={e => setEnlaceArchivo(e.target.value)}
              fullWidth
              placeholder="https://..."
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Programa</InputLabel>
              <Select
                value={programa}
                label="Programa"
                onChange={e => setPrograma(e.target.value)}
              >
                {programasDisponibles.map(p => (
                  <MenuItem key={p.id} value={p.nombre}>
                    {p.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Área central: viabilidades seleccionadas */}
        <Box
          sx={{
            minHeight: 120,
            border: '1px solid #ccc',
            borderRadius: 2,
            p: 2,
            mb: 2,
            background: '#fafafa',
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Viabilidades seleccionadas:
          </Typography>
          {viabilidades.length === 0 ? (
            <Typography color="text.secondary">No hay viabilidades seleccionadas.</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {viabilidades.map(v => (
                <Chip
                  key={v.codigo}
                  label={`${v.codigo} - ${v.descripcion}`}
                  onDelete={() => handleDeleteViabilidad(v.codigo)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Selector de viabilidad con autocompletado */}
        <Autocomplete
          options={viabilidadOptions}
          getOptionLabel={option => `${option.codigo} - ${option.descripcion}`}
          inputValue={viabilidadInput}
          onInputChange={(_, value) => setViabilidadInput(value)}
          onChange={handleAddViabilidad}
          renderInput={params => (
            <TextField {...params} label="Agregar viabilidad por código" fullWidth />
          )}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end', pr: 3, pb: 2 }}>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cerrar
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalResolucion;
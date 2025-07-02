import React, { useState, useEffect } from 'react';
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
  Divider,
} from '@mui/material';

interface Viabilidad {
  cod_viab: string;
}

interface ModalResolucionProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const ModalResolucion: React.FC<ModalResolucionProps> = ({ open, onClose, onSave }) => {
  const [nombreResolucion, setNombreResolucion] = useState('');
  const [enlaceArchivo, setEnlaceArchivo] = useState('');
  const [programa, setPrograma] = useState('');
  const [viabilidades, setViabilidades] = useState<Viabilidad[]>([]);
  const [viabilidadInput, setViabilidadInput] = useState('');
  const [programasDisponibles, setProgramasDisponibles] = useState<any[]>([]);
  const [viabilidadesDisponibles, setViabilidadesDisponibles] = useState<Viabilidad[]>([]);
  const [saving, setSaving] = useState(false);

  // Cargar programas desde la API
  useEffect(() => {
    fetch('/api/resoluciones/programa')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProgramasDisponibles(data);
        } else {
          setProgramasDisponibles([]);
        }
      })
      .catch(() => setProgramasDisponibles([]));
  }, []);

  // Cargar viabilidades desde la API
  useEffect(() => {
    fetch('/api/resoluciones/viabilidad')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setViabilidadesDisponibles(data);
        } else {
          setViabilidadesDisponibles([]);
        }
      })
      .catch(() => setViabilidadesDisponibles([]));
  }, []);

  // Filtrado para autocompletar viabilidades
  const viabilidadOptions = viabilidadesDisponibles.filter(
    v =>
      v.cod_viab &&
      v.cod_viab.toLowerCase().includes(viabilidadInput.toLowerCase()) &&
      !viabilidades.some(sel => sel.cod_viab === v.cod_viab)
  );

  const handleAddViabilidad = (event: any, value: any) => {
    if (value && !viabilidades.some(v => v.cod_viab === value.cod_viab)) {
      setViabilidades([...viabilidades, value]);
      setViabilidadInput('');
    }
  };

  const handleDeleteViabilidad = (cod_viab: string) => {
    setViabilidades(viabilidades.filter(v => v.cod_viab !== cod_viab));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/resoluciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombreResolucion,
          archivo: enlaceArchivo,
          programa,
          viabilidades,
        }),
      });
      if (res.ok) {
        onSave({
          nombreResolucion,
          enlaceArchivo,
          programa,
          viabilidades,
        }); // <-- Ahora se pasa el argumento requerido
        onClose();
        // Opcional: limpiar campos aquí si lo deseas
      } else {
        const error = await res.json();
        alert(error.error || 'Error al guardar');
      }
    } catch (e) {
      alert('Error de red al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography fontWeight="bold" variant="inherit">
          Nueva Resolución
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, mb: 2 }}>
          <Grid container spacing={3} sx={{ mb: 2 }}>
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
                  {programasDisponibles
                    .filter(p => p.Pograma)
                    .map((p, idx) => (
                      <MenuItem key={idx} value={p.Pograma}>
                        {p.Pograma}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Divider />
        </Box>

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
                  key={v.cod_viab}
                  label={v.cod_viab}
                  onDelete={() => handleDeleteViabilidad(v.cod_viab)}
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
          getOptionLabel={option => option.cod_viab}
          inputValue={viabilidadInput}
          onInputChange={(_, value) => setViabilidadInput(value)}
          onChange={handleAddViabilidad}
          renderInput={params => (
            <TextField {...params} label="Agregar viabilidad por código" fullWidth />
          )}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end', pr: 3, pb: 2 }}>
        <Button onClick={onClose} color="secondary" variant="outlined" disabled={saving}>
          Cerrar
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalResolucion;
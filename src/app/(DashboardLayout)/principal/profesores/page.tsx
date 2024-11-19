'use client';
import { useState } from 'react';
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

interface Profesor {
  id: number;
  nombre: string;
  dedicacion: 'medio tiempo' | 'tiempo completo';
  horas: number;
  cedula: string;
}

const ProfesoresPage: React.FC = () => {
  const [profesores, setProfesores] = useState<Profesor[]>([
    { id: 1, nombre: 'nombre profesor 1', dedicacion: 'medio tiempo', horas: 20, cedula: '54545455' },
    { id: 2, nombre: 'nombre profesor 2', dedicacion: 'tiempo completo', horas: 40, cedula: '23212323' },
    { id: 3, nombre: 'nombre profesor 3', dedicacion: 'tiempo completo', horas: 40, cedula: '96696996' },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [profesorEnEdicion, setProfesorEnEdicion] = useState<Partial<Profesor> | null>(null);

  const [profesorAEliminar, setProfesorAEliminar] = useState<Profesor | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const esModoEdicion = !!profesorEnEdicion && profesores.some(p => p.id === profesorEnEdicion.id);

  const abrirModalCrear = () => {
    setProfesorEnEdicion({
      nombre: '',
      dedicacion: 'medio tiempo',
      horas: 20,
      cedula: '',
    });
    setIsEditing(true);
  };

  const abrirModalEdicion = (profesor: Profesor) => {
    setProfesorEnEdicion(profesor);
    setIsEditing(true);
  };

  const cerrarModal = () => {
    setProfesorEnEdicion(null);
    setIsEditing(false);
  };

  const guardarProfesor = () => {
    if (profesorEnEdicion) {
      if (esModoEdicion) {
        setProfesores(profesores.map(profesor =>
          profesor.id === profesorEnEdicion.id ? profesorEnEdicion as Profesor : profesor
        ));
      } else {
        setProfesores([...profesores, { ...profesorEnEdicion, id: Date.now() } as Profesor]);
      }
      cerrarModal();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    if (profesorEnEdicion && name) {
      setProfesorEnEdicion(prev => ({
        ...prev!,
        [name]: value,
        horas: name === 'dedicacion' ? (value === 'tiempo completo' ? 40 : 20) : prev!.horas,
      }));
    }
  };

  const abrirDialogoEliminar = (profesor: Profesor) => {
    setProfesorAEliminar(profesor);
    setIsDeleteDialogOpen(true);
  };

  const cerrarDialogoEliminar = () => {
    setProfesorAEliminar(null);
    setIsDeleteDialogOpen(false);
  };

  const confirmarEliminarProfesor = () => {
    if (profesorAEliminar) {
      setProfesores(profesores.filter(p => p.id !== profesorAEliminar.id));
      cerrarDialogoEliminar();
    }
  };

  return (
    <PageContainer title="Profesores" description="Contiene a todos los profesores">
      <DashboardCard title="PROFESORES">
        <Button variant="contained" color="primary" onClick={abrirModalCrear} style={{ marginBottom: '20px' }}>
          Agregar Profesor
        </Button>
      </DashboardCard>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>NOMBRE DE PROFESOR</TableCell>
              <TableCell>Dedicación del profesor</TableCell>
              <TableCell>Horas según la dedicación</TableCell>
              <TableCell>Cédula</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {profesores.map((profesor) => (
              <TableRow key={profesor.id}>
                <TableCell>{profesor.nombre}</TableCell>
                <TableCell>{profesor.dedicacion}</TableCell>
                <TableCell>{profesor.horas}</TableCell>
                <TableCell>{profesor.cedula}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => abrirModalEdicion(profesor)}
                    style={{ marginRight: '8px' }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => abrirDialogoEliminar(profesor)}
                    style={{ backgroundColor: '#ff533f' }}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
        
      {/* Modal para creación/edición */}
      <Dialog open={isEditing} onClose={cerrarModal}>
        <DialogTitle>{esModoEdicion ? "Editar Profesor" : "Agregar Profesor"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            name="nombre"
            value={profesorEnEdicion?.nombre || ''}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Dedicación</InputLabel>
            <Select
              name="dedicacion"
              value={profesorEnEdicion?.dedicacion || 'medio tiempo'}
              onChange={handleChange}
            >
              <MenuItem value="medio tiempo">Medio tiempo</MenuItem>
              <MenuItem value="tiempo completo">Tiempo completo</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Horas"
            name="horas"
            type="number"
            value={profesorEnEdicion?.horas || ''}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Cédula"
            name="cedula"
            value={profesorEnEdicion?.cedula || ''}
            onChange={handleChange}
            InputProps={{
              readOnly: esModoEdicion, // Solo lectura en modo edición
            }}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarModal} color="secondary">
            Cancelar
          </Button>
          <Button onClick={guardarProfesor} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo de confirmación para eliminar */}
      <Dialog open={isDeleteDialogOpen} onClose={cerrarDialogoEliminar}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de que desea eliminar el registro de {profesorAEliminar?.nombre}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarDialogoEliminar} color="secondary">
            Cancelar
          </Button>
          <Button onClick={confirmarEliminarProfesor} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default ProfesoresPage;

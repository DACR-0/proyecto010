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
  DialogActions
} from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';


interface Profesor {
  id: number;
  nombre: string;
  porcentajeDescarga: number;
}

const DescargasPage: React.FC = () => {
  const [profesores, setProfesores] = useState<Profesor[]>([
    { id: 1, nombre: 'Nombre y apellido profesor 1', porcentajeDescarga: 50 },
    { id: 2, nombre: 'Nombre y apellido profesor 2', porcentajeDescarga: 70 },
    { id: 3, nombre: 'Nombre y apellido profesor 3', porcentajeDescarga: 100 },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [profesorEnEdicion, setProfesorEnEdicion] = useState<Partial<Profesor> | null>(null);
  const [profesorAEliminar, setProfesorAEliminar] = useState<Profesor | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const abrirModalCrear = () => {
    setProfesorEnEdicion({ nombre: '', porcentajeDescarga: 0 });
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
      if (profesorEnEdicion.id) {
        setProfesores(profesores.map(profesor =>
          profesor.id === profesorEnEdicion.id ? profesorEnEdicion as Profesor : profesor
        ));
      } else {
        setProfesores([...profesores, { ...profesorEnEdicion, id: Date.now() } as Profesor]);
      }
      cerrarModal();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfesorEnEdicion(prev => ({
      ...prev!,
      [name]: name === 'porcentajeDescarga' ? parseInt(value) : value,
    }));
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
    <PageContainer title="Descargas académicas" description="Contiene a todos los profesores">
      <DashboardCard title="DESCARGAS ACADEMICAS">
      <Button variant="contained" color="primary" onClick={abrirModalCrear} style={{ marginBottom: '20px' }}>
          Agregar Profesor
        </Button>
      </DashboardCard>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography align="center">Nombre y apellido de profesor</Typography></TableCell>
                <TableCell><Typography align="center">Porcentaje Descarga</Typography></TableCell>
                <TableCell><Typography align="center">Acciones</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {profesores.map((profesor) => (
                <TableRow key={profesor.id}>
                  <TableCell align="center">{profesor.nombre}</TableCell>
                  <TableCell align="center">{profesor.porcentajeDescarga}%</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => abrirModalEdicion(profesor)}
                      style={{ marginRight: '8px'}}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => abrirDialogoEliminar(profesor)}
                      style={{ backgroundColor: '#ff533f'}}
                    >
                      eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      {/* Modal para creación/edición */}
      <Dialog open={isEditing} onClose={cerrarModal}>
        <DialogTitle>{profesorEnEdicion?.id ? "Editar Profesor" : "Agregar Profesor"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre y apellido de profesor"
            name="nombre"
            value={profesorEnEdicion?.nombre || ''}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Porcentaje Descarga"
            name="porcentajeDescarga"
            type="number"
            value={profesorEnEdicion?.porcentajeDescarga || ''}
            onChange={handleChange}
            fullWidth
            margin="dense"
            InputProps={{
              inputProps: { min: 0, max: 100 }
            }}
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

export default DescargasPage;
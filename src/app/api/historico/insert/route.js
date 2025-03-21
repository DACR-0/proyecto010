import { pool } from '@/utils/db';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

// Configuración de Multer para manejar la carga de archivos
const upload = multer({ dest: 'uploads/' });

export async function POST(req) {
  try {
    // Usamos el middleware de multer para recibir el archivo
    const formData = new FormData();
    const filePath = await new Promise((resolve, reject) => {
      upload.single('file')(req, res, (err) => {
        if (err) {
          reject('Error al procesar el archivo');
        } else {
          resolve(req.file.path); // El archivo se guarda en la carpeta 'uploads/'
        }
      });
    });

    // Leer el archivo Excel
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]]; // Suponiendo que los datos están en la primera hoja
    const data = XLSX.utils.sheet_to_json(sheet);

    // Procesamos y guardamos los datos en la base de datos
    for (const row of data) {
      const {
        cod_programa,
        Pograma,
        modalidad,
        Cod_Materia,
        Curso,
        grupo,
        semestre,
        identificacion,
        docente,
        tipo_docente,
        horas,
        horas_tot,
        sem,
        tipo_hora,
        tipo_adscripcion,
        cod_facultad,
        facultad_adscripcion,
        anno,
        per,
        estado,
        cod_viab,
        fech_viab,
        justif_viab,
      } = row;

      await pool.query(
        `INSERT INTO historico (
          cod_programa, Pograma, modalidad, Cod_Materia, Curso, grupo, semestre, identificacion, 
          docente, tipo_docente, horas, horas_tot, sem, tipo_hora, tipo_adscripcion, cod_facultad, 
          facultad_adscripcion, anno, per, estado, cod_viab, fech_viab, justif_viab
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cod_programa, Pograma, modalidad, Cod_Materia, Curso, grupo, semestre, identificacion,
          docente, tipo_docente, horas, horas_tot, sem, tipo_hora, tipo_adscripcion, cod_facultad,
          facultad_adscripcion, anno, per, estado, cod_viab, fech_viab, justif_viab
        ]
      );
    }

    // Eliminar el archivo después de procesarlo
    fs.unlinkSync(filePath);

    return Response.json({ success: true, message: 'Datos cargados correctamente' });

  } catch (error) {
    console.error('Error en la API:', error);
    return Response.json({ success: false, message: 'Error al cargar el archivo' }, { status: 500 });
  }
}

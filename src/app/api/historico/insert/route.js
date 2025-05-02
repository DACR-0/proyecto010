import { pool } from '@/utils/db';  // Asegúrate de tener la conexión a la base de datos configurada

export async function POST(req) {
  try {
    const body = await req.json();  // Obtener el JSON del cuerpo de la solicitud
    const { data } = body;  // Cambiar 'rows' por 'data'

    // Verificar que 'data' sea un arreglo
    if (!Array.isArray(data)) {
      return Response.json({ success: false, message: "El campo 'data' debe ser un arreglo" }, { status: 400 });
    }

    // Insertar cada fila de datos en la base de datos
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

      // Realizar la consulta SQL para insertar los datos en la tabla 'historico'
      await pool.query(
        `INSERT INTO historico (
  cod_programa, Pograma, modalidad, Cod_Materia, Curso, grupo, semestre,
  identificacion, docente, tipo_docente, horas, horas_tot, sem,
  tipo_hora, tipo_adscripcion, cod_facultad, facultad_adscripcion,
  anno, per, estado, cod_viab, fech_viab, justif_viab
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`,
        [
          cod_programa, Pograma, modalidad, Cod_Materia, Curso, grupo, semestre,
          identificacion, docente, tipo_docente, horas, horas_tot, sem,
          tipo_hora, tipo_adscripcion, cod_facultad, facultad_adscripcion,
          anno, per, estado, cod_viab, fech_viab, justif_viab
        ]
      );
    }

    return Response.json({ success: true, message: 'Datos insertados exitosamente' });

  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return Response.json({ success: false, message: 'Error al insertar los datos en la base de datos' }, { status: 500 });
  }
}

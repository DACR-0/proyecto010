import { pool } from '@/utils/db';

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
        Pograma, modalidad,
        Cod_Materia,
        Curso,
        GRP,
        SEM,
        ID,
        DOCENTE,
        tipo_docente,
        HRS,
        semanas,
        horas_tot,
        tipo_hora,
        tipo_adscripción,
        cod_facultad,
        factultad_adscripcion,
        estado_solicitud,
        anno,
        per,
        Columna_24,
        fecha_sol_dkn,
        std_decano,
        justif_decano,
        Estado,
        cod_viab,
        fech_viab,
        jutif_viab,
        docente_anterior,
        horas_anterior,
        Nro_Solicitud,
        Justificación,
        Cod_Viabilidad_mod

      } = row;

      // Realizar la consulta SQL para insertar los datos en la tabla 'historico'
      await pool.query(
        `
        INSERT INTO tabla_oculta (cod_programa, Pograma, modalidad, Cod_Materia, Curso, GRP, SEM, ID, DOCENTE, tipo_docente, HRS, semanas, horas_tot, tipo_hora, tipo_adscripción, cod_facultad, factultad_adscripcion, estado_solicitud, anno, per, Columna_24, fecha_sol_dkn, std_decano, justif_decano, Estado, cod_viab, fech_viab, jutif_viab, docente_anterior, horas_anterior, Nro_Solicitud, Justificación, Cod_Viabilidad_mod) 
        VALUES (?, ?,?, ?, ?, ?,?, ?, ?, ?, ?,?,?, ?,?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        

`,
        [
          cod_programa,
          Pograma, modalidad,
          Cod_Materia,
          Curso,
          GRP,
          SEM,
          ID,
          DOCENTE,
          tipo_docente,
          HRS,
          semanas,
          horas_tot,
          tipo_hora,
          tipo_adscripción,
          cod_facultad,
          factultad_adscripcion,
          estado_solicitud,
          anno,
          per,
          Columna_24,
          fecha_sol_dkn,
          std_decano,
          justif_decano,
          Estado,
          cod_viab,
          fech_viab,
          jutif_viab,
          docente_anterior,
          horas_anterior,
          Nro_Solicitud,
          Justificación,
          Cod_Viabilidad_mod
        ]
      );
    }

    return Response.json({ success: true, message: 'Datos insertados exitosamente' });

  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return Response.json({ success: false, message: 'Error al insertar los datos en la base de datos' }, { status: 500 });
  }
}

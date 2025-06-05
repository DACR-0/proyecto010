import { pool } from '@/utils/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const docente = searchParams.get('docente');
    const documento = searchParams.get('documento'); // Nuevo parámetro para el número de documento

    if (!docente && !documento) {
      return new Response(JSON.stringify({ error: 'Falta el docente o el documento en la consulta' }), { status: 400 });
    }

    let query = `
      SELECT docente, Pograma, Cod_Materia, Curso, grupo, semestre, horas, tipo_hora, anno, per 
      FROM proyecto010.historico 
    `;
    let params = [];

    if (documento) {
      query += 'WHERE identificacion = ? ORDER BY anno, per;';
      params = [documento];
    } else {
      query += 'WHERE docente = ? ORDER BY anno, per;';
      params = [docente];
    }

    const [rows] = await pool.query(query, params);
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Error al obtener los datos del docente:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener los datos del docente' }), { status: 500 });
  }
}

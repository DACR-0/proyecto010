import { pool } from '@/utils/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const docente = searchParams.get('docente'); // Obtenemos el docente desde los parámetros de la URL

    if (!docente) {
      return new Response(JSON.stringify({ error: 'Falta el docente en la consulta' }), { status: 400 });
    }

    const query = `
      SELECT docente, Pograma, Cod_Materia, Curso, grupo, semestre, horas, tipo_hora, anno, per 
      FROM proyecto010.historico 
      WHERE docente = ? 
      ORDER BY anno, per;
    `;

    const [rows] = await pool.query(query, [docente]);
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Error al obtener los datos del docente:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener los datos del docente' }), { status: 500 });
  }
}

import { pool } from '@/utils/db';

export async function GET(request) {
  try {
    const [rows] = await pool.query('SELECT p.numero_doc,p.nombre,p.dedicacion,g.nombre as programa ,p.tipo_doc FROM profesores p JOIN programa g on g.id = p.id_programa ORDER BY g.nombre,p.nombre ASC;');
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Error al obtener los profesores:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener los profesores' }), { status: 500 });
  }
}
import { pool } from '@/utils/db';

export async function GET(request) {
  try {
    const [rows] = await pool.query('SELECT nombre_fe,porcentaje_max_fe FROM proyecto010.f_extencion ORDER BY nombre_fe ASC');
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Error al obtener los cargos:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener los cargos' }), { status: 500 });
  }
}
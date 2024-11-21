import { pool } from '@/utils/db';

export async function GET(request) {
  try {
    const [rows] = await pool.query('SELECT nombre_cargo, porcentaje FROM f_administrativas ORDER BY nombre_cargo ASC');
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Error al obtener los cargos:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener los cargos' }), { status: 500 });
  }
}
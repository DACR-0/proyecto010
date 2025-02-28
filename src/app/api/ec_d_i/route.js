import { pool } from '@/utils/db';

export async function GET(request) {
  try {
    const [rows] = await pool.query('SELECT id_fi, nombre_fi, porcentaje_max_fi FROM proyecto010.f_investigacion ORDER BY nombre_fi ASC');
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Error al obtener los cargos:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener los cargos' }), { status: 500 });
  }
}
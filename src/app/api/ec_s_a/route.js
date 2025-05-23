import { pool } from '@/utils/db';

export async function GET(request) {
  try {
    const [rows] = await pool.query('SELECT ids_admin, nombre FROM proyecto010.s_admin ORDER BY nombre ASC;');
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Error al obtener los cargos:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener los cargos' }), { status: 500 });
  }
}
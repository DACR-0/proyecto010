import { pool } from '@/utils/db';

export async function GET(request) {
  try {
    const [rows] = await pool.query('SELECT periodo, año, semestre FROM proyecto010.periodos where año = (SELECT MAX(año) FROM periodos) and semestre= (SELECT semestre FROM periodos WHERE año = ( SELECT MAX(año) FROM periodos) ORDER BY semestre DESC LIMIT 1);');
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Error al obtener el periodos:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener el periodos' }), { status: 500 });
  }
}
import { pool } from '@/utils/db';

export async function GET(request) {
  try {
    const [rows] = await pool.query('SELECT * FROM viabilidades');
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Error al obtener las viabilidades:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener las viabilidades' }), { status: 500 });
  }
}
import { pool } from '@/utils/db';

export async function GET(req) {
  try {
    const [rows] = await pool.query('SELECT año, valor, ir FROM proyecto010.punto_s');
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

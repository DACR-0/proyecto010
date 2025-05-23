import { pool } from '@/utils/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const anno = searchParams.get('anno');
  const per = searchParams.get('per');

  if (!anno || !per) {
    return new Response(JSON.stringify({ error: 'Faltan parámetros anno y per' }), { status: 400 });
  }

  try {
    const [rows] = await pool.query(
      `SELECT * FROM modificaciones WHERE anno = ? AND per = ?`,
      [anno, per]
    );
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Error en la consulta de historico:', error);
    return new Response(JSON.stringify({ error: 'Error en la base de datos' }), { status: 500 });
  }
}

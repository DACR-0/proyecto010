import { pool } from '@/utils/db';

export async function GET(req) {
  try {
    const [rows] = await pool.query('SELECT * FROM resoluciones ORDER BY idresolucion DESC');
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener resoluciones' }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { nombre, archivo, programa } = body;

    if (!nombre) {
      return new Response(JSON.stringify({ error: 'El nombre es obligatorio' }), { status: 400 });
    }

    await pool.query(
      'INSERT INTO resoluciones (nombre, archivo, programa) VALUES (?, ?, ?)',
      [nombre, archivo || null, programa || null]
    );

    return new Response(JSON.stringify({ success: true, message: 'Resolución creada' }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al crear resolución' }), { status: 500 });
  }
}
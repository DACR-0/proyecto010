import { pool } from '@/utils/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { año, semestre } = body;

    if (!año || !semestre) {
      return new Response(JSON.stringify({ error: 'Faltan datos: año y semestre son requeridos' }), { status: 400 });
    }

    const periodo = `${año}-${semestre}`;

    // Insertar el nuevo periodo
    await pool.query(
      'INSERT INTO proyecto010.periodos (periodo, año, semestre) VALUES (?, ?, ?)',
      [periodo, año, semestre]
    );

    return new Response(JSON.stringify({ success: true, message: 'Periodo insertado correctamente', periodo }), { status: 201 });
  } catch (error) {
    console.error('Error al insertar el periodo:', error);
    return new Response(JSON.stringify({ error: 'Error al insertar el periodo' }), { status: 500 });
  }
}
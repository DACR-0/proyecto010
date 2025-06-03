import { pool } from '@/utils/db';

export async function POST(req) {
  try {
    const body = await req.json();
    const { profesor, periodo, rows } = body;

    if (!Array.isArray(rows)) {
      return Response.json({ success: false, message: "El campo 'rows' debe ser un arreglo" }, { status: 400 });
    }

    for (const row of rows) {
      const { cargo, soporte, soporte2 } = row;

      await pool.query(
        `INSERT INTO descarga_admin (id_profesor, id_fa, soporte, soporte2, periodo) VALUES (?, ?, ?, ?, ?)`,
        [profesor, cargo, soporte, soporte2, periodo]
      );
    }

    return Response.json({ success: true, message: 'Descargas guardadas exitosamente' });
  } catch (error) {
    console.error('Error en la API:', error);
    return Response.json({ success: false, message: 'Error en el servidor' }, { status: 500 });
  }
}
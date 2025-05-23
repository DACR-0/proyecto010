import { pool } from '@/utils/db';

export async function POST(req) {
  try {
    const body = await req.json();
    const { profesor, periodo, rows } = body;

    if (!Array.isArray(rows)) {
      return Response.json({ success: false, message: "El campo 'rows' debe ser un arreglo" }, { status: 400 });
    }

    for (const row of rows) {
      const { cargo, porcentaje, soporte, soporte2 } = row; // soporte2 incluido

      await pool.query(
        `INSERT INTO descarga_extencion (id_profesor, id_fe, porcentaje, soporte, soporte2, periodo) VALUES (?, ?, ?, ?, ?, ?)`,
        [profesor, cargo, porcentaje, soporte, soporte2, periodo]
      );
    }

    return Response.json({ success: true, message: 'Descargas guardadas exitosamente' });
  } catch (error) {
    console.error('Error en la API:', error);
    return Response.json({ success: false, message: 'Error en el servidor' }, { status: 500 });
  }
}
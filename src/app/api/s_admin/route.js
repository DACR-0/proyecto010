import { pool } from '@/utils/db';

export async function POST(req) {
  try {
    const body = await req.json(); // Cambiado de req.body a req.json()
    const { profesor, rows } = body;

    if (!Array.isArray(rows)) {
      return Response.json({ success: false, message: "El campo 'rows' debe ser un arreglo" }, { status: 400 });
    }

    for (const row of rows) {
      const { cargo, soporte, fecha_inicio, fecha_fin } = row;

      // Aquí debe insertarse la consulta con todos los valores que necesitas.
      await pool.query(
        `INSERT INTO situacion_admin (id_profesor, id_s_a, fecha_inicio, fecha_fin, soporte) 
         VALUES (?, ?, ?, ?, ?)`,
        [profesor, cargo, fecha_inicio, fecha_fin, soporte]
      );
    }

    return Response.json({ success: true, message: 'Situación(s) guardada(s) exitosamente' });
  } catch (error) {
    console.error('Error en la API:', error);
    return Response.json({ success: false, message: 'Error en el servidor' }, { status: 500 });
  }
}
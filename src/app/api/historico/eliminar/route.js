import { pool } from '@/utils/db';

export async function DELETE(req) {
  try {
    const body = await req.json();
    let { anno, per } = body;

    // Convierte a número si es posible
    anno = Number(anno);
    per = Number(per);

    if (!anno || !per || isNaN(anno) || isNaN(per)) {
      return Response.json({ success: false, message: "Parámetros 'anno' y 'per' inválidos" }, { status: 400 });
    }

    await pool.query(
      `DELETE FROM historico WHERE anno = ? AND per = ?`,
      [anno, per]
    );

    return Response.json({ success: true, message: 'Datos eliminados exitosamente' });

  } catch (error) {
    console.error('Error al procesar la solicitud de eliminación:', error);
    return Response.json({ success: false, message: 'Error al eliminar los datos de la base de datos' }, { status: 500 });
  }
}
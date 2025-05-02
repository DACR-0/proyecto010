import { pool } from '@/utils/db';  // Asegúrate de tener la conexión a la base de datos configurada

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { anno, per } = body;

    if (!anno || !per) {
      return Response.json({ success: false, message: "Faltan los parámetros 'anno' y 'per'" }, { status: 400 });
    }

    // Realizar la consulta SQL para eliminar los datos
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

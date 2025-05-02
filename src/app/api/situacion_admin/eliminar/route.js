import { pool } from '@/utils/db';

export async function DELETE(request) {
  try {
    const { idsituacion_admin: idsituacion_admin } = await request.json();  // Obtiene el idsituacion_admin del cuerpo de la solicitud

    if (!idsituacion_admin) {
      return new Response(
        JSON.stringify({ error: 'El idsituacion_admin es obligatorio' }),
        { status: 400 }
      );
    }

    // Ejecutar la consulta SQL para eliminar el registro
    const [result] = await pool.query(
      `DELETE FROM situacion_admin WHERE (idsituacion_admin = ?)`, [idsituacion_admin]
    );

    // Verificar si se eliminó algún registro
    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ error: 'No se encontró el registro a eliminar' }),
        { status: 404 }
      );
    }

    // Si la eliminación fue exitosa
    return new Response(
      JSON.stringify({ message: 'Registro eliminado correctamente' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al eliminar el registro:', error);
    return new Response(
      JSON.stringify({ error: 'Hubo un problema al eliminar el registro' }),
      { status: 500 }
    );
  }
}

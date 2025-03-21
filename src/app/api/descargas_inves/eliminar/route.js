import { pool } from '@/utils/db';

export async function DELETE(request) {
  try {
    const { id_di } = await request.json();  // Obtiene el id_di del cuerpo de la solicitud

    if (!id_di) {
      return new Response(
        JSON.stringify({ error: 'El id_di es obligatorio' }),
        { status: 400 }
      );
    }

    // Ejecutar la consulta SQL para eliminar el registro
    const [result] = await pool.query(
      `DELETE FROM \`proyecto010\`.descarga_investigacion WHERE id_di = ?`, [id_di]
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

import { pool } from '@/utils/db';

export async function DELETE(request) {
  try {
    // Parsear el cuerpo de la solicitud para obtener el id_da
    const { id_da } = await request.json(); // Obtiene el id_da del cuerpo de la solicitud

    // Validar que id_da esté presente
    if (!id_da) {
      return new Response(
        JSON.stringify({ error: 'El id_da es obligatorio' }),
        { status: 400 }
      );
    }

    // Realizar la consulta SQL para eliminar el registro
    const [result] = await pool.query(
      `DELETE FROM \`proyecto010\`.descarga_admin WHERE id_da = ?`, [id_da]
    );

    // Verificar si se eliminó algún registro
    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ error: 'No se encontró el registro a eliminar' }),
        { status: 404 }
      );
    }

    // Responder con éxito
    return new Response(
      JSON.stringify({ message: 'Registro eliminado exitosamente' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Ocurrió un error al eliminar el registro:', error);
    return new Response(
      JSON.stringify({ error: 'Hubo un problema al eliminar el registro' }),
      { status: 500 }
    );
  }
}

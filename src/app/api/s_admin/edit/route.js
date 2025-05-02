import { pool } from '@/utils/db';

export async function PUT(req) {
  try {
    // Obtener el cuerpo de la solicitud (rows)
    const { rows } = await req.json();

    // Verificar que se haya recibido correctamente el array rows
    if (!Array.isArray(rows)) {
      return new Response(
        JSON.stringify({ success: false, message: "El campo 'rows' debe ser un arreglo" }),
        { status: 400 }
      );
    }

    console.log("Datos recibidos en la API:", rows);

    // Verificar y actualizar cada fila
    for (const row of rows) {
      const { id, cargo, soporte,fecha_inicio,fecha_fin } = row;

      if (!cargo) {
        return new Response(
          JSON.stringify({ success: false, message: "Faltan datos necesarios para actualizar (cargo o soporte)" }),
          { status: 400 }
        );
      }

      // Realizar el UPDATE
      const result = await pool.query(
        `UPDATE situacion_admin SET id_s_a = ?, fecha_inicio = ?, fecha_fin = ?, soporte = ? WHERE (idsituacion_admin = ?);`,
        [cargo,fecha_inicio,fecha_fin, soporte, id]
      );

      if (result.affectedRows === 0) {
        return new Response(
          JSON.stringify({ success: false, message: `No se encontró la situación administrativa con id ${id}` }),
          { status: 404 }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Situación administrativa actualizada exitosamente' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error en el servidor' }),
      { status: 500 }
    );
  }
}

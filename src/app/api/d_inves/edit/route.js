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
      const { id, cargo, soporte, porcentaje,fecha_inicio,fecha_fin } = row;

      if (!cargo || !soporte) {
        return new Response(
          JSON.stringify({ success: false, message: "Faltan datos necesarios para actualizar (cargo o soporte)" }),
          { status: 400 }
        );
      }

      // Realizar el UPDATE
      const result = await pool.query(
        `UPDATE descarga_investigacion SET id_fi = ?, porcentaje = ?, soporte = ?, fecha_inicio = ?, fecha_fin = ? WHERE (id_di = ?);`,
        [cargo, porcentaje, soporte,fecha_inicio,fecha_fin, id]
      );

      if (result.affectedRows === 0) {
        return new Response(
          JSON.stringify({ success: false, message: `No se encontró la descarga con id ${id}` }),
          { status: 404 }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Descarga actualizada exitosamente' }),
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

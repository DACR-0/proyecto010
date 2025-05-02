import { pool } from '@/utils/db';  // Asegúrate de tener la conexión a la base de datos configurada

export async function POST(req) {
  try {
    const body = await req.json();  // Obtener el JSON del cuerpo de la solicitud
    const { data } = body;  // Cambiar 'rows' por 'data'

    // Verificar que 'data' sea un arreglo
    if (!Array.isArray(data)) {
      return Response.json({ success: false, message: "El campo 'data' debe ser un arreglo" }, { status: 400 });
    }

    // Insertar cada fila de datos en la base de datos
    for (const row of data) {
      const {
        numero_doc,
        nombre,
        dedicacion,
        id_programa,
        tipo_doc

      } = row;

      // Realizar la consulta SQL para insertar los datos en la tabla 'historico'
      await pool.query(
        `
        INSERT INTO profesores (numero_doc, nombre, dedicacion, id_programa, tipo_doc) VALUES (?, ?, ?, ?, ?);
`,
        [
          numero_doc,
        nombre,
        dedicacion,
        id_programa,
        tipo_doc

        ]
      );
    }

    return Response.json({ success: true, message: 'Datos insertados exitosamente' });

  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return Response.json({ success: false, message: 'Error al insertar los datos en la base de datos' }, { status: 500 });
  }
}

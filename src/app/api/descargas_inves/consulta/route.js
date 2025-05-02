import { pool } from '@/utils/db';

export async function GET(request) {
  try {
    // Extraer los parámetros de búsqueda de la URL
    const { searchParams } = new URL(request.url);
    const id_di = searchParams.get('id_di'); // Obtenemos el id_di desde los parámetros de búsqueda

    // Validar que id_da esté presente
    if (!id_di) {
      return new Response(
        JSON.stringify({ error: 'El id_di es obligatorio' }),
        { status: 400 }
      );
    }

    // Realizar la consulta SQL para obtener los datos de la descarga a editar
    const [rows] = await pool.query(`
      SELECT d.id_di, d.id_profesor, p.nombre , d.id_fi, d.soporte, d.periodo, d.porcentaje, d.fecha_inicio, d.fecha_fin
      FROM descarga_investigacion d
      join profesores p on d.id_profesor=p.numero_doc
      WHERE id_di = ?
    `, [id_di]);

    // Verificar si se encontró el registro
    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No se encontró el registro a editar' }),
        { status: 404 }
      );
    }

    // Si existe el registro, devolver los datos
    return new Response(
      JSON.stringify(rows[0]), // Devolvemos el primer (y único) resultado encontrado
      { status: 200 }
    );

  } catch (error) {
    console.error('Ocurrió un error al obtener los datos para editar:', error);
    return new Response(
      JSON.stringify({ error: 'Hubo un problema al obtener los datos' }),
      { status: 500 }
    );
  }
}

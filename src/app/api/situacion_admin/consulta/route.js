import { pool } from '@/utils/db';

export async function GET(request) {
  try {
    // Extraer los parámetros de búsqueda de la URL
    const { searchParams } = new URL(request.url);
    const idsituacion_admin = searchParams.get('idsituacion_admin'); // Obtenemos el ids_admin desde los parámetros de búsqueda

    // Validar que id_da esté presente
    if (!idsituacion_admin) {
      return new Response(
        JSON.stringify({ error: 'El ids_admin es obligatorio' }),
        { status: 400 }
      );
    }

    // Realizar la consulta SQL para obtener los datos de la descarga a editar
    const [rows] = await pool.query(`
      SELECT sa.idsituacion_admin ,sa.id_profesor, sa.id_s_a,
p.nombre AS nombre_profesor, 
DATE_FORMAT(sa.fecha_inicio, '%Y-%m-%d') AS fecha_inicio,
    DATE_FORMAT(sa.fecha_fin, '%Y-%m-%d') AS fecha_fin,
    sa.soporte 
FROM proyecto010.situacion_admin sa
JOIN profesores p ON sa.id_profesor = p.numero_doc
where idsituacion_admin = ?
    `, [idsituacion_admin]);

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

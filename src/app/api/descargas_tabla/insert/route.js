import { pool } from '@/utils/db'; 

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
        nombre_profesor,
        numero_identificacion,
        dedicacion_profesor,
        numero_horas,
        situacion_administrariva,
        f_admin_1,
        porcentaje_fa_1,
        f_admin_2,
        porcentaje_fa_2,
        f_admin_3,
        porcentaje_fa_3,
        f_admin_4,
        porcentaje_fa_4,
        porcentaje_total_fa,
        descarga_investigacion_1,
        porcentaje_di_1,
        descarga_investigacion_2,
        porcentaje_di_2,
        descarga_investigacion_3,
        porcentaje_di_3,
        descarga_investigacion_4,
        porcentaje_di_4,
        porcentaje_total_di,
        descarga_extension_1,
        porcentaje_de_1,
        descarga_extension_2,
        porcentaje_de_2,
        descarga_extension_3,
        porcentaje_de_3,
        descarga_extension_4,
        porcentaje_de_4,
        porcentaje_total_de

      } = row;

      // Realizar la consulta SQL para insertar los datos en la tabla 'historico'
      await pool.query(
        `
        INSERT INTO tabla_oculta (nombre_profesor, numero_identificacion, dedicacion_profesor, numero_horas, situacion_administrariva, f_admin_1, porcentaje_fa_1, f_admin_2, porcentaje_fa_2, f_admin_3, porcentaje_fa_3, f_admin_4, porcentaje_fa_4, porcentaje_total_fa, descarga_investigacion_1, porcentaje_di_1, descarga_investigacion_2, porcentaje_di_2, descarga_investigacion_3, porcentaje_di_3, descarga_investigacion_4, porcentaje_di_4, porcentaje_total_di, descarga_extension_1, porcentaje_de_1, descarga_extension_2, porcentaje_de_2, descarga_extension_3, porcentaje_de_3, descarga_extension_4, porcentaje_de_4, porcentaje_total_de) 
        VALUES (?, ?, ?,?, ?, ?, ?,?, ?, ?, ?, ?,?,?, ?,?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

`,
        [
          nombre_profesor,
          numero_identificacion,
          dedicacion_profesor,
          numero_horas,
          situacion_administrariva,
          f_admin_1,
          porcentaje_fa_1,
          f_admin_2,
          porcentaje_fa_2,
          f_admin_3,
          porcentaje_fa_3,
          f_admin_4,
          porcentaje_fa_4,
          porcentaje_total_fa,
          descarga_investigacion_1,
          porcentaje_di_1,
          descarga_investigacion_2,
          porcentaje_di_2,
          descarga_investigacion_3,
          porcentaje_di_3,
          descarga_investigacion_4,
          porcentaje_di_4,
          porcentaje_total_di,
          descarga_extension_1,
          porcentaje_de_1,
          descarga_extension_2,
          porcentaje_de_2,
          descarga_extension_3,
          porcentaje_de_3,
          descarga_extension_4,
          porcentaje_de_4,
          porcentaje_total_de

        ]
      );
    }

    return Response.json({ success: true, message: 'Datos insertados exitosamente' });

  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return Response.json({ success: false, message: 'Error al insertar los datos en la base de datos' }, { status: 500 });
  }
}
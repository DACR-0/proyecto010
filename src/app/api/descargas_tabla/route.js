import { pool } from '@/utils/db';

export async function GET(request) {
  try {
    const [rows] = await pool.query(`SELECT 
    profesores.nombre, 
    profesores.dedicacion,
    porcentajes.id_profesor, 
    porcentajes.porcentaje_admin, 
    porcentajes.porcentaje_exten, 
    porcentajes.porcentaje_inve,
    LEAST(porcentajes.porcentaje_inve + porcentajes.porcentaje_exten, 50) AS total_ie,
    LEAST(porcentajes.porcentaje_inve + porcentajes.porcentaje_exten + porcentajes.porcentaje_admin, 100) AS descarga_total,
    CASE 
        WHEN profesores.dedicacion = 'tiempo completo' THEN 40
        WHEN profesores.dedicacion IN ('medio tiempo', 'tiempo parcial') THEN 20
        ELSE 0  -- Valor por defecto en caso de que no se cumpla ninguna de las condiciones
    END AS horas_dedicacion,
    -- Calculamos horas_descarga y redondeamos a número entero
    ROUND(
        (CASE 
            WHEN profesores.dedicacion = 'tiempo completo' THEN 40
            WHEN profesores.dedicacion IN ('medio tiempo', 'tiempo parcial') THEN 20
            ELSE 0
        END) * LEAST(porcentajes.porcentaje_inve + porcentajes.porcentaje_exten + porcentajes.porcentaje_admin, 100) / 100, 0
    ) AS horas_descarga,
    -- Calculamos horas_totales
    (CASE 
        WHEN profesores.dedicacion = 'tiempo completo' THEN 40
        WHEN profesores.dedicacion IN ('medio tiempo', 'tiempo parcial') THEN 20
        ELSE 0
    END) - ROUND(
        (CASE 
            WHEN profesores.dedicacion = 'tiempo completo' THEN 40
            WHEN profesores.dedicacion IN ('medio tiempo', 'tiempo parcial') THEN 20
            ELSE 0
        END) * LEAST(porcentajes.porcentaje_inve + porcentajes.porcentaje_exten + porcentajes.porcentaje_admin, 100) / 100, 0
    ) AS horas_totales
FROM profesores
JOIN (
    SELECT 
        profesores.id_profesor, 
        COALESCE(admin.total_porcentaje, 0) AS porcentaje_admin, 
        COALESCE(exten.total_porcentaje, 0) AS porcentaje_exten,
        COALESCE(inve.total_porcentaje, 0) AS porcentaje_inve
    FROM 
        (SELECT id_profesor 
         FROM descarga_admin
         UNION
         SELECT id_profesor 
         FROM descarga_extencion
         UNION
         SELECT id_profesor 
         FROM descarga_investigacion) AS profesores
    LEFT JOIN 
        (SELECT da.id_profesor, SUM(fa.porcentaje) AS total_porcentaje 
         FROM descarga_admin da
         JOIN f_administrativas fa ON da.id_fa = fa.id_fa
         GROUP BY da.id_profesor) AS admin 
    ON admin.id_profesor = profesores.id_profesor
    LEFT JOIN 
        (SELECT de.id_profesor, SUM(de.porcentaje) AS total_porcentaje 
         FROM descarga_extencion de
         GROUP BY de.id_profesor) AS exten 
    ON exten.id_profesor = profesores.id_profesor
    LEFT JOIN 
        (SELECT di.id_profesor, SUM(di.porcentaje) AS total_porcentaje 
         FROM descarga_investigacion di
         GROUP BY di.id_profesor) AS inve
    ON inve.id_profesor = profesores.id_profesor
) AS porcentajes 
ON porcentajes.id_profesor = profesores.numero_doc;
`);
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Ocurrio un error', error);
    return new Response(JSON.stringify({ error: 'Error' }), { status: 500 });
  }
}
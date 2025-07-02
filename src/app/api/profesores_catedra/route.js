import { pool } from '@/utils/db';

export async function GET(request) {
  try {
    const [rows] = await pool.query(`
      SELECT 
  h.facultad_adscripcion AS factultad_adscripcion, 
  h.identificacion, 
  h.docente, 
  SUM(CAST(h.horas AS DECIMAL)) AS total_horas,
  GROUP_CONCAT(DISTINCT h.cod_viab ORDER BY h.cod_viab SEPARATOR ', ') AS viabilidades
FROM historico h
WHERE 
  h.anno = (SELECT MAX(año) FROM periodos) 
  AND h.per = (
    SELECT semestre 
    FROM periodos 
    WHERE año = (SELECT MAX(año) FROM periodos) 
    ORDER BY semestre DESC 
    LIMIT 1
  )
  AND TRIM(h.tipo_docente) != 'Planta'
GROUP BY 
  h.docente, 
  h.facultad_adscripcion, 
  h.identificacion
ORDER BY 
  h.facultad_adscripcion, 
  h.docente ASC;


      `);
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Error al obtener los profesores:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener los profesores' }), { status: 500 });
  }
}

/*`
SELECT 
  h.facultad_adscripcion AS facultad_adscripcion,
  h.identificacion,
  h.docente,
  SUM(CAST(h.horas AS DECIMAL)) AS total_horas,
  (
    SELECT GROUP_CONCAT(DISTINCT r.nombre SEPARATOR ', ')
    FROM nrv n
    JOIN resoluciones r ON r.idresolucion = n.r_id
    WHERE n.viabilidad IN (
      SELECT DISTINCT h2.cod_viab
      FROM historico h2
      WHERE h2.identificacion = h.identificacion
        AND h2.anno = (SELECT MAX(año) FROM periodos)
        AND h2.per = (
          SELECT semestre 
          FROM periodos 
          WHERE año = (SELECT MAX(año) FROM periodos) 
          ORDER BY semestre DESC 
          LIMIT 1
        )
    )
  ) AS resoluciones
FROM historico h
WHERE 
  h.anno = (SELECT MAX(año) FROM periodos) 
  AND h.per = (
    SELECT semestre 
    FROM periodos 
    WHERE año = (SELECT MAX(año) FROM periodos) 
    ORDER BY semestre DESC 
    LIMIT 1
  )
  AND TRIM(h.tipo_docente) != 'Planta'
GROUP BY 
  h.docente, 
  h.facultad_adscripcion, 
  h.identificacion
ORDER BY 
  h.facultad_adscripcion, 
  h.docente ASC;

`*/
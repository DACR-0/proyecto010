import { pool } from '@/utils/db';

export async function GET(req) {
  try {
    const [rows] = await pool.query(
         `
         SELECT h.cod_viab
FROM historico h
WHERE h.cod_viab IS NOT NULL
  AND anno = (
      SELECT MAX(año)
      FROM periodos
  )
  AND per = (
      SELECT semestre
      FROM periodos
      WHERE año = (SELECT MAX(año) FROM periodos)
      ORDER BY semestre DESC
      LIMIT 1
  )
  AND TRIM(tipo_docente) != 'Planta'
GROUP BY h.cod_viab
order by h.cod_viab;
         `
     );
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener programas' }), { status: 500 });
  }
}
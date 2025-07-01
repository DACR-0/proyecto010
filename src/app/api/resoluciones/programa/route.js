import { pool } from '@/utils/db';

export async function GET(req) {
  try {
    const [rows] = await pool.query(
         ` SELECT h.Programa
FROM historico h
WHERE anno = (
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
GROUP BY h.Pograma;`
     );
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener programas' }), { status: 500 });
  }
}
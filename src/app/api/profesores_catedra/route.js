import { pool } from '@/utils/db';

export async function GET(request) {
  try {
    const [rows] = await pool.query(`SELECT h.factultad_adscripcion AS factultad_adscripcion, h.Identificación, h.DOCENTE, SUM(CAST(h.horas AS DECIMAL)) AS total_horas 
FROM historico h
WHERE anno = '2025' AND per = '1' AND trim(tipo_docente)!='Planta'
GROUP BY h.DOCENTE, h.factultad_adscripcion, h.Identificación order by h.factultad_adscripcion,h.DOCENTE ASC;`);
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Error al obtener los profesores:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener los profesores' }), { status: 500 });
  }
}
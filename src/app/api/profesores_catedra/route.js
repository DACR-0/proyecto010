import { pool } from '@/utils/db';

export async function GET(request) {
  try {
    const [rows] = await pool.query(`SELECT h.facultad_adscripcion AS factultad_adscripcion, h.identificacion, h.docente, SUM(CAST(h.horas AS DECIMAL)) AS total_horas 
FROM historico h
WHERE anno = '2025' AND per = '1' AND trim(tipo_docente)!='Planta'
GROUP BY h.docente, h.facultad_adscripcion, h.identificacion order by h.facultad_adscripcion,h.docente ASC;`);
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Error al obtener los profesores:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener los profesores' }), { status: 500 });
  }
}
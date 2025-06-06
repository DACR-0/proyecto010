import { pool } from '@/utils/db';

export async function GET(request) {
  try {
    const [rows] = await pool.query(`
      SELECT 
    (SELECT count(horas) FROM proyecto010.historico WHERE anno=(SELECT MAX(año) FROM periodos) AND per=(SELECT semestre FROM periodos WHERE año = ( SELECT MAX(año) FROM periodos) ORDER BY semestre DESC LIMIT 1) AND TRIM(tipo_hora)='Catedra') AS horas_catedra,
    (SELECT count(horas) FROM proyecto010.historico WHERE anno=(SELECT MAX(año) FROM periodos) AND per=(SELECT semestre FROM periodos WHERE año = ( SELECT MAX(año) FROM periodos) ORDER BY semestre DESC LIMIT 1) AND TRIM(tipo_hora)='Tiempo completo') AS horas_planta,
    (SELECT count(horas) FROM proyecto010.historico WHERE anno=(SELECT MAX(año) FROM periodos) AND per=(SELECT semestre FROM periodos WHERE año = ( SELECT MAX(año) FROM periodos) ORDER BY semestre DESC LIMIT 1) AND TRIM(tipo_hora)='Ocasional') AS horas_ocasionales,
    (SELECT count(horas) FROM proyecto010.historico WHERE anno=(SELECT MAX(año) FROM periodos)' AND per=(SELECT semestre FROM periodos WHERE año = ( SELECT MAX(año) FROM periodos) ORDER BY semestre DESC LIMIT 1) AND TRIM(tipo_hora)='Honorario') AS horas_honorarios,
    (SELECT count(horas) FROM proyecto010.historico WHERE anno=(SELECT MAX(año) FROM periodos) AND per=(SELECT semestre FROM periodos WHERE año = ( SELECT MAX(año) FROM periodos) ORDER BY semestre DESC LIMIT 1)) AS horas_total;
`);
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Error al obtener los profesores:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener los profesores' }), { status: 500 });
  }
}
import { pool } from '@/utils/db';

export async function GET(request) {
  try {
    const [rows] = await pool.query(`
    SELECT 
    (SELECT count(horas) FROM proyecto010.historico WHERE anno=(SELECT MAX(año) FROM periodos) AND per=(SELECT semestre FROM periodos WHERE año = ( SELECT MAX(año) FROM periodos) ORDER BY semestre DESC LIMIT 1) AND TRIM(tipo_hora)='Catedra') AS horas_catedra,
    (SELECT count(horas) FROM proyecto010.historico WHERE anno=(SELECT MAX(año) FROM periodos) AND per=(SELECT semestre FROM periodos WHERE año = ( SELECT MAX(año) FROM periodos) ORDER BY semestre DESC LIMIT 1) AND TRIM(tipo_hora)='Tiempo completo') AS horas_planta,
    (SELECT count(horas) FROM proyecto010.historico WHERE anno=(SELECT MAX(año) FROM periodos) AND per=(SELECT semestre FROM periodos WHERE año = ( SELECT MAX(año) FROM periodos) ORDER BY semestre DESC LIMIT 1) AND TRIM(tipo_hora)='Ocasional') AS horas_ocasionales,
    (SELECT count(horas) FROM proyecto010.historico WHERE anno=(SELECT MAX(año) FROM periodos) AND per=(SELECT semestre FROM periodos WHERE año = ( SELECT MAX(año) FROM periodos) ORDER BY semestre DESC LIMIT 1) AND TRIM(tipo_hora)='Honorario') AS horas_honorarios,
    (SELECT count(horas) FROM proyecto010.historico WHERE anno=(SELECT MAX(año) FROM periodos) AND per=(SELECT semestre FROM periodos WHERE año = ( SELECT MAX(año) FROM periodos) ORDER BY semestre DESC LIMIT 1)) AS horas_total,
    (SELECT COUNT(DISTINCT identificacion) FROM proyecto010.historico WHERE anno=(SELECT MAX(año) FROM periodos) AND per=(SELECT semestre FROM periodos WHERE año = ( SELECT MAX(año) FROM periodos) ORDER BY semestre DESC LIMIT 1) AND tipo_docente='Catedra') AS docente_catedra,
    (SELECT COUNT(DISTINCT identificacion) FROM proyecto010.historico WHERE anno=(SELECT MAX(año) FROM periodos) AND per=(SELECT semestre FROM periodos WHERE año = ( SELECT MAX(año) FROM periodos) ORDER BY semestre DESC LIMIT 1) AND tipo_docente='Planta') AS planta_programado,
    (select count(*) from profesores) AS docente_planta,
    (SELECT COUNT(DISTINCT historico.identificacion) FROM historico WHERE anno=(SELECT MAX(año) FROM periodos) AND per=(SELECT semestre FROM periodos WHERE año = ( SELECT MAX(año) FROM periodos) ORDER BY semestre DESC LIMIT 1) AND tipo_docente='Ocasional') AS docente_ocasional,
    (SELECT COUNT(DISTINCT historico.identificacion) FROM historico WHERE anno=(SELECT MAX(año) FROM periodos) AND per=(SELECT semestre FROM periodos WHERE año = ( SELECT MAX(año) FROM periodos) ORDER BY semestre DESC LIMIT 1) AND (tipo_docente='Personal Administrativo' or tipo_docente='Contratistas a Trmino Fijo')) AS personal_admin,
    (SELECT COUNT(DISTINCT historico.identificacion) FROM historico WHERE anno=(SELECT MAX(año) FROM periodos) AND per=(SELECT semestre FROM periodos WHERE año = ( SELECT MAX(año) FROM periodos) ORDER BY semestre DESC LIMIT 1) AND tipo_docente='Pensionados / Jubilados') as pensionados,
    (SELECT COUNT(DISTINCT docente) FROM proyecto010.historico WHERE anno=(SELECT MAX(año) FROM periodos) AND per=(SELECT semestre FROM periodos WHERE año = ( SELECT MAX(año) FROM periodos) ORDER BY semestre DESC LIMIT 1)) AS total_docentes,
    (select count(*) from situacion_admin where estado='activo') AS s_admin;
`);
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Error al obtener los profesores:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener los profesores' }), { status: 500 });
  }
}
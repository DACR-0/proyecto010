import { pool } from '@/utils/db';

export async function GET(request) {
  try {
    const [rows] = await pool.query(`SELECT di.id_di,di.id_profesor, p.nombre AS nombre_profesor, fi.nombre_fi, di.porcentaje, di.soporte AS soporte,DATE_FORMAT(di.fecha_inicio, '%Y-%m-%d') as fecha_inicio , DATE_FORMAT(di.fecha_fin, '%Y-%m-%d') as fecha_fin
FROM proyecto010.descarga_investigacion di 
JOIN proyecto010.profesores p ON di.id_profesor = p.numero_doc 
JOIN proyecto010.f_investigacion fi ON di.id_fi = fi.id_fi
where di.periodo = (SELECT periodo FROM proyecto010.periodos where año=(SELECT MAX(año) FROM periodos) and semestre=(SELECT semestre FROM periodos WHERE año = ( SELECT MAX(año) FROM periodos) ORDER BY semestre DESC LIMIT 1))
;`);
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Ocurrio un error', error);
    return new Response(JSON.stringify({ error: 'Error' }), { status: 500 });
  }
}
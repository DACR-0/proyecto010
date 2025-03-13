import { pool } from '@/utils/db';

export async function GET(request) {
  try {
    const [rows] = await pool.query(`SELECT sa.idsituacion_admin ,sa.id_profesor,
p.nombre AS nombre_profesor, 
sad.nombre AS nombre_sa, 
DATE_FORMAT(sa.fecha_inicio, '%Y-%m-%d') AS fecha_inicio_str,
    DATE_FORMAT(sa.fecha_fin, '%Y-%m-%d') AS fecha_fin_str,
    sa.soporte 
FROM proyecto010.situacion_admin sa
JOIN s_admin sad ON sa.id_s_a = sad.ids_admin
JOIN profesores p ON sa.id_profesor = p.numero_doc;
`);
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Ocurrio un error', error);
    return new Response(JSON.stringify({ error: 'Error' }), { status: 500 });
  }
}
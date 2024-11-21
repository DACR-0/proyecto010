import { pool } from '@/utils/db';

export async function GET(request) {
  try {
    const [rows] = await pool.query('SELECT p.nombre AS nombre_profesor, fe.nombre_fe, de.porcentaje FROM proyecto010.descarga_extencion de JOIN proyecto010.profesores p ON de.id_profesor = p.numero_doc JOIN proyecto010.f_extencion fe ON de.id_fe = fe.id_fe;');
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Ocurrio un error', error);
    return new Response(JSON.stringify({ error: 'Error' }), { status: 500 });
  }
}
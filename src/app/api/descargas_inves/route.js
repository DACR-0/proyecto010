import { pool } from '@/utils/db';

export async function GET(request) {
  try {
    const [rows] = await pool.query('SELECT p.nombre AS nombre_profesor, fi.nombre_fi, di.porcentaje FROM proyecto010.descarga_investigacion di JOIN proyecto010.profesores p ON di.id_profesor = p.numero_doc JOIN proyecto010.f_investigacion fi ON di.id_fi = fi.id_fi;');
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Ocurrio un error', error);
    return new Response(JSON.stringify({ error: 'Error' }), { status: 500 });
  }
}
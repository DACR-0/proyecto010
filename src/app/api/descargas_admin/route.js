import { pool } from '@/utils/db';

export async function GET(request) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.nombre AS nombre_profesor, 
        fa.nombre_cargo, 
        da.porcentaje, 
        TO_BASE64(da.soporte) AS soporte
      FROM proyecto010.descarga_admin da
      JOIN proyecto010.profesores p ON da.id_profesor = p.numero_doc
      JOIN proyecto010.f_administrativas fa ON da.id_fa = fa.id_fa
    `);
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Ocurrió un error', error);
    return new Response(JSON.stringify({ error: 'Error' }), { status: 500 });
  }
}
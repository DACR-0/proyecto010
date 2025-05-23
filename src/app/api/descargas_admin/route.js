import { pool } from '@/utils/db';

export async function GET(request) {
  try {
    const [rows] = await pool.query(`
      SELECT  da.id_da,
        da.id_profesor,
        p.nombre AS nombre_profesor, 
        fa.nombre_cargo, 
        fa.porcentaje, 
        da.soporte AS soporte,
        da.soporte2 AS soporte2
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
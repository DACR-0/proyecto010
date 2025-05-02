import { pool } from '@/utils/db';

export async function GET() {
  try {
    const [years] = await pool.query('SELECT año as anno FROM proyecto010.periodos group by año order by año DESC;');
    const [periods] = await pool.query('SELECT semestre as per FROM proyecto010.periodos group by semestre order by semestre DESC;');

    return new Response(JSON.stringify({
      years: years.map(row => row.anno),
      periods: periods.map(row => row.per),
    }), { status: 200 });
  } catch (error) {
    console.error('Error obteniendo años y períodos:', error);
    return new Response(JSON.stringify({ error: 'Error en la base de datos' }), { status: 500 });
  }
}

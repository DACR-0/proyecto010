import { pool } from '@/utils/db';

export async function GET(request) {
  try {
    const [rows] = await pool.query('select g.nombre from profesores p join programa g on p.id_programa = g.id group by p.id_programa;');
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Error al obtener los programas:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener los programas' }), { status: 500 });
  }
}
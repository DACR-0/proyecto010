import { pool } from '@/utils/db'; // Ajusta esta ruta si tu archivo de conexión está en otro lugar

export async function POST(request) {
  try {
    const body = await request.json();
    const { profesor, rows, periodo } = body;

    if (!profesor || !rows || rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Datos insuficientes' }), { status: 400 });
    }

    for (const row of rows) {
      const { cargo, porcentaje, soporte } = row;

      // Obtener id_fa del cargo
      const [result] = await pool.query(
        'SELECT id_fa FROM f_administrativas WHERE nombre_cargo = ?',
        [cargo]
      );

      if (result.length === 0) {
        return new Response(JSON.stringify({ error: `Cargo no encontrado: ${cargo}` }), { status: 404 });
      }

      const id_fa = result[0].id_fa;

      // Insertar la descarga en la base de datos
      await pool.query(
        'INSERT INTO descarga_admin (id_profesor, id_fa, porcentaje, soporte, periodo) VALUES (?, ?, ?, ?, ?)',
        [profesor, id_fa, porcentaje, soporte || null, periodo]
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    console.error('Error al insertar descargas:', error);
    return new Response(JSON.stringify({ error: 'Error interno al insertar descargas' }), { status: 500 });
  }
}


import { pool } from '@/utils/db';

export async function GET(req) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        r.idresolucion,
        r.nombre,
        r.archivo,
        r.programa,
        GROUP_CONCAT(DISTINCT n.viabilidad SEPARATOR ', ') AS viabilidades
      FROM resoluciones r
      LEFT JOIN nrv n ON r.idresolucion = n.r_id
      GROUP BY r.idresolucion
      ORDER BY r.idresolucion DESC
    `);
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener resoluciones' }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { nombre, archivo, programa, viabilidades } = body;

    if (!nombre) {
      return new Response(JSON.stringify({ error: 'El nombre es obligatorio' }), { status: 400 });
    }

    // 1. Insertar la resolución
    const [result] = await pool.query(
      'INSERT INTO resoluciones (nombre, archivo, programa) VALUES (?, ?, ?)',
      [nombre, archivo || null, programa || null]
    );
    const idresolucion = result.insertId;

    // 2. Insertar cada viabilidad en la tabla nrv
    if (Array.isArray(viabilidades)) {
      for (const v of viabilidades) {
        await pool.query(
          'INSERT INTO nrv (r_id, viabilidad) VALUES (?, ?)',
          [idresolucion, v.cod_viab]
        );
      }
    }

    return new Response(JSON.stringify({ success: true, idresolucion }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al crear resolución', detalle: error.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID requerido' }), { status: 400 });
    }

    // Primero elimina las viabilidades asociadas en nrv
    await pool.query('DELETE FROM nrv WHERE r_id = ?', [id]);
    // Luego elimina la resolución
    await pool.query('DELETE FROM resoluciones WHERE idresolucion = ?', [id]);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al eliminar resolución', detalle: error.message }), { status: 500 });
  }
}
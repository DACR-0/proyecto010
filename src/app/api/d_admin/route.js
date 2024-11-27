import mysql from 'mysql2';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuración de conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Cambia según tu configuración
  password: 'root',
  database: 'proyecto010'
});

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './public/uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Crea el directorio si no existe
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Genera un nombre único
  }
});

const upload = multer({ storage: storage });

export async function POST(req) {
  return new Promise((resolve, reject) => {
    const formDataParser = upload.any();

    formDataParser(req, {}, async (err) => {
      if (err) {
        console.error('Error al procesar archivos:', err);
        return resolve(
          new Response(
            JSON.stringify({ success: false, message: 'Error al procesar los archivos' }),
            { status: 400 }
          )
        );
      }

      try {

        const data = await req.formData();

        const profesor = data.get("profesor");
        const periodo = data.get("periodo");
        const cantidadArchivos = data.get("cantidadArchivos");

        let rows = [];

        for(var i = 0 ; i < cantidadArchivos ; i++) {
          rows.push({
            cargo: data.get(`rows[${i}][cargo]`),
            soporte: data.get(`rows[${i}][soporte]`)
          });
        }
        console.log("PROFESOR: ", profesor);
        console.log("PERIODO: ", periodo);
        console.log("CANTIDAD ARCHIVOS: ", cantidadArchivos);
        console.log("FILAS: ", rows);

        const sqlInsert = `
          INSERT INTO descarga_admin (id_profesor, id_fa, soporte, periodo)
          VALUES (?, ?, ?, ?)
        `;

        for (const row of rows) {
          if (row.cargo && row.soporte) {
            /*const file = req.files.find((f) => f.originalname === row.soporte.name);

            if (!file) {
              console.error('Archivo no encontrado para la fila:', row);
              continue;
            }*/

            await new Promise((innerResolve, innerReject) => {
              db.query(sqlInsert, [profesor, row.cargo, `./public/uploads/${row.soporte.name}`, periodo], (err) => {
                if (err) {
                  console.error('Error al insertar en la base de datos:', err);
                  return innerReject(err);
                }
                innerResolve();
              });
            });
          } else {
            console.warn('Fila incompleta, no se procesará:', row);
          }
        }

        resolve(
          new Response(
            JSON.stringify({ success: true, message: 'Descargas subidas exitosamente' }),
            { status: 200 }
          )
        );
      } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        resolve(
          new Response(
            JSON.stringify({ success: false, message: 'Error al procesar la solicitud' }),
            { status: 500 }
          )
        );
      }
    });
  });
}

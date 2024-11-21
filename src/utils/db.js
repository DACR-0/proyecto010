import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',       //  host de tu base de datos
  user: 'root',      // usuario de la base de datos
  password: 'root', // contraseña
  database: 'proyecto010',   // nombre de tu base de datos
  waitForConnections: true,
  connectionLimit: 10,     // Límite de conexiones simultáneas
  queueLimit: 0,
});
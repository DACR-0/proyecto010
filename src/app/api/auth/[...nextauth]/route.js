// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { pool } from "@/utils/db"; // Ajusta la ruta según tu proyecto

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Consulta en la base de datos
        const [rows] = await pool.query(
          "SELECT * FROM user WHERE username = ? AND password = ?",
          [credentials.email, credentials.password]
        );

        if (rows.length > 0) {
          // Usuario encontrado
          const user = rows[0];
          return {
            id: user.iduser,
            name: user.username,
            email: user.username,
          };
        }

        // Usuario no encontrado
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
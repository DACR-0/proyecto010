import CredentialsProvider from "next-auth/providers/credentials";
import { pool } from "@/utils/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const [rows] = await pool.query(
          "SELECT * FROM user WHERE username = ? AND password = ?",
          [credentials.email, credentials.password]
        );

        if (rows.length > 0) {
          const user = rows[0];
          return {
            id: user.iduser,
            name: user.username,
            email: user.username,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

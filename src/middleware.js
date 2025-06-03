import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // Permitir acceso libre a /login y /api/auth
  if (
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // Verifica si hay token de sesión
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Si no hay token, redirige a /login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Si hay token, permite el acceso
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protege todas las rutas excepto las siguientes:
    "/((?!login|api/auth|_next/static|_next/image|favicon.ico|robots.txt|manifest.json).*)",
  ],
};
// This middleware checks if the user is authenticated before accessing the dashboard. If not, it redirects to the login page.
// You can adjust the matcher to include other routes as needed.
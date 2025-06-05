import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./global.css";
import SessionWrapper from "./SessionWrapper";
import ThemeRegistry from "./ThemeRegistry";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Proyecto 010",
  authors: [{ name: "DARIO ALEJANDRO CASTAÑO RUIZ"}],
  description: "Aplicativo para gestion de la programacion academica",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionWrapper>
          <ThemeRegistry>
            {children}
          </ThemeRegistry>
        </SessionWrapper>
      </body>
    </html>
  );
}
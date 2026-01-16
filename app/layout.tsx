import "./globals.css";
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import CustomCursor from "@/components/CustomCursor";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "AURA REBORN — E-Commerce de Lujo",
  description: "Experiencia sensorial de alta perfumería.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className={`${playfair.variable} ${inter.variable} font-sans min-h-screen bg-bg text-text antialiased`}>
        {/* Capa de textura de grano de película fija */}
        <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}

import "./globals.css";
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import CustomCursor from "@/components/CustomCursor";
import PayPalWrapper from "@/components/PayPalWrapper";



const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "ÍKHOR — E-Commerce de Lujo",
  description: "Experiencia sensorial de alta perfumería.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className={`${playfair.variable} ${inter.variable} font-sans...`}>
  <CustomCursor />
  <PayPalWrapper>
    {children}
  </PayPalWrapper>
</body>

    </html>
  );
}

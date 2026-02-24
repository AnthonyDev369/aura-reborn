import "./globals.css";
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import CustomCursor from "@/components/CustomCursor";
import PayPalWrapper from "@/components/PayPalWrapper";



const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "ÍKHOR — Alta Perfumería | Ecuador",
  description: "Descubre fragancias premium de diseñador, árabes y de nicho. Pre-orden directa desde proveedores internacionales. Envíos a todo Ecuador.",
  keywords: ["perfumes", "fragancias", "perfumería premium", "Ecuador", "pre-orden", "nicho", "árabe", "diseñador"],
  openGraph: {
    title: "ÍKHOR — Alta Perfumería | Ecuador",
    description: "Fragancias premium con pre-orden directa. Diseñador, árabe y nicho.",
    url: "https://ikhor.store",
    siteName: "ÍKHOR",
    locale: "es_EC",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ÍKHOR — Alta Perfumería | Ecuador",
    description: "Fragancias premium con pre-orden directa. Diseñador, árabe y nicho.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
   <html lang="es" className="dark" suppressHydrationWarning>

      <body className={`${playfair.variable} ${inter.variable} font-sans...`}>
  <CustomCursor />
  <PayPalWrapper>
    {children}
  </PayPalWrapper>
</body>

    </html>
  );
}

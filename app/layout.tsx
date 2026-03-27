import "./globals.css";
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import CustomCursor from "@/components/CustomCursor";
import PayPalWrapper from "@/components/PayPalWrapper";



const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "ÍKHOR — Perfumería Premium Ecuador",
  description: "Perfumes originales importados con pre-orden automática. Envío a todo Ecuador. PayPal, transferencia bancaria y cripto.",
  keywords: ["perfumes", "Ecuador", "ÍKHOR", "perfumería premium", "pre-orden", "fragancias"],
  openGraph: {
    title: "ÍKHOR — Perfumería Premium Ecuador",
    description: "Perfumes originales importados con pre-orden automática. Envío a todo Ecuador.",
    type: "website",
    locale: "es_EC",
    siteName: "ÍKHOR",
  },
  twitter: {
    card: "summary_large_image",
    title: "ÍKHOR — Perfumería Premium Ecuador",
    description: "Perfumes originales importados con pre-orden automática.",
  },
  robots: {
    index: true,
    follow: true,
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

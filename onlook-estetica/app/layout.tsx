import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Agente de WhatsApp para centros de estética · Citas 24/7 | Studio32",
  description:
    "Un agente de IA que atiende el WhatsApp de tu centro de estética mientras estás en cabina: deja que te cuenten el caso sin elegir tratamiento, respeta tu política de precios y cierra la cita con la profesional que piden.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-full font-body text-ink bg-bg antialiased">
        {children}
      </body>
    </html>
  );
}

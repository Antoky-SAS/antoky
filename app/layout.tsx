import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./tokens.css";
import "./globals.css";

// Archivo latin exacto que sirve Google Fonts (opsz 12–96, wght 300–800), self-hosted con next/font:
// se precarga y no bloquea el render. next/font/google entrega otra versión con métricas distintas.
const bricolage = localFont({
  src: "./fonts/bricolage-grotesque-latin.woff2",
  weight: "300 800",
  display: "swap",
  variable: "--font-bricolage",
});

const description =
  "Antoky: software SaaS y desarrollo a la medida para empresas, microempresas y colegios. Tecnología con compromiso y visión de futuro, desde Colombia.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://antoky.com"),
  title: "Antoky S.A.S · Soluciones tecnológicas desde Colombia",
  description,
  openGraph: {
    title: "Antoky S.A.S · Soluciones tecnológicas desde Colombia",
    description,
    type: "website",
    locale: "es_CO",
    siteName: "Antoky",
    images: ["/assets/antoky-logo-negro.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={bricolage.variable}>
      <body>{children}</body>
    </html>
  );
}

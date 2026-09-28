import type { Metadata, Viewport } from "next";
import "./tokens.css";
import "./globals.css";

const description =
  "Antoky: software SaaS y desarrollo a la medida para empresas, microempresas y colegios. Tecnología con compromiso y visión de futuro, desde Colombia.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://antoky.com"),
  title: "Antoky · Soluciones tecnológicas desde Colombia",
  description,
  openGraph: {
    title: "Antoky · Soluciones tecnológicas desde Colombia",
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
    <html lang="es-CO">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=Inter:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

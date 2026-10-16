import type { Metadata, Viewport } from "next";
import { Geist_Mono, Instrument_Serif, Schibsted_Grotesk } from "next/font/google";
import "./home.css";

// next/font descarga las fuentes en el build y las sirve desde el propio sitio.
const sans = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-sans",
});
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});
const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});

const title = "Antoky S.A.S · Software a medida, automatización e IA para empresas";
const description =
  "Desarrollamos software a medida, automatizaciones y soluciones con inteligencia artificial para que tu empresa trabaje con mayor eficiencia. Agroindustria y distribución, desde Colombia.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://antoky.com"),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "es_CO",
    siteName: "Antoky",
    images: ["/assets/antoky-logo-negro.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#F3F3F0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}

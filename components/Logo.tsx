import { assets } from "./assets";

export interface LogoProps {
  /** `logo` = logotipo horizontal "ANTOKY" (1383×209); `isotipo` = símbolo A+Y (837×526). */
  kind?: "logo" | "isotipo";
  /** `blanco` sobre fondos oscuros (por defecto), `negro` sobre fondos claros. Ambos llevan la barra amarilla: no los ponga sobre amarillo. */
  tone?: "blanco" | "negro";
  /** Alto en px. Por defecto 24 (el del header). */
  height?: number;
}

/** Logotipo o isotipo de Antoky en blanco o negro. */
export function Logo({ kind = "logo", tone = "blanco", height = 24 }: LogoProps) {
  const src =
    kind === "logo"
      ? tone === "blanco" ? assets.logoBlanco : assets.logoNegro
      : tone === "blanco" ? assets.isotipoBlanco : assets.isotipoNegro;
  return <img src={src} alt="Antoky" style={{ height, width: "auto", display: "block" }} />;
}

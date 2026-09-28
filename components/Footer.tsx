import { FooterLogo } from "./FooterLogo";

export interface FooterProps {
  /** Lema en mayúsculas espaciadas, a la izquierda. */
  tagline?: string;
  /** Texto legal a la derecha. */
  copyright?: string;
}

/** Footer negro con el logotipo de Antoky a todo el ancho (brillo iridiscente en hover), lema y copyright sobre un divisor. */
export function Footer({ tagline = "Tecnología con compromiso y visión de futuro", copyright = "© 2026 Antoky · Colombia" }: FooterProps) {
  return (
    <footer className="footer">
      <div className="wrap footer-in">
        <FooterLogo />
        <div className="footer-bottom">
          <span className="footer-tag m">{tagline}</span>
          <span>{copyright}</span>
        </div>
      </div>
    </footer>
  );
}

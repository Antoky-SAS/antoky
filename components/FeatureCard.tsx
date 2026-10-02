import { Button } from "./Button";
import { ChipList } from "./ChipList";

export interface FeatureCardProps {
  /** Chips superiores con las funcionalidades clave. */
  chips?: string[];
  title: string;
  text: string;
  /** Viñetas cortas con marcador amarillo inclinado. */
  bullets?: string[];
  cta?: { label: string; href: string };
  /** Filas de fotos que desfilan a la derecha (alternan dirección). Sin filas, la tarjeta ocupa solo el bloque de texto. */
  gallery?: string[][];
}

/** Tarjeta destacada de producto: bloque translúcido (glass) redondeado (20px) con inclinación 3D suave con chips, título, texto, viñetas y CTA amarillo, más galería animada de fotos. */
export function FeatureCard({ chips, title, text, bullets, cta, gallery }: FeatureCardProps) {
  return (
    <article className="card-edu" data-tilt="" data-tilt-scale="0.4">
      <div className="card-edu-text" data-depth="1">
        {chips && chips.length > 0 && <ChipList items={chips} />}
        <h2 className="m">{title}</h2>
        <p>{text}</p>
        {bullets && bullets.length > 0 && (
          <div className="bullets">
            {bullets.map((t) => (
              <span key={t}>
                <i />
                {t}
              </span>
            ))}
          </div>
        )}
        {cta && (
          <Button href={cta.href} className="card-edu-cta">
            {cta.label}
          </Button>
        )}
      </div>
      {gallery && gallery.length > 0 && (
        <div className="galeria" data-depth="-0.6">
          {gallery.map((fotos, r) => (
            <div key={r} className={`galeria-row${r % 2 ? " rev" : ""}`}>
              {[...fotos, ...fotos].map((src, i) => (
                <img key={i} src={src} alt="" loading="lazy" decoding="async" />
              ))}
            </div>
          ))}
          <div className="galeria-fade" />
        </div>
      )}
    </article>
  );
}

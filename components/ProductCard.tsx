import { Button } from "./Button";

export interface ProductCardProps {
  /** Captura del producto (16:10, a sangre arriba de la tarjeta). */
  image: string;
  alt?: string;
  /** Etiqueta amarilla, p. ej. "Producto propio · Agendamiento". */
  tag: string;
  title: string;
  text: string;
  /** Sitio externo del producto; se abre en pestaña nueva con "Visitar sitio ↗". */
  url: string;
  /** Destino de "Solicitar demo". */
  demoHref?: string;
}

/** Tarjeta translúcida (glass) de producto propio, con inclinación 3D: captura arriba, etiqueta, título, texto y botones "Visitar sitio ↗" / "Solicitar demo" alineados abajo. */
export function ProductCard({ image, alt = "", tag, title, text, url, demoHref = "#contacto" }: ProductCardProps) {
  return (
    <article className="card-prod" data-tilt="">
      <div className="card-prod-shot" data-depth="-0.7">
        <img src={image} alt={alt} loading="lazy" decoding="async" />
      </div>
      <div className="card-prod-body" data-depth="1">
        <span className="card-prod-tag">{tag}</span>
        <h3 className="m">{title}</h3>
        <p>{text}</p>
        <div className="card-prod-ctas">
          <Button href={url} external>
            Visitar sitio ↗
          </Button>
          <Button variant="outline" href={demoHref}>
            Solicitar demo
          </Button>
        </div>
      </div>
    </article>
  );
}

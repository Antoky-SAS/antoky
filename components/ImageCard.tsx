import { Button } from "./Button";

export interface ImageCardProps {
  /** URL de la foto de fondo (cubre toda la tarjeta). */
  image: string;
  alt?: string;
  title: string;
  text: string;
  cta?: { label: string; href: string };
}

/** Tarjeta de producto con foto a sangre, degradado negro inferior, título, texto y CTA blanco. Alto mínimo 420px. */
export function ImageCard({ image, alt = "", title, text, cta }: ImageCardProps) {
  return (
    <article className="card-img" data-tilt="">
      <img src={image} alt={alt} loading="lazy" data-depth="-1.2" />
      <div className="card-img-shade" />
      <div className="card-img-body" data-depth="1.3">
        <h3 className="m">{title}</h3>
        <p>{text}</p>
        {cta && (
          <Button variant="light" href={cta.href} className="card-img-cta">
            {cta.label}
          </Button>
        )}
      </div>
    </article>
  );
}

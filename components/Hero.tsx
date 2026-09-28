import { Fragment, type ReactNode } from "react";
import { Button } from "./Button";

export interface HeroProps {
  /** Ancla de la sección. */
  id?: string;
  /** Etiquetas: en escritorio van en una píldora separadas por "|", en móvil como chips. */
  tags?: string[];
  /** Título h1. Envuelva el remate en `<span>` para pintarlo de amarillo. */
  title?: ReactNode;
  subtitle?: ReactNode;
  primaryCta?: { label: string; href: string };
  /** CTA blanco; pase `null` para omitirlo. */
  secondaryCta?: { label: string; href: string } | null;
}

const TAGS = ["SaaS", "Desarrollo a la medida", "Empresas · Microempresas · Colegios"];

/** Hero de portada: fondo negro con trama de puntos, píldora de etiquetas, título gigante con remate amarillo y dos CTAs. */
export function Hero({
  id = "inicio",
  tags = TAGS,
  title = (
    <>
      Soluciones tecnológicas
      <br />
      <span>para un futuro más humano</span>
      <br />
      desde Colombia
    </>
  ),
  subtitle = "Tecnología con compromiso y visión de futuro",
  primaryCta = { label: "Hablemos", href: "#contacto" },
  secondaryCta = { label: "Ver soluciones", href: "#proyectos" },
}: HeroProps) {
  const mobileTags = tags.flatMap((t) => t.split(" · "));
  return (
    <section id={id} className="hero">
      <div className="hero-dots" />
      <div className="wrap hero-in">
        <div className="hero-pill only-desktop">
          {tags.map((t, i) => (
            <Fragment key={t}>
              {i > 0 && <span className="sep">|</span>}
              <span>{t}</span>
            </Fragment>
          ))}
        </div>
        <div className="hero-pills only-mobile">
          {mobileTags.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
        <h1 className="m">{title}</h1>
        <p className="hero-sub m">{subtitle}</p>
        <div className="hero-ctas">
          <Button size="hero" href={primaryCta.href}>
            {primaryCta.label}
          </Button>
          {secondaryCta && (
            <Button variant="light" size="hero" href={secondaryCta.href}>
              {secondaryCta.label}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

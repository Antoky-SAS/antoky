export interface MarqueeProps {
  /** Palabras que desfilan, separadas por un paralelogramo amarillo. */
  words?: string[];
}

const WORDS = ["Innovación", "Estrategia", "Personas", "Resultados", "SaaS", "Desarrollo a la medida"];

/** Cinta animada de palabras en mayúsculas (Bricolage Grotesque 700, 22px) que se desplaza en bucle. */
export function Marquee({ words = WORDS }: MarqueeProps) {
  const track = [...words, ...words, ...words, ...words];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {track.map((w, i) => (
          <span key={i} className="marquee-item m">
            {w}
            <i />
          </span>
        ))}
      </div>
    </div>
  );
}

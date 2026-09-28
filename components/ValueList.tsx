export interface ValueListProps {
  /** Valores de marca, uno por línea. */
  items?: string[];
  /** Índice del valor resaltado en amarillo. Por defecto el último. */
  highlightIndex?: number;
}

const VALORES = ["Innovación", "Estrategia", "Personas", "Resultados"];

/** Lista vertical de valores de marca en mayúsculas espaciadas; uno resaltado en amarillo. */
export function ValueList({ items = VALORES, highlightIndex = items.length - 1 }: ValueListProps) {
  return (
    <div className="valores m">
      {items.map((v, i) => (
        <span key={v} className={i === highlightIndex ? "y" : undefined}>
          {v}
        </span>
      ))}
    </div>
  );
}

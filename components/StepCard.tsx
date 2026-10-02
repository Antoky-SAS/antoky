export interface StepCardProps {
  /** Número grande del paso, p. ej. "01". */
  number: string;
  title: string;
  text: string;
  /** Versión amarilla (el paso final / destacado). */
  highlight?: boolean;
}

/** Tarjeta de paso del proceso: número gigante amarillo, título abajo y descripción gris. Alto mínimo 320px. */
export function StepCard({ number, title, text, highlight }: StepCardProps) {
  return (
    <div className={`paso${highlight ? " y" : ""}`} data-tilt="">
      <span className="paso-num m" data-depth="1.4">{number}</span>
      <h3 className="m">{title}</h3>
      <p>{text}</p>
    </div>
  );
}

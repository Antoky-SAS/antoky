import { StepCard } from "./StepCard";

export interface ProcessStepsProps {
  /** Pasos en orden; se numeran 01, 02… y el último va en amarillo. */
  steps?: { title: string; text: string }[];
}

const PASOS: NonNullable<ProcessStepsProps["steps"]> = [
  { title: "Diagnóstico", text: "Entendemos su organización, sus procesos y lo que necesita resolver." },
  { title: "Estrategia", text: "Definimos alcance, tiempos y costos por escrito." },
  { title: "Desarrollo", text: "Construimos por etapas y le mostramos avances reales en cada una." },
  { title: "Resultados y soporte", text: "Capacitamos a su equipo y seguimos acompañándolo después del lanzamiento." },
];

/** Rejilla de pasos del proceso (4 columnas en escritorio, 2 en tablet, 1 en móvil). */
export function ProcessSteps({ steps = PASOS }: ProcessStepsProps) {
  return (
    <div className="pasos">
      {steps.map((p, i) => (
        <StepCard
          key={p.title}
          number={String(i + 1).padStart(2, "0")}
          title={p.title}
          text={p.text}
          highlight={i === steps.length - 1}
        />
      ))}
    </div>
  );
}

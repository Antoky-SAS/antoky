import type { ReactNode } from "react";

export interface EyebrowProps {
  /** Convención del sitio: número de sección + raya + nombre, p. ej. "01 — Productos". */
  children: ReactNode;
}

/** Antetítulo de sección: 12px, mayúsculas, tracking 0.3em, gris #9AA0A6 (en secciones claras #686F76). */
export function Eyebrow({ children }: EyebrowProps) {
  return <div className="eyebrow m">{children}</div>;
}

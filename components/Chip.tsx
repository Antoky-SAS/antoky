import type { ReactNode } from "react";

export interface ChipProps {
  children: ReactNode;
}

/** Etiqueta en píldora: texto amarillo 13px sobre superficie #16181B con borde #2A2E33. */
export function Chip({ children }: ChipProps) {
  return <span className="chip">{children}</span>;
}

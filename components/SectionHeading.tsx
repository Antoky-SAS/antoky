import type { ReactNode } from "react";

export interface SectionHeadingProps {
  /** Texto principal del título. */
  children: ReactNode;
  /** Remate resaltado en amarillo, se añade después de `children`. */
  highlight?: ReactNode;
}

/** Título grande de sección (h2): Bricolage Grotesque 700, 38–68px fluido, tracking -0.035em, remate opcional en amarillo. */
export function SectionHeading({ children, highlight }: SectionHeadingProps) {
  return (
    <h2 className="h2-big m">
      {children}
      {highlight && <span className="hl">{highlight}</span>}
    </h2>
  );
}

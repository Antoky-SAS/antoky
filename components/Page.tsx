import type { ReactNode } from "react";

export interface PageProps {
  children: ReactNode;
  /** Ocupa al menos el alto de la ventana. Por defecto true, como en el sitio. */
  fill?: boolean;
}

/** Raíz de toda página Antoky: fondo negro #0B0B0B, texto #F5F5F5 y tipografía Bricolage Grotesque. Envuelva siempre la composición en él. */
export function Page({ children, fill = true }: PageProps) {
  return (
    <div className="page" style={fill ? undefined : { minHeight: 0 }}>
      {children}
    </div>
  );
}

import type { ReactNode } from "react";

export interface ButtonProps {
  /** `primary` = amarillo (CTA principal); `light` = blanco (CTA secundario). Ambos pasan al color contrario en hover. */
  variant?: "primary" | "light";
  /** `md` = 15px con esquinas de 6px, para tarjetas; `hero` = 16px con esquinas de 6px, para portadas; `pill` = píldora, para navegación; `lg` = píldora grande, para formularios. */
  size?: "md" | "hero" | "pill" | "lg";
  /** Con `href` se renderiza un enlace `<a>`; sin él, un `<button>`. */
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  /** Clases extra (p. ej. una clase de contexto de sección). */
  className?: string;
  children: ReactNode;
}

const SIZE = { md: "btn-md", hero: "btn-hero", pill: "btn-pill", lg: "btn-lg" };

/** Botón de marca Antoky: amarillo o blanco sobre texto negro, tipografía Montserrat, se eleva en hover. */
export function Button({ variant = "primary", size = "md", href, type = "button", disabled, onClick, className, children }: ButtonProps) {
  const cls = ["btn", variant === "primary" ? "btn-y" : "btn-l", SIZE[size], className, "m"].filter(Boolean).join(" ");
  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={cls} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

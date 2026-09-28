export interface ContactInfoProps {
  /** Filas etiqueta/valor. Con `href` el valor es un enlace (mailto:, https://wa.me/…; los http abren en pestaña nueva). */
  rows?: { label: string; value: string; href?: string }[];
}

const DATOS: NonNullable<ContactInfoProps["rows"]> = [
  { label: "Correo", value: "Ceau922@gmail.com", href: "mailto:Ceau922@gmail.com" },
  { label: "WhatsApp", value: "+57 313 7264497", href: "https://wa.me/573137264497" },
  { label: "Ubicación", value: "Colombia" },
];

/** Tabla de datos de contacto (etiqueta a la izquierda, valor a la derecha) con divisores. Diseñada para el bloque amarillo de contacto. */
export function ContactInfo({ rows = DATOS }: ContactInfoProps) {
  return (
    <div className="datos">
      {rows.map((r) => (
        <div key={r.label}>
          <span>{r.label}</span>
          {r.href ? (
            <a href={r.href} {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {r.value}
            </a>
          ) : (
            <span className="v">{r.value}</span>
          )}
        </div>
      ))}
    </div>
  );
}

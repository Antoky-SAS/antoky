import { assets } from "./assets";
import { FounderCard, type FounderCardProps } from "./FounderCard";

export interface FoundersProps {
  /** Por defecto, los cofundadores reales de Antoky (Carlos Arias y Sebastián Valle) con sus fotos. */
  founders?: { name: string; role: string; photo: string; bio?: string }[];
}

/** Los cofundadores de Antoky con foto, cargo y bio. */
export function founders(): FounderCardProps[] {
  return [
    {
      name: "Carlos Arias",
      role: "CoFounder",
      photo: assets.fotoCarlos,
      bio: "Lidera la estrategia comercial y la relación con clientes. Se asegura de que cada solución responda a una necesidad real del negocio.",
    },
    {
      name: "Sebastián Valle",
      role: "CoFounder",
      photo: assets.fotoSebastian,
      bio: "Dirige la arquitectura y el desarrollo de producto. Convierte procesos complejos en software claro, seguro y escalable.",
    },
  ];
}

/** Rejilla de tarjetas de fundadores (2 columnas, 1 en móvil). */
export function Founders({ founders: list = founders() }: FoundersProps) {
  return (
    <div className="founders">
      {list.map((f) => (
        <FounderCard key={f.name} {...f} />
      ))}
    </div>
  );
}

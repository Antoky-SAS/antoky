import { Chip } from "./Chip";

export interface ChipListProps {
  /** Textos de las etiquetas, en orden. */
  items: string[];
}

/** Fila de chips que envuelve en varias líneas (gap 8px). */
export function ChipList({ items }: ChipListProps) {
  return (
    <div className="chips">
      {items.map((t) => (
        <Chip key={t}>{t}</Chip>
      ))}
    </div>
  );
}

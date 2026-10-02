export interface FounderCardProps {
  name: string;
  /** Cargo, p. ej. "CoFounder". */
  role: string;
  /** URL de la foto (retrato vertical 4:5). */
  photo: string;
  /** Biografía corta que aparece sobre la foto en hover. */
  bio?: string;
}

/** Tarjeta de fundador: retrato 4:5 redondeado (24px) con acento amarillo inclinado, bio en hover, nombre y cargo debajo. */
export function FounderCard({ name, role, photo, bio }: FounderCardProps) {
  return (
    <div className="founder">
      <div className="founder-photo" data-tilt="">
        <div className="founder-back" style={{ backgroundImage: `url(${photo})` }} />
        <img src={photo} alt={name} loading="lazy" />
        <div className="founder-deco" />
        {bio && (
          <div className="founder-over">
            <i />
            <p>{bio}</p>
          </div>
        )}
      </div>
      <div>
        <div className="founder-name m">{name}</div>
        <div className="founder-role">{role}</div>
      </div>
    </div>
  );
}

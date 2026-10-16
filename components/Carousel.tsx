"use client";

import { useRef, type ReactNode } from "react";

/** Carrusel horizontal con scroll-snap; el encabezado va a la izquierda de los botones anterior/siguiente. Cada hijo directo es una tarjeta. */
export function Carousel({ heading, children }: { heading: ReactNode; children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);

  const slide = (dir: number) => {
    const t = track.current;
    if (!t) return;
    const card = t.firstElementChild as HTMLElement | null;
    t.scrollBy({ left: dir * ((card?.offsetWidth ?? 500) + 14), behavior: "smooth" });
  };

  return (
    <>
      <div data-reveal="" className="sec-head">
        {heading}
        <div className="carousel-btns">
          <button type="button" className="carousel-btn" aria-label="Anterior" onClick={() => slide(-1)}>
            ←
          </button>
          <button type="button" className="carousel-btn" aria-label="Siguiente" onClick={() => slide(1)}>
            →
          </button>
        </div>
      </div>
      <div ref={track} className="track">
        {children}
      </div>
    </>
  );
}

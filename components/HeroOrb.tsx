"use client";

import { useEffect, useRef } from "react";
import { ORB_READY } from "./SiteLoader";

// Avisa al loader (también si la esfera falla, para no dejarlo esperando).
const avisarListo = () => {
  window.__antokyOrbReady = true;
  dispatchEvent(new Event(ORB_READY));
};

/** Esfera de líneas onduladas del hero (three.js, se puede girar arrastrando). Se carga después de hidratar; el loader espera a que esté. */
export function HeroOrb() {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = el.current;
    if (!host) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dispose: (() => void) | undefined;
    let cancelled = false;
    import("./orb")
      .then(({ mountOrb }) => mountOrb(host, { still, color: "#FFFFFF", accent: "#FFFFFF", background: "#000000" }))
      .then((d) => {
        if (cancelled) d();
        else dispose = d;
        // Dos cuadros: el primero ya quedó pintado.
        requestAnimationFrame(() => requestAnimationFrame(avisarListo));
      })
      .catch((err) => {
        console.warn("orb", err);
        avisarListo();
      });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return <div ref={el} aria-hidden="true" className="hero-orb" />;
}

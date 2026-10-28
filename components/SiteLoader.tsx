"use client";

import { useEffect, useState } from "react";

/** Evento que HeroOrb emite cuando la esfera ya pintó su primer cuadro. */
export const ORB_READY = "antoky:orb-ready";

declare global {
  interface Window {
    __antokyOrbReady?: boolean;
  }
}

const MIN_MS = 1400; // deja ver la animación del isotipo
const MAX_MS = 8000; // en redes lentas o sin WebGL, no bloquear más

/** Pantalla de carga: se pinta con el HTML y sale (cortina hacia arriba) cuando cargan las fuentes y la esfera del hero. */
export function SiteLoader() {
  const [phase, setPhase] = useState<"in" | "out" | "gone">("in");

  useEffect(() => {
    let cancelled = false;
    const orb = new Promise<void>((res) => {
      if (window.__antokyOrbReady) return res();
      addEventListener(ORB_READY, () => res(), { once: true });
    });
    const ready = Promise.all([orb, document.fonts?.ready, new Promise((r) => setTimeout(r, MIN_MS))]);
    const t = Promise.race([ready, new Promise((r) => setTimeout(r, MAX_MS))]);
    let gone: ReturnType<typeof setTimeout>;
    t.then(() => {
      if (cancelled) return;
      setPhase("out");
      gone = setTimeout(() => setPhase("gone"), 950);
    });
    return () => {
      cancelled = true;
      clearTimeout(gone);
    };
  }, []);

  useEffect(() => {
    // Sin scroll mientras carga (y durante la salida: soltar el overflow a mitad de la cortina provoca reflow y tirones).
    document.documentElement.classList.toggle("is-loading", phase !== "gone");
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div className={`loader${phase === "out" ? " out" : ""}`} aria-hidden="true">
      <div className="loader-inner">
        <div className="loader-iso">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="a" src="/assets/antoky-isotipo-blanco.webp" alt="" width={837} height={526} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="y" src="/assets/antoky-isotipo-blanco.webp" alt="" width={837} height={526} />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="loader-word" src="/assets/antoky-logo-blanco.webp" alt="" width={1383} height={209} />
        <div className="loader-track">
          <div className="loader-bar" />
        </div>
      </div>
    </div>
  );
}

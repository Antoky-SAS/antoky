"use client";

import { useEffect, useState } from "react";
import { assets } from "./assets";

export interface LoaderProps {
  /** Mantiene el loader visible (para previsualizarlo); por defecto sale tras la carga (~2.3s). */
  hold?: boolean;
}

/** Pantalla de carga a pantalla completa: el isotipo A+Y se arma, aparece el logotipo y se llena una barra amarilla; luego sale con una cortina hacia arriba. */
export function Loader({ hold = false }: LoaderProps) {
  const [loading, setLoading] = useState(true);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (hold) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGone(true);
      return;
    }
    let t: ReturnType<typeof setTimeout>;
    let cancelled = false;
    const minT = new Promise((res) => setTimeout(res, 2300));
    const loaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise((res) => window.addEventListener("load", res, { once: true }));
    Promise.all([minT, loaded]).then(() => {
      if (cancelled) return;
      setLoading(false);
      t = setTimeout(() => setGone(true), 900);
    });
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [hold]);

  if (gone) return null;

  return (
    <div className={`loader${loading ? "" : " out"}`} aria-hidden="true">
      <div className="loader-inner">
        <div className="loader-iso">
          <img className="a" src={assets.isotipoA} alt="" />
          <img className="y" src={assets.isotipoY} alt="" />
        </div>
        <img className="loader-word" src={assets.logoBlanco} alt="Antoky" />
        <div className="loader-track">
          <div className="loader-bar" />
        </div>
      </div>
    </div>
  );
}

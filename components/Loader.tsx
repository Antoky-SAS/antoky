"use client";

import { useEffect, useState } from "react";

export default function Loader() {
  const [loading, setLoading] = useState(true);
  const [gone, setGone] = useState(false);

  useEffect(() => {
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
  }, []);

  if (gone) return null;

  return (
    <div className={`loader${loading ? "" : " out"}`} aria-hidden="true">
      <div className="loader-inner">
        <div className="loader-iso">
          <img className="a" src="/assets/antoky-isotipo-a.png" alt="" />
          <img className="y" src="/assets/antoky-isotipo-y.png" alt="" />
        </div>
        <img className="loader-word" src="/assets/antoky-logo-blanco.png" alt="Antoky" />
        <div className="loader-track">
          <div className="loader-bar" />
        </div>
      </div>
    </div>
  );
}

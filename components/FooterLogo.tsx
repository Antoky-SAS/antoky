"use client";

import { useRef } from "react";
import { assets } from "./assets";

/** Logotipo gigante del footer a todo el ancho; en hover un brillo iridiscente sigue al cursor dentro de las letras. */
export function FooterLogo() {
  const glowRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="footer-logo"
      onMouseEnter={() => document.documentElement.classList.add("aura-exotic")}
      onMouseLeave={() => document.documentElement.classList.remove("aura-exotic")}
      onMouseMove={(e) => {
        const g = glowRef.current;
        if (!g) return;
        const b = g.getBoundingClientRect();
        g.style.setProperty("--x", e.clientX - b.left + "px");
        g.style.setProperty("--y", e.clientY - b.top + "px");
      }}
    >
      <img src={assets.logoBlanco} alt="Antoky" />
      <div
        ref={glowRef}
        className="footer-glow"
        aria-hidden="true"
        style={{ maskImage: `url(${assets.logoBlanco})`, WebkitMaskImage: `url(${assets.logoBlanco})` }}
      />
    </div>
  );
}

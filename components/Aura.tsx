"use client";

import { useEffect, useRef } from "react";

/** Aura del cursor: halo amarillo difuso que sigue el puntero y anillo que se expande al hacer clic. Solo escritorio; se monta una vez por página. */
export function Aura() {
  const auraRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let tx = -500, ty = -500, x = tx, y = ty;
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (auraRef.current) auraRef.current.style.opacity = "1";
    };
    const leave = () => {
      if (auraRef.current) auraRef.current.style.opacity = "0";
    };
    const down = () => {
      ringRef.current?.animate(
        [
          { transform: "translate(-50%,-50%) scale(0.2)", opacity: 0.9 },
          { transform: "translate(-50%,-50%) scale(1.6)", opacity: 0 },
        ],
        { duration: 650, easing: "cubic-bezier(.2,.7,.2,1)" }
      );
    };
    let raf = 0;
    const tick = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      if (auraRef.current) auraRef.current.style.transform = `translate(${x}px,${y}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={auraRef} className="aura" aria-hidden="true">
      <div className="aura-glow" />
      <div ref={ringRef} className="aura-ring" />
    </div>
  );
}

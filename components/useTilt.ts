"use client";

import { useEffect } from "react";

// Lógica copiada de initTilt() en design/Antoky v2.dc.html.

type Card = {
  el: HTMLElement;
  glare: HTMLDivElement;
  layers: HTMLElement[];
  rx: number; ry: number; s: number;
  vx: number; vy: number; vs: number;
  tx: number; ty: number; ts: number;
  hover: boolean;
};

/**
 * Inclinación 3D con resorte para todo elemento con [data-tilt] (delegado en document).
 * Reflejo blanco que sigue al cursor; los hijos con [data-depth] se desplazan en paralaje.
 * [data-tilt-scale] reduce el ángulo (p. ej. 0.4 en tarjetas anchas).
 * Solo escritorio con puntero fino y ancho ≥860px.
 */
export function useTilt(max = 20) {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cards = new Map<HTMLElement, Card>();
    let raf = 0;

    const setup = (el: HTMLElement) => {
      const known = cards.get(el);
      if (known) return known;
      const glare = document.createElement("div");
      glare.style.cssText =
        "position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:5;opacity:0;transition:opacity .35s ease;mix-blend-mode:screen";
      el.appendChild(glare);
      el.style.willChange = "transform";
      const c: Card = {
        el, glare, layers: Array.from(el.querySelectorAll<HTMLElement>("[data-depth]")),
        rx: 0, ry: 0, s: 1, vx: 0, vy: 0, vs: 0, tx: 0, ty: 0, ts: 1, hover: false,
      };
      cards.set(el, c);
      return c;
    };

    const step = () => {
      let alive = false;
      cards.forEach((c) => {
        const k = c.hover ? 260 : 150, d = c.hover ? 24 : 9, dt = 1 / 60;
        c.vx += ((c.tx - c.rx) * k - c.vx * d) * dt; c.rx += c.vx * dt;
        c.vy += ((c.ty - c.ry) * k - c.vy * d) * dt; c.ry += c.vy * dt;
        c.vs += ((c.ts - c.s) * k - c.vs * d) * dt; c.s += c.vs * dt;
        const moving =
          Math.abs(c.vx) + Math.abs(c.vy) + Math.abs(c.vs) * 40 > 0.02 ||
          Math.abs(c.tx - c.rx) + Math.abs(c.ty - c.ry) > 0.02 ||
          Math.abs(c.ts - c.s) > 0.001;
        if (!moving && !c.hover) {
          c.rx = c.ry = 0;
          c.s = 1;
          c.el.style.transform = "";
          c.layers.forEach((l) => (l.style.transform = ""));
          return;
        }
        alive = true;
        const lift = (c.s - 1) * 120;
        c.el.style.transform =
          "perspective(1000px) translateY(" + (-lift).toFixed(2) + "px) rotateX(" + c.rx.toFixed(3) + "deg) rotateY(" +
          c.ry.toFixed(3) + "deg) scale(" + c.s.toFixed(4) + ")";
        c.layers.forEach((l) => {
          const dp = parseFloat(l.dataset.depth ?? "") || 0, px = -c.ry * dp * 0.9, py = c.rx * dp * 0.9;
          l.style.transform = "translate3d(" + px.toFixed(2) + "px," + py.toFixed(2) + "px,0)" + (l.tagName === "IMG" ? " scale(1.07)" : "");
        });
      });
      raf = alive ? requestAnimationFrame(step) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };

    let cur: Card | null = null;
    const leave = (c: Card) => {
      c.hover = false;
      c.tx = 0; c.ty = 0; c.ts = 1;
      c.glare.style.opacity = "0";
      kick();
    };
    const move = (e: PointerEvent) => {
      if (!fine || window.innerWidth < 860) {
        if (cur) { leave(cur); cur = null; }
        return;
      }
      const el = (e.target as Element | null)?.closest?.<HTMLElement>("[data-tilt]") ?? null;
      if (cur && cur.el !== el) { leave(cur); cur = null; }
      if (!el) return;
      const c = setup(el);
      cur = c;
      c.hover = true;
      const b = el.getBoundingClientRect(), x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
      const m = max * (parseFloat(el.dataset.tiltScale ?? "") || 1);
      c.tx = (0.5 - y) * 2 * m;
      c.ty = (x - 0.5) * 2 * m;
      c.ts = 1.025;
      const gx = (x * 100).toFixed(1) + "%", gy = (y * 100).toFixed(1) + "%";
      c.glare.style.background =
        "radial-gradient(circle at " + gx + " " + gy + ", rgba(255,255,255,0.22), rgba(255,255,255,0.06) 28%, rgba(255,255,255,0) 60%)";
      c.glare.style.opacity = "1";
      kick();
    };
    const out = (e: PointerEvent) => {
      if (cur && !e.relatedTarget) { leave(cur); cur = null; }
    };

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", out);
    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", out);
      cancelAnimationFrame(raf);
      cards.forEach((c) => {
        c.glare.remove();
        c.el.style.transform = c.el.style.willChange = "";
        c.layers.forEach((l) => (l.style.transform = ""));
      });
    };
  }, [max]);
}

/** Activa la inclinación 3D de las tarjetas [data-tilt]. Se monta una vez por página. */
export function Tilt({ max = 20 }: { max?: number }) {
  useTilt(max);
  return null;
}

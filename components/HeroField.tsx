"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#FFD600", "#F5B700", "#EE8A2E", "#E2603F", "#0B0B0C", "#6E6F76"];
const R = 150; // radio de influencia del puntero

type Pt = { x: number; y: number; a: number; ca: number; ox: number; oy: number; l: number; c: string; al: number; ph: number; v: number; fade: number };

/** Campo de trazos de color detrás del hero: ondula desde el centro y se aparta del puntero. */
export function HeroField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    let W = 0, H = 0, mx = -9999, my = -9999;
    let pts: Pt[] = [];
    let geo = { cx: 0, cy: 0, rx: 0, ry: 0 };

    const build = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cx = W / 2, cy = H * 0.46, rx = Math.min(W * 0.34, 520), ry = H * 0.3;
      const n = Math.round((W * H) / 1500);
      pts = [];
      for (let i = 0; i < n; i++) {
        const x = Math.random() * W, y = Math.random() * H;
        const ex = (x - cx) / rx, ey = (y - cy) / ry, e2 = ex * ex + ey * ey;
        // Hueco elíptico detrás del titular.
        if (e2 < 1 && Math.random() > (e2 - 0.55) * 2.2) continue;
        const a = Math.atan2(y - cy, x - cx);
        pts.push({ x, y, a, ca: a, ox: 0, oy: 0, l: 3 + Math.random() * 5, c: COLORS[(Math.random() * COLORS.length) | 0], al: 0.35 + Math.random() * 0.5, ph: Math.random() * 6.28, v: 0.12 + Math.random() * 0.28, fade: 1 });
      }
      geo = { cx, cy, rx, ry };
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = "round";
      ctx.lineWidth = 1.6;
      const { cx, cy } = geo;
      for (const p of pts) {
        const wave = Math.sin(t / 1100 - Math.hypot(p.x - cx, p.y - cy) / 160 + p.ph * 0.15) * (8 + p.v * 40);
        const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy);
        let tx = Math.cos(p.a) * wave + Math.sin(t / 1400 + p.ph) * 2;
        let ty = Math.sin(p.a) * wave + Math.cos(t / 1700 + p.ph) * 2;
        let ta = p.a + Math.sin(t / 1200 + p.ph) * 0.3;
        if (d < R) {
          const f = Math.pow(1 - d / R, 2);
          tx += (dx / (d || 1)) * f * 34;
          ty += (dy / (d || 1)) * f * 34;
          ta = Math.atan2(dy, dx) + f * 1.2;
        }
        p.ox += (tx - p.ox) * 0.2;
        p.oy += (ty - p.oy) * 0.2;
        let da = ta - p.ca;
        da = Math.atan2(Math.sin(da), Math.cos(da));
        p.ca += da * 0.12;
        const near = d < R ? 1 - d / R : 0, len = p.l * (1 + near * 0.9);
        const x = p.x + p.ox, y = p.y + p.oy, c = (Math.cos(p.ca) * len) / 2, s = (Math.sin(p.ca) * len) / 2;
        ctx.globalAlpha = Math.min(1, p.al + near * 0.5) * p.fade;
        ctx.strokeStyle = p.c;
        ctx.beginPath();
        ctx.moveTo(x - c, y - s);
        ctx.lineTo(x + c, y + s);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    build();
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = true, raf = 0;
    const loop = (t: number) => {
      if (visible) draw(t);
      raf = requestAnimationFrame(loop);
    };
    if (still) draw(0);
    else raf = requestAnimationFrame(loop);

    const move = (ev: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      mx = ev.clientX - r.left;
      my = ev.clientY - r.top;
    };
    const leave = () => {
      mx = my = -9999;
    };
    addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    const ro = new ResizeObserver(() => {
      build();
      if (still) draw(0);
    });
    ro.observe(cv);
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
    });
    io.observe(cv);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="hero-field" aria-hidden="true" />;
}

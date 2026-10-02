"use client";

import { useEffect, useRef } from "react";

// Lógica copiada de auroraBuild() / drawAurora() / drawRegion() en design/Antoky v2.dc.html.

type Pt = { x: number; y: number; nx: number; ny: number; s: number; u: number; w: number };
type Ribbon = { pts: Pt[]; minY: number; maxY: number; lines: number; dim: number };
type Spark = { x: number; y: number; r: number; ph: number; sp: number };
type Aurora = { W: number; docH: number; ribbons: Ribbon[]; sparks: Spark[] };

const DEFS = [
  [[1.15, 0.0], [0.82, 0.035], [0.62, 0.09], [0.36, 0.15], [0.08, 0.2], [-0.15, 0.235]],
  [[-0.15, 0.17], [0.18, 0.25], [0.5, 0.3], [0.8, 0.36], [1.15, 0.43]],
  [[1.15, 0.47], [0.78, 0.53], [0.46, 0.585], [0.16, 0.64], [-0.15, 0.7]],
  [[-0.15, 0.73], [0.22, 0.79], [0.55, 0.84], [0.85, 0.9], [1.15, 0.97]],
  [[1.15, 0.24], [0.9, 0.3], [0.7, 0.4], [0.5, 0.5], [0.3, 0.56], [-0.15, 0.62]],
];

function build(W: number, docH: number): Aurora {
  const mob = W < 860;
  const baseW = Math.min(W * (mob ? 0.2 : 0.12), 150);
  const rnd = ((s) => () => (s = (s * 16807) % 2147483647) / 2147483647)(7);
  const ribbons = DEFS.map((cp, ri) => {
    const P = cp.map(([x, y]) => ({ x: x * W, y: y * docH }));
    const pts = [] as Pt[];
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      const seg = Math.hypot(p2.x - p1.x, p2.y - p1.y), n = Math.max(8, Math.ceil(seg / 9));
      for (let k = 0; k < n; k++) {
        const t = k / n, t2 = t * t, t3 = t2 * t;
        pts.push({
          x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
          y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
        } as Pt);
      }
    }
    pts.push({ x: P[P.length - 1].x, y: P[P.length - 1].y } as Pt);
    {
      let acc = 0;
      const L0 = pts.map((p, i) => (i ? (acc += Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y)) : 0));
      const tot = acc || 1, A1 = Math.min(W * 0.07, 90), A2 = Math.min(W * 0.035, 45), l1 = 520 + ri * 70, l2 = 230 + ri * 35;
      const base = pts.map((p) => ({ x: p.x, y: p.y }));
      base.forEach((p, i) => {
        const q = base[Math.min(base.length - 1, i + 1)], r = base[Math.max(0, i - 1)];
        const dx = q.x - r.x, dy = q.y - r.y, l = Math.hypot(dx, dy) || 1, s = L0[i];
        const env = Math.sin(Math.PI * Math.min(1, s / tot)) * 0.6 + 0.4;
        const d = (A1 * Math.sin(s / l1 + ri * 2.3) + A2 * Math.sin(s / l2 + ri * 4.1)) * env;
        pts[i].x = p.x - (dy / l) * d;
        pts[i].y = p.y + (dx / l) * d;
      });
      for (let pass = 0; pass < 3; pass++)
        for (let i = 1; i < pts.length - 1; i++) {
          pts[i].x = (pts[i - 1].x + 2 * pts[i].x + pts[i + 1].x) / 4;
          pts[i].y = (pts[i - 1].y + 2 * pts[i].y + pts[i + 1].y) / 4;
        }
    }
    let s = 0, minY = 1e9, maxY = -1e9;
    pts.forEach((p, i) => {
      const q = pts[Math.min(pts.length - 1, i + 1)], r = pts[Math.max(0, i - 1)];
      const dx = q.x - r.x, dy = q.y - r.y, l = Math.hypot(dx, dy) || 1;
      p.nx = -dy / l;
      p.ny = dx / l;
      if (i) s += Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y);
      p.s = s;
      p.u = i / (pts.length - 1);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    });
    const main = ri !== 4;
    const width = baseW * (main ? 1 : 0.55);
    pts.forEach((p) => {
      p.w = width * (0.12 + 0.88 * Math.abs(Math.sin(p.u * Math.PI * 2.6 + ri * 1.3))) * Math.min(1, Math.sin(Math.PI * p.u) * 3 + 0.25);
    });
    return { pts, minY: minY - width - 40, maxY: maxY + width + 40, lines: main ? (mob ? 11 : 15) : mob ? 6 : 8, dim: main ? 1 : 0.6 };
  });
  const sparks: Spark[] = [];
  const nS = mob ? 160 : 320;
  for (let i = 0; i < nS; i++) {
    const r = ribbons[Math.floor(rnd() * ribbons.length)], p = r.pts[Math.floor(rnd() * r.pts.length)];
    const off = (rnd() - 0.5) * 2 * (p.w * 0.6 + 40 + rnd() * 160);
    sparks.push({ x: p.x + p.nx * off, y: p.y + p.ny * off, r: 0.5 + rnd() * rnd() * 2.2, ph: rnd() * 6.28, sp: 0.6 + rnd() * 2 });
  }
  return { W, docH, ribbons, sparks };
}

function drawRegion(off: HTMLCanvasElement, sm: HTMLCanvasElement, W: number, H: number, sy: number, A: Aurora, amp: number, t: number) {
  const o = off.getContext("2d")!;
  o.globalCompositeOperation = "source-over";
  o.clearRect(0, 0, W, H);
  o.globalCompositeOperation = "lighter";
  o.lineCap = "round";
  o.lineJoin = "round";
  const G = "212,255,58", C = "238,255,175";
  A.ribbons.forEach((r) => {
    if (r.maxY < sy || r.minY > sy + H) return;
    const pts = r.pts;
    let first = -1, last = -1;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      if (p.y + p.w + 60 > sy && p.y - p.w - 60 < sy + H) {
        if (first < 0) first = i;
        last = i;
      }
    }
    if (first < 0) return;
    const k0 = Math.max(0, first - 2), k1 = Math.min(pts.length - 1, last + 2);
    for (let l = 0; l < r.lines; l++) {
      const fr = l / (r.lines - 1) - 0.5, edge = 1 - Math.abs(fr) * 1.6;
      o.beginPath();
      for (let i = k0; i <= k1; i++) {
        const p = pts[i], d = fr * p.w + Math.sin(p.u * 40 + l * 1.7) * 3;
        const x = p.x + p.nx * d, y = p.y + p.ny * d - sy;
        if (i === k0) o.moveTo(x, y);
        else o.lineTo(x, y);
      }
      o.setLineDash([]);
      o.lineWidth = l % 4 === 0 ? 1.4 : 0.9;
      o.strokeStyle = "rgba(" + G + "," + ((0.16 + 0.22 * edge) * amp * r.dim).toFixed(3) + ")";
      o.stroke();
      const len = 140 + ((l * 53) % 220), gap = 260 + ((l * 97) % 420);
      o.setLineDash([len, gap]);
      o.lineDashOffset = pts[k0].s - t * (0.11 + (l % 5) * 0.025);
      o.lineWidth = l % 4 === 0 ? 2.2 : 1.4;
      o.strokeStyle = "rgba(" + C + "," + ((0.35 + 0.45 * edge) * amp * r.dim).toFixed(3) + ")";
      o.stroke();
    }
  });
  o.setLineDash([]);
  A.sparks.forEach((p) => {
    const y = p.y - sy + Math.sin(t * 0.0004 * p.sp + p.ph) * 14;
    if (y < -10 || y > H + 10) return;
    const tw = 0.5 + 0.5 * Math.sin(t * 0.002 * p.sp + p.ph);
    o.fillStyle = "rgba(" + C + "," + (tw * 0.85 * amp).toFixed(3) + ")";
    o.beginPath();
    o.arc(p.x, y, p.r * (0.6 + 0.4 * tw), 0, 6.283);
    o.fill();
  });
  const s = sm.getContext("2d")!;
  s.clearRect(0, 0, sm.width, sm.height);
  s.filter = "blur(5px)";
  s.drawImage(off, 0, 0, sm.width, sm.height);
  s.filter = "none";
}

export interface AuroraBackgroundProps {
  /** Intensidad 1–10. */
  intensity?: number;
  /** Multiplicador de velocidad (0 = quieta). */
  speed?: number;
}

/** Aurora de fondo: cintas de líneas lima con luz que corre y chispas, anclada al documento (no a la pantalla). Va como primer hijo de Page (position:relative; isolation:isolate) con z-index:-1; se divide en tiles de 640px y solo redibuja los visibles. */
export function AuroraBackground({ intensity = 10, speed = 1.3 }: AuroraBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = ref.current;
    if (!wrap) return;
    const amp = Math.min(10, Math.max(1, intensity)) / 10;
    const TILE = 640, M = 48;
    let aur: Aurora | null = null;
    let rebuildT: ReturnType<typeof setTimeout> | undefined;
    let tiles: { cv: HTMLCanvasElement; dirty: boolean }[] = [];
    let tilesW = 0;
    const off = document.createElement("canvas"), sm = document.createElement("canvas");

    const draw = (t: number) => {
      const W = wrap.clientWidth, docH = wrap.offsetHeight, VH = window.innerHeight;
      if (!W || !docH) return;
      const vTop = -wrap.getBoundingClientRect().top;
      if (!aur || aur.W !== W || Math.abs(aur.docH - docH) > 2) {
        clearTimeout(rebuildT);
        if (!aur || aur.W !== W) aur = build(W, docH);
        else rebuildT = setTimeout(() => (aur = build(wrap.clientWidth, wrap.offsetHeight)), 250);
      }
      const A = aur;
      const n = Math.ceil(docH / TILE);
      if (tilesW !== W || tiles.length !== n) {
        wrap.innerHTML = "";
        tiles = [];
        tilesW = W;
        for (let i = 0; i < n; i++) {
          const cv = document.createElement("canvas");
          cv.width = W;
          cv.height = TILE;
          cv.style.cssText = "position:absolute;left:0;top:" + i * TILE + "px;width:" + W + "px;height:" + TILE + "px;display:block";
          wrap.appendChild(cv);
          tiles.push({ cv, dirty: true });
        }
      }
      const RH = TILE + 2 * M;
      if (off.width !== W || off.height !== RH) {
        off.width = W;
        off.height = RH;
        sm.width = Math.ceil(W / 4);
        sm.height = Math.ceil(RH / 4);
      }
      tiles.forEach((tile, ti) => {
        const top = ti * TILE;
        const visible = top + TILE > vTop - 200 && top < vTop + VH + 200;
        if (!visible) {
          if (!tile.dirty) {
            tile.cv.getContext("2d")!.clearRect(0, 0, W, TILE);
            tile.dirty = true;
          }
          return;
        }
        tile.dirty = false;
        drawRegion(off, sm, W, RH, top - M, A, amp, t);
        const ctx = tile.cv.getContext("2d")!;
        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, W, TILE);
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 0.6;
        ctx.drawImage(sm, 0, -M, W, RH);
        ctx.globalAlpha = 1;
        ctx.drawImage(off, 0, -M);
        ctx.globalCompositeOperation = "source-over";
      });
    };

    // Con movimiento reducido el tiempo no avanza: la aurora queda estática (se sigue redibujando al hacer scroll).
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let at = 0, last = performance.now(), lastDraw = 0, raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      if (!still) at += dt * speed;
      const mob = window.innerWidth < 860;
      if (now - lastDraw >= (mob ? 33 : 0)) {
        lastDraw = now;
        draw(at);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(rebuildT);
      wrap.innerHTML = "";
    };
  }, [intensity, speed]);

  return <div ref={ref} className="aurora" aria-hidden="true" />;
}

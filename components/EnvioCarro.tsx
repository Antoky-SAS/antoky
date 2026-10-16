"use client";

import { useEffect, useRef } from "react";

const NS = "http://www.w3.org/2000/svg";
const C = { x: 320, y: 168 };
const GROUND = 306;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const eIn = (t: number) => t * t * t;
const eOut = (t: number) => 1 - Math.pow(1 - t, 3);
const eIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const eBack = (t: number) => 1 + 2.6 * Math.pow(t - 1, 3) + 1.6 * Math.pow(t - 1, 2);
const tf = (el: Element, x: number, y: number, r = 0, sx = 1, sy = sx) =>
  el.setAttribute("transform", `translate(${x} ${y}) rotate(${r}) scale(${sx} ${sy})`);

type Step = { at: number; dur: number; fn: (p: number) => void };

/** Animación de confirmación de envío: el sobre entra a la furgoneta, esta se va y aparece "¡Correo enviado!". Se reproduce una vez al montarse. */
export function EnvioCarro({ className }: { className?: string }) {
  const root = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = root.current;
    if (!svg) return;
    const $ = (s: string) => svg.querySelector(s) as SVGGraphicsElement;
    const env = $(".e-env"), van = $(".e-van"), vanBody = $(".e-body"), road = $(".e-road"), fx = $(".e-fx");
    const done = $(".e-done"), check = $(".e-check");
    const spins = [...svg.querySelectorAll(".e-spin")];
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let alive = true;
    let raf = 0;

    const timeline = (steps: Step[]) =>
      new Promise<void>((res) => {
        const t0 = performance.now();
        const end = Math.max(...steps.map((s) => s.at + s.dur));
        const tick = (now: number) => {
          if (!alive) return;
          const t = still ? end : now - t0;
          for (const s of steps) if (t >= s.at) s.fn(clamp((t - s.at) / s.dur));
          if (t < end) requestAnimationFrame(tick);
          else res();
        };
        tick(t0);
      });

    // Nubecitas de humo detrás de la furgoneta.
    const parts: { c: SVGCircleElement; x: number; y: number; r: number; life: number; age: number; vx: number; vy: number }[] = [];
    const puff = (x: number, y: number, r: number, life: number, vx: number, vy: number) => {
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("fill", "url(#e-puff)");
      fx.appendChild(c);
      parts.push({ c, x, y, r, life, age: 0, vx, vy });
    };
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.age += dt;
        const k = p.age / p.life;
        if (k >= 1) {
          p.c.remove();
          parts.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.c.setAttribute("cx", String(p.x));
        p.c.setAttribute("cy", String(p.y));
        p.c.setAttribute("r", String(p.r * (0.6 + 0.8 * k)));
        p.c.setAttribute("opacity", String(1 - k));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    let wheelAngle = 0, lastVanX = 0;
    const placeVan = (x: number, bob = 0, tilt = 0) => {
      wheelAngle += ((x - lastVanX) / 21) * (180 / Math.PI);
      lastVanX = x;
      van.setAttribute("transform", `translate(${x} ${GROUND - 21})`);
      vanBody.setAttribute("transform", `translate(0 ${bob}) rotate(${tilt} 0 0)`);
      spins.forEach((s) => s.setAttribute("transform", `rotate(${wheelAngle})`));
    };

    async function carro() {
      lastVanX = -160;
      placeVan(-160);
      van.setAttribute("opacity", "1");
      const slot = () => ({ x: lastVanX - 30, y: GROUND - 21 - 118 });
      let puffT = 0;
      await timeline([
        { at: 0, dur: 300, fn: (p) => road.setAttribute("opacity", String(p)) },
        // el sobre se eleva para dejar sitio
        { at: 0, dur: 500, fn: (p) => tf(env, C.x, lerp(C.y, 92, eOut(p)), 0, 1 - 0.35 * eOut(p)) },
        // llega la furgoneta
        { at: 100, dur: 850, fn: (p) => placeVan(lerp(-160, C.x + 30, eOut(p)), -2 * Math.sin(p * 18) * (1 - p), -1.5 * (1 - p)) },
        { at: 950, dur: 300, fn: (p) => placeVan(lastVanX, 0, 2.5 * Math.sin(p * Math.PI) * (1 - p)) }, // frena
        // el sobre entra por la ranura del techo
        {
          at: 1000,
          dur: 520,
          fn: (p) => {
            const s = slot(), e = eIO(p);
            tf(env, lerp(C.x, s.x, e), lerp(92, s.y - 40, e) - 50 * Math.sin(Math.PI * e), 8 * Math.sin(Math.PI * e), 0.65 - 0.37 * e);
          },
        },
        {
          at: 1520,
          dur: 220,
          fn: (p) => {
            const s = slot();
            tf(env, s.x, s.y - 40 + 34 * eIn(p), 0, 0.28, 0.28 * (1 - p));
            env.setAttribute("opacity", String(1 - p));
          },
        },
        { at: 1700, dur: 260, fn: (p) => placeVan(lastVanX, -7 * Math.sin(Math.PI * p), 0) }, // saltito al recibirlo
        // se va
        {
          at: 2000,
          dur: 900,
          fn: (p) => {
            placeVan(lerp(C.x + 30, 820, eIn(p)), -1.5 * Math.sin(p * 30), -2.5 * Math.min(1, p * 4));
            if (p - puffT > 0.06 && lastVanX < 700) {
              puffT = p;
              puff(lastVanX - 120, GROUND - 6, 10 + 10 * Math.random(), 0.7, -60 - 80 * Math.random(), -15 - 20 * Math.random());
            }
          },
        },
        { at: 2500, dur: 400, fn: (p) => road.setAttribute("opacity", String(1 - p)) },
      ]);
      van.setAttribute("opacity", "0");
    }

    const showDone = () =>
      timeline([
        {
          at: 0,
          dur: 350,
          fn: (p) => {
            const b = eBack(p);
            done.setAttribute("opacity", String(p));
            tf(done, C.x * (1 - b), C.y * (1 - b), 0, b);
          },
        },
        { at: 200, dur: 350, fn: (p) => check.setAttribute("stroke-dashoffset", String(60 * (1 - eOut(p)))) },
      ]);

    tf(env, C.x, C.y);
    tf(done, 0, 0);
    carro().then(() => {
      if (alive) showDone();
    });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={className}>
      <svg ref={root} viewBox="0 0 640 400" role="img" aria-label="Animación de envío de correo" style={{ display: "block", width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="e-vanBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3A3A40" />
            <stop offset=".55" stopColor="#1A1A1D" />
            <stop offset="1" stopColor="#0B0B0C" />
          </linearGradient>
          <linearGradient id="e-vanGlass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d9f1ff" />
            <stop offset="1" stopColor="#7fb4f0" />
          </linearGradient>
          <radialGradient id="e-puff">
            <stop offset="0" stopColor="#c9cde6" stopOpacity=".9" />
            <stop offset="1" stopColor="#c9cde6" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g className="e-fx" />
        <line className="e-road" x1="40" y1="306" x2="600" y2="306" stroke="#9aa0cc" strokeOpacity=".5" strokeWidth="2" strokeDasharray="14 12" opacity="0" />

        <g className="e-van" opacity="0">
          <ellipse cx="0" cy="8" rx="118" ry="9" fill="#000" opacity=".18" />
          <g className="e-body">
            <path d="M-115 -100 Q-115 -112 -103 -112 L40 -112 Q55 -112 63 -100 L95 -55 Q115 -50 115 -30 L115 -12 Q115 0 103 0 L-103 0 Q-115 0 -115 -12 Z" fill="url(#e-vanBody)" />
            <path d="M-115 -40 L115 -40 L115 -30 L-115 -30 Z" fill="#fff" opacity=".14" />
            <path d="M47 -102 L80 -58 L40 -58 L40 -102 Z" fill="url(#e-vanGlass)" />
            <path d="M47 -102 L54 -92 L40 -92 L40 -102 Z" fill="#fff" opacity=".5" />
            <rect x="34" y="-102" width="4" height="98" fill="#1a2090" opacity=".5" />
            <path d="M-42 -88 C-40 -70 -34 -64 -16 -62 C-34 -60 -40 -54 -42 -36 C-44 -54 -50 -60 -68 -62 C-50 -64 -44 -70 -42 -88 Z" fill="#FFD600" />
            <rect x="-72" y="-121" width="74" height="11" rx="5" fill="#1A1A1D" />
            <rect x="-66" y="-118" width="62" height="5" rx="2.5" fill="#0d1250" />
            <circle cx="110" cy="-32" r="4" fill="#ffe08a" />
            <rect x="-117" y="-34" width="5" height="10" rx="2" fill="#ff7a7a" />
            <rect x="88" y="-8" width="30" height="8" rx="4" fill="#c9cfe8" />
            <rect x="-118" y="-8" width="22" height="8" rx="4" fill="#c9cfe8" />
          </g>
          {[-62, 68].map((x) => (
            <g key={x} transform={`translate(${x} 0)`}>
              <circle r="21" fill="#171a33" />
              <circle r="11" fill="#c9cfe8" />
              <g className="e-spin">
                <rect x="-1.5" y="-10" width="3" height="20" fill="#8a91b8" />
                <rect x="-10" y="-1.5" width="20" height="3" fill="#8a91b8" />
              </g>
              <circle r="3" fill="#171a33" />
            </g>
          ))}
        </g>

        {/* Sobre, centrado en (0,0) */}
        <g className="e-env">
          <rect x="-104" y="-62" width="208" height="124" rx="14" fill="#FFFFFF" stroke="#0B0B0C" strokeWidth="5" />
          <path d="M-96 -52 L0 14 L96 -52" fill="none" stroke="#0B0B0C" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-96 54 L-34 -4 M96 54 L34 -4" fill="none" stroke="#0B0B0C" strokeWidth="4" strokeLinecap="round" opacity=".25" />
          <circle cx="0" cy="14" r="15" fill="#FFD600" stroke="#0B0B0C" strokeWidth="4" />
        </g>

        <g className="e-done" opacity="0">
          <circle cx="320" cy="168" r="40" fill="#FFD600" />
          <path className="e-check" d="M302 168 L315 181 L340 155" fill="none" stroke="#0B0B0C" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" strokeDashoffset="60" />
          <text x="320" y="248" textAnchor="middle" style={{ font: "800 26px var(--font-sans), system-ui, sans-serif", fill: "#0B0B0C" }}>
            ¡Correo enviado!
          </text>
          <text x="320" y="274" textAnchor="middle" style={{ font: "600 15px var(--font-sans), system-ui, sans-serif", fill: "#5E5F66" }}>
            Va en camino
          </text>
        </g>
      </svg>
    </div>
  );
}

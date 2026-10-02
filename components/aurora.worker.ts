// Web Worker de la aurora: dibuja los tiles (OffscreenCanvas transferidos) fuera del hilo principal,
// así el scroll y la interacción no se bloquean. Protocolo en components/AuroraBackground.tsx.
import { AuroraRenderer, type AuroraMsg, type Cv } from "./aurora-core.js";

const scope = self as unknown as {
  onmessage: ((e: MessageEvent<AuroraMsg>) => void) | null;
  requestAnimationFrame?: (cb: (now: number) => void) => number;
};
const raf = scope.requestAnimationFrame
  ? scope.requestAnimationFrame.bind(scope)
  : (cb: (now: number) => void) => setTimeout(() => cb(performance.now()), 16) as unknown as number;

let renderer: AuroraRenderer | null = null;
let speed = 1.3, still = false, paused = false, running = false, VW = 1440;
let at = 0, last = 0, lastDraw = 0;

const tick = (now: number) => {
  if (paused || !renderer) {
    running = false;
    return;
  }
  const dt = Math.min(64, now - last);
  last = now;
  at += dt * speed;
  // Mismo ritmo que el prototipo: 30 fps en móvil, sin límite en escritorio.
  if (now - lastDraw >= (VW < 860 ? 33 : 0)) {
    lastDraw = now;
    renderer.draw(at);
  }
  raf(tick);
};
const start = () => {
  if (still || running || paused) return;
  running = true;
  last = performance.now();
  raf(tick);
};
// Con movimiento reducido no hay loop: se redibuja solo cuando cambian la vista o el tamaño.
const redraw = () => {
  if (still) renderer?.draw(0);
};

scope.onmessage = ({ data: m }) => {
  if (m.type === "init") {
    renderer = new AuroraRenderer((w, h) => new OffscreenCanvas(w, h) as Cv, Math.min(10, Math.max(1, m.amp)) / 10);
    speed = m.speed;
    still = m.still;
    start();
  } else if (!renderer) {
    return;
  } else if (m.type === "tiles") {
    renderer.setTiles(m.canvases, m.W, m.docH);
    redraw();
  } else if (m.type === "size") {
    renderer.setSize(m.W, m.docH);
    redraw();
  } else if (m.type === "view") {
    renderer.setView(m.vTop, m.VH);
    VW = m.VW;
    redraw();
  } else if (m.type === "pause") {
    paused = m.paused;
    if (!paused) start();
  }
};

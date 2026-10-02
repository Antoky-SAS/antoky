"use client";

import { useEffect, useRef } from "react";
import { AuroraRenderer, TILE, type AuroraMsg, type Cv } from "./aurora-core";

// Worker y motor transpilados a public/aurora/ por scripts/build-worker.mjs (predev/prebuild).
const createWorker = () => new Worker("/aurora/aurora.worker.js", { type: "module" });

export interface AuroraBackgroundProps {
  /** Intensidad 1–10. */
  intensity?: number;
  /** Multiplicador de velocidad (0 = quieta). */
  speed?: number;
}

/**
 * Aurora de fondo: cintas de líneas lima con luz que corre y chispas, anclada al documento (no a la pantalla).
 * Va como primer hijo de Page (position:relative; isolation:isolate) con z-index:-1; se divide en tiles de 640px
 * y solo redibuja los visibles. Dibuja en un Web Worker (OffscreenCanvas) para no bloquear el hilo principal;
 * si el navegador no lo soporta, dibuja aquí mismo.
 */
export function AuroraBackground({ intensity = 10, speed = 1.3 }: AuroraBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = ref.current;
    if (!wrap) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let worker: Worker | null = null;
    let main: AuroraRenderer | null = null;
    let raf = 0, viewRaf = 0;
    let cancelIdle = () => {};
    let curW = 0, curN = 0, curH = 0;

    const post = (m: AuroraMsg, transfer: Transferable[] = []) => worker?.postMessage(m, transfer);

    // Fallback en el hilo principal: mismo motor, loop con requestAnimationFrame.
    const startMain = () => {
      main = new AuroraRenderer((w, h) => Object.assign(document.createElement("canvas"), { width: w, height: h }), Math.min(10, Math.max(1, intensity)) / 10);
      let at = 0, last = performance.now(), lastDraw = 0;
      const tick = (now: number) => {
        const dt = Math.min(64, now - last);
        last = now;
        if (!still) at += dt * speed;
        if (now - lastDraw >= (window.innerWidth < 860 ? 33 : 0)) {
          lastDraw = now;
          main?.draw(at);
        }
        raf = requestAnimationFrame(tick);
      };
      // Arranque diferido: no competir con la carga inicial.
      const go = () => (raf = requestAnimationFrame(tick));
      if ("requestIdleCallback" in window) {
        const id = requestIdleCallback(go, { timeout: 2500 });
        cancelIdle = () => cancelIdleCallback(id);
      } else {
        const id = setTimeout(go, 1500);
        cancelIdle = () => clearTimeout(id);
      }
    };

    const fallback = () => {
      worker?.terminate();
      worker = null;
      curW = curN = 0; // los canvases ya transferidos no sirven: recrearlos
      startMain();
      layout();
      view();
    };

    if ("transferControlToOffscreen" in HTMLCanvasElement.prototype && typeof Worker !== "undefined") {
      try {
        worker = createWorker();
        worker.onerror = fallback;
        post({ type: "init", amp: intensity, speed, still });
      } catch {
        worker = null;
      }
    }
    if (!worker) startMain();

    const layout = () => {
      const W = wrap.clientWidth, docH = wrap.offsetHeight;
      if (!W || !docH) return;
      const n = Math.ceil(docH / TILE);
      if (W !== curW || n !== curN) {
        curW = W;
        curN = n;
        curH = docH;
        const cvs = Array.from({ length: n }, (_, i) => {
          const cv = document.createElement("canvas");
          cv.width = W;
          cv.height = TILE;
          cv.style.cssText = "position:absolute;left:0;top:" + i * TILE + "px;width:" + W + "px;height:" + TILE + "px;display:block";
          return cv;
        });
        wrap.replaceChildren(...cvs);
        if (worker) {
          const offs = cvs.map((c) => c.transferControlToOffscreen());
          post({ type: "tiles", canvases: offs, W, docH }, offs);
        } else main?.setTiles(cvs as Cv[], W, docH);
      } else if (docH !== curH) {
        curH = docH;
        if (worker) post({ type: "size", W, docH });
        else main?.setSize(W, docH);
      }
    };

    const view = () => {
      viewRaf = 0;
      const vTop = -wrap.getBoundingClientRect().top, VH = window.innerHeight;
      if (worker) post({ type: "view", vTop, VH, VW: window.innerWidth });
      else {
        main?.setView(vTop, VH);
        if (still) main?.draw(0);
      }
    };
    const onScroll = () => {
      if (!viewRaf) viewRaf = requestAnimationFrame(view);
    };
    const onVisibility = () => post({ type: "pause", paused: document.hidden });

    const ro = new ResizeObserver(() => {
      layout();
      view();
    });
    ro.observe(wrap);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(viewRaf);
      cancelIdle();
      worker?.terminate();
      main?.dispose();
      wrap.replaceChildren();
    };
  }, [intensity, speed]);

  return <div ref={ref} className="aurora" aria-hidden="true" />;
}

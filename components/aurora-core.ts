// Motor de la aurora de fondo, sin dependencias del DOM: lo usan el Web Worker (components/aurora.worker.ts)
// y el fallback en el hilo principal (components/AuroraBackground.tsx).
// Geometría y valores copiados de auroraBuild() / drawAurora() / drawRegion() en design/Antoky v2.dc.html.
// Optimización (mismo resultado visual): los trazos tenues y su halo no dependen del tiempo, así que se
// dibujan una vez por tile en una caché; cada frame solo se dibujan la luz que corre (dashes) y las chispas.

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

export function build(W: number, docH: number): Aurora {
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

/** Mensajes del hilo principal al worker (components/aurora.worker.ts). */
export type AuroraMsg =
  | { type: "init"; amp: number; speed: number; still: boolean }
  | { type: "tiles"; canvases: OffscreenCanvas[]; W: number; docH: number }
  | { type: "size"; W: number; docH: number }
  | { type: "view"; vTop: number; VH: number; VW: number }
  | { type: "pause"; paused: boolean };

export const TILE = 640;
const M = 48;
const G = "212,255,58", C = "238,255,175";

export type Cv = HTMLCanvasElement | OffscreenCanvas;
type Ctx = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
const ctx2d = (c: Cv) => c.getContext("2d") as Ctx;

type Dash = { path: Path2D; s0: number; l: number; dim: number; edge: number };
type Tile = { cv: Cv; dirty: boolean; cache: Cv | null; dashes: Dash[] };

export class AuroraRenderer {
  private tiles: Tile[] = [];
  private aur: Aurora | null = null;
  private rebuildT: ReturnType<typeof setTimeout> | undefined;
  private W = 0;
  private docH = 0;
  private vTop = 0;
  private VH = 0;
  private off: Cv;
  private sm: Cv;

  constructor(private mk: (w: number, h: number) => Cv, private amp: number) {
    this.off = mk(1, 1);
    this.sm = mk(1, 1);
  }

  /** Nuevos canvases de tile (cambió el ancho o la cantidad). */
  setTiles(cvs: Cv[], W: number, docH: number) {
    this.tiles = cvs.map((cv) => ({ cv, dirty: true, cache: null, dashes: [] }));
    this.setSize(W, docH);
  }

  /** Mismo criterio que el prototipo: ancho nuevo → reconstruir ya; solo alto → reconstruir a los 250 ms. */
  setSize(W: number, docH: number) {
    this.W = W;
    this.docH = docH;
    if (!W || !docH) return;
    if (!this.aur || this.aur.W !== W || Math.abs(this.aur.docH - docH) > 2) {
      clearTimeout(this.rebuildT);
      if (!this.aur || this.aur.W !== W) this.rebuild();
      else this.rebuildT = setTimeout(() => this.rebuild(), 250);
    }
    const RH = TILE + 2 * M;
    if (this.off.width !== W || this.off.height !== RH) {
      this.off.width = W;
      this.off.height = RH;
      this.sm.width = Math.ceil(W / 4);
      this.sm.height = Math.ceil(RH / 4);
    }
  }

  setView(vTop: number, VH: number) {
    this.vTop = vTop;
    this.VH = VH;
  }

  dispose() {
    clearTimeout(this.rebuildT);
  }

  private rebuild() {
    this.aur = build(this.W, this.docH);
    this.tiles.forEach((t) => {
      t.cache = null;
      t.dashes = [];
    });
  }

  draw(t: number) {
    const A = this.aur, W = this.W;
    if (!A || !W) return;
    this.tiles.forEach((tile, ti) => {
      const top = ti * TILE;
      const visible = top + TILE > this.vTop - 200 && top < this.vTop + this.VH + 200;
      if (!visible) {
        if (!tile.dirty) {
          ctx2d(tile.cv).clearRect(0, 0, W, TILE);
          tile.dirty = true;
          tile.cache = null; // libera memoria de tiles lejanos
          tile.dashes = [];
        }
        return;
      }
      tile.dirty = false;
      if (!tile.cache) this.prepare(tile, top - M, A);
      this.drawDynamic(top - M, A, tile.dashes, t);
      const ctx = ctx2d(tile.cv);
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, W, TILE);
      ctx.drawImage(tile.cache!, 0, 0);
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.6;
      ctx.drawImage(this.sm, 0, -M, W, TILE + 2 * M);
      ctx.globalAlpha = 1;
      ctx.drawImage(this.off, 0, -M);
      ctx.globalCompositeOperation = "source-over";
    });
  }

  /** Trazos tenues + halo en caché, y los Path2D de cada línea para la luz que corre. */
  private prepare(tile: Tile, sy: number, A: Aurora) {
    const W = this.W, H = TILE + 2 * M, amp = this.amp, o = ctx2d(this.off);
    o.globalCompositeOperation = "source-over";
    o.clearRect(0, 0, W, H);
    o.globalCompositeOperation = "lighter";
    o.lineCap = "round";
    o.lineJoin = "round";
    o.setLineDash([]);
    const dashes: Dash[] = [];
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
        const path = new Path2D();
        for (let i = k0; i <= k1; i++) {
          const p = pts[i], d = fr * p.w + Math.sin(p.u * 40 + l * 1.7) * 3;
          const x = p.x + p.nx * d, y = p.y + p.ny * d - sy;
          if (i === k0) path.moveTo(x, y);
          else path.lineTo(x, y);
        }
        o.lineWidth = l % 4 === 0 ? 1.4 : 0.9;
        o.strokeStyle = "rgba(" + G + "," + ((0.16 + 0.22 * edge) * amp * r.dim).toFixed(3) + ")";
        o.stroke(path);
        dashes.push({ path, s0: pts[k0].s, l, dim: r.dim, edge });
      }
    });
    this.blurToSm();
    const cache = this.mk(W, TILE), c = ctx2d(cache);
    c.globalCompositeOperation = "lighter";
    c.globalAlpha = 0.6;
    c.drawImage(this.sm, 0, -M, W, H);
    c.globalAlpha = 1;
    c.drawImage(this.off, 0, -M);
    tile.cache = cache;
    tile.dashes = dashes;
  }

  /** Por frame: luz que corre por las líneas y chispas, en `off`, más su halo en `sm`. */
  private drawDynamic(sy: number, A: Aurora, dashes: Dash[], t: number) {
    const W = this.W, H = TILE + 2 * M, amp = this.amp, o = ctx2d(this.off);
    o.globalCompositeOperation = "source-over";
    o.clearRect(0, 0, W, H);
    o.globalCompositeOperation = "lighter";
    o.lineCap = "round";
    o.lineJoin = "round";
    for (const d of dashes) {
      const l = d.l, len = 140 + ((l * 53) % 220), gap = 260 + ((l * 97) % 420);
      o.setLineDash([len, gap]);
      o.lineDashOffset = d.s0 - t * (0.11 + (l % 5) * 0.025);
      o.lineWidth = l % 4 === 0 ? 2.2 : 1.4;
      o.strokeStyle = "rgba(" + C + "," + ((0.35 + 0.45 * d.edge) * amp * d.dim).toFixed(3) + ")";
      o.stroke(d.path);
    }
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
    this.blurToSm();
  }

  private blurToSm() {
    const s = ctx2d(this.sm);
    s.clearRect(0, 0, this.sm.width, this.sm.height);
    s.filter = "blur(5px)";
    s.drawImage(this.off, 0, 0, this.sm.width, this.sm.height);
    s.filter = "none";
  }
}

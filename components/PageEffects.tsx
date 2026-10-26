"use client";

import { useEffect } from "react";

// Efectos de scroll del diseño v8, portados del componente del prototipo. Trabajan sobre el DOM de app/page.tsx
// a través de los atributos [data-*]; con prefers-reduced-motion se muestran estáticos.

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const pad = (n: number) => String(n).padStart(2, "0");
const $ = <T extends Element = HTMLElement>(q: string, root: ParentNode = document) => root.querySelector<T>(q);
const $$ = <T extends Element = HTMLElement>(q: string, root: ParentNode = document) => [...root.querySelectorAll<T>(q)];

type Cleanup = () => void;

/** Salto desde un enlace interno: mientras dura el scroll suave los efectos se congelan; al llegar, cada uno se ajusta sin transición. */
const jump = { on: false, snaps: new Set<() => void>() };
function onSnap(fn: () => void): Cleanup {
  jump.snaps.add(fn);
  return () => jump.snaps.delete(fn);
}

function on(target: EventTarget, type: string, fn: EventListener, opts?: AddEventListenerOptions): Cleanup {
  target.addEventListener(type, fn, opts);
  return () => target.removeEventListener(type, fn, opts);
}

/** Letras del titular que se inclinan al pasar el cursor. */
function splitLetters() {
  const h = $("[data-letters]");
  if (!h || h.dataset.split) return;
  h.dataset.split = "1";
  const walk = (node: Node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        (n.textContent ?? "").split(/(\s+)/).forEach((w) => {
          if (!w) return;
          if (/^\s+$/.test(w)) {
            frag.appendChild(document.createTextNode(w));
            return;
          }
          const word = document.createElement("span");
          word.style.cssText = "display:inline-block;white-space:nowrap";
          [...w].forEach((ch) => {
            const s = document.createElement("span");
            s.textContent = ch;
            s.style.cssText = "display:inline-block;transition:transform .5s cubic-bezier(.22,1,.36,1);will-change:transform";
            s.addEventListener("mouseenter", () => (s.style.transform = "translateY(-0.06em) rotate(-5deg)"));
            s.addEventListener("mouseleave", () => setTimeout(() => (s.style.transform = ""), 120));
            word.appendChild(s);
          });
          frag.appendChild(word);
        });
        (n as ChildNode).replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
  };
  walk(h);
}

/** ¿El primer fondo opaco bajo el elemento es oscuro? */
function isDarkBg(el: Element | null | undefined) {
  for (; el && el !== document.documentElement; el = el.parentElement) {
    const c = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
    if (!c) continue;
    const al = c[3] === undefined ? 1 : +c[3];
    if (al < 0.5) continue;
    return 0.2126 * +c[0] + 0.7152 * +c[1] + 0.0722 * +c[2] < 90;
  }
  return false;
}

/** Hero: una bola oscura sube y crece hasta llenar la pantalla; recorta también el header y los botones. Header oscuro sobre fondos oscuros. */
function setupHero(still: boolean): Cleanup {
  const hero = document.getElementById("inicio");
  const inner = hero && $("[data-hero-inner]", hero);
  const hdr = $("[data-hdr]");
  if (!hero || !inner) return () => {};

  const wrap = document.createElement("div");
  wrap.setAttribute("aria-hidden", "true");
  wrap.className = "hero-ballwrap";
  const ball = document.createElement("div");
  ball.setAttribute("data-ballfill", "");
  ball.className = "hero-ball";
  wrap.appendChild(ball);
  const back = document.createElement("div");
  back.setAttribute("aria-hidden", "true");
  back.setAttribute("data-lightgrid", "");
  back.className = "hero-back";
  if (!still) inner.prepend(wrap);
  inner.prepend(back);
  if (still) {
    hero.style.height = "auto";
    hero.style.marginBottom = "0";
    Object.assign(inner.style, { position: "relative", top: "0", height: "auto", padding: "48px 0" });
  }

  let hclone: HTMLDivElement | null = null;
  if (hdr && !still && hdr.firstElementChild) {
    hclone = document.createElement("div");
    hclone.setAttribute("data-hdr", "");
    hclone.setAttribute("data-dark", "1");
    hclone.setAttribute("aria-hidden", "true");
    hclone.className = "hclone";
    const c = hdr.firstElementChild.cloneNode(true) as HTMLElement;
    c.querySelectorAll("[data-hnav] a").forEach((a) => a.removeAttribute("data-active"));
    c.querySelectorAll("a").forEach((a) => a.setAttribute("tabindex", "-1"));
    hclone.appendChild(c);
    hdr.appendChild(hclone);
  }

  const flats = $$("[data-pflat],[data-cflat]", inner);
  let bx = 0,
    by = 0,
    br = 0,
    raf = 0;

  const checkHeader = (p: number) => {
    if (!hdr) return;
    const y = hdr.offsetHeight + 1;
    const wr = wrap.getBoundingClientRect();
    let cover = false;
    if (p > 0 && !still) cover = Math.hypot(innerWidth / 2 - (wr.left + bx), y - (wr.top + by)) < br && y <= wr.bottom && y >= wr.top;
    if (hclone) {
      const hr = hdr.getBoundingClientRect();
      hclone.style.clipPath =
        p > 0 && wr.bottom > 0 ? `circle(${br.toFixed(1)}px at ${(wr.left + bx - hr.left).toFixed(1)}px ${(wr.top + by - hr.top).toFixed(1)}px)` : "circle(0px at 50% 200%)";
    }
    tone(cover);
  };
  /** Header oscuro sobre fondos oscuros (sigue activo durante un salto). */
  const tone = (cover = false) => {
    if (!hdr) return;
    const y = hdr.offsetHeight + 1;
    // Se ignora el loader, que cubre la página al inicio.
    const dark = isDarkBg(document.elementsFromPoint(innerWidth / 2, y).filter((el) => !hdr.contains(el) && !el.closest(".loader"))[0]);
    if ((hdr.dataset.dark === "1") !== dark) hdr.dataset.dark = dark ? "1" : "";
    const sd = dark || cover ? "1" : "";
    if (document.documentElement.dataset.sdark !== sd) document.documentElement.dataset.sdark = sd;
  };

  const update = () => {
    raf = 0;
    if (jump.on) return tone();
    const H = inner.offsetHeight;
    wrap.style.height = H + "px";
    const dist = Math.max(1, hero.offsetHeight - H);
    const p = clamp(-hero.getBoundingClientRect().top / (dist * 0.92));
    const wr = wrap.getBoundingClientRect();
    const W = wr.width;
    const r0 = Math.min(90, innerWidth * 0.12);
    const midY = H / 2;
    const startY = H + r0;
    let cy: number, r: number;
    if (p < 0.32) {
      const k = smooth(p / 0.32);
      cy = startY + (midY - startY) * k;
      r = r0 * (0.5 + 0.5 * k);
    } else {
      const k = smooth((p - 0.32) / 0.68);
      cy = midY;
      const rEnd = Math.hypot(Math.max(W / 2, 1), Math.max(cy, H - cy)) + 2;
      r = r0 + (rEnd - r0) * k;
    }
    bx = W / 2;
    by = cy;
    br = p > 0 ? r : 0;
    ball.style.clipPath = `circle(${br.toFixed(1)}px at 50% ${cy.toFixed(1)}px)`;
    flats.forEach((pf) => {
      const q = pf.getBoundingClientRect();
      pf.style.clipPath = br > 0 ? `circle(${br.toFixed(1)}px at ${(wr.left + bx - q.left).toFixed(1)}px ${(wr.top + by - q.top).toFixed(1)}px)` : "circle(0px at 50% 200%)";
    });
    checkHeader(p);
  };
  update();
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  const offs = [on(window, "scroll", onScroll, { passive: true }), on(window, "resize", update), onSnap(update)];
  return () => {
    offs.forEach((f) => f());
    cancelAnimationFrame(raf);
    wrap.remove();
    back.remove();
    hclone?.remove();
  };
}

/** Problemas: tarjetas que entran desde la derecha y se apilan mientras la sección está fija. */
function setupPin(still: boolean): Cleanup {
  const pin = $("[data-pin]");
  if (!pin) return () => {};
  const inner = $("[data-pin-inner]", pin)!,
    stage = $("[data-stage]", pin)!;
  const cards = $$("[data-pcard]", pin),
    segs = $$("[data-pseg]", pin);
  const count = $("[data-pcount]", pin),
    n = cards.length;
  if (!n) return () => {};
  if (still) {
    pin.style.height = "auto";
    Object.assign(inner.style, { position: "static", height: "auto" });
    Object.assign(stage.style, { height: "auto", display: "grid", gap: "12px" });
    cards.forEach((c) => Object.assign(c.style, { position: "relative", transform: "none", opacity: "1", minHeight: "280px" }));
    segs.forEach((s) => (s.style.transform = "none"));
    if (count) count.style.display = "none";
    return () => {};
  }
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const target = () => {
    const total = Math.max(1, pin.offsetHeight - inner.offsetHeight);
    const raw = clamp(-pin.getBoundingClientRect().top / total) * (n - 1);
    const base = Math.floor(raw),
      fr = raw - base;
    return Math.min(n - 1, base + ease(clamp((fr - 0.12) / 0.76)));
  };
  let cur = target(),
    raf = 0,
    lastCount = -1;
  const render = (p: number) => {
    cards.forEach((c, i) => {
      const o = i - p;
      let x = 0,
        y = 0,
        s = 1,
        op = 1,
        rot = 0;
      if (o >= 0) {
        const k = Math.min(o, 1);
        x = k * 105;
        y = k * 6;
        rot = k * 5;
        op = 1 - Math.pow(k, 3);
      } else {
        const k = Math.min(-o, 1);
        x = -k * 10;
        y = -k * 2;
        s = 1 - k * 0.1;
        rot = -k * 1.5;
        op = 1 - k * k;
      }
      c.style.transform = `translate3d(${x.toFixed(2)}%,${y.toFixed(2)}%,0) rotate(${rot.toFixed(2)}deg) scale(${s.toFixed(4)})`;
      c.style.opacity = op.toFixed(3);
      c.style.zIndex = String(i);
      c.style.visibility = op <= 0.002 ? "hidden" : "visible";
    });
    segs.forEach((sg, i) => (sg.style.transform = `scaleX(${clamp(p - i + 1).toFixed(4)})`));
    const ci = Math.round(p);
    if (count && ci !== lastCount) {
      lastCount = ci;
      count.textContent = `${pad(ci + 1)} / ${pad(n)}`;
    }
  };
  const tick = () => {
    if (jump.on) return void (raf = 0);
    const t = target();
    cur += (t - cur) * 0.085;
    if (Math.abs(t - cur) < 0.0005) cur = t;
    render(cur);
    raf = cur === t ? 0 : requestAnimationFrame(tick);
  };
  render(cur);
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };
  const offs = [
    on(window, "scroll", onScroll, { passive: true }),
    on(window, "resize", onScroll),
    onSnap(() => {
      cur = target();
      render(cur);
    }),
  ];
  return () => {
    offs.forEach((f) => f());
    cancelAnimationFrame(raf);
  };
}

/** Antes/después: las imágenes entran girando en 3D y se inclinan siguiendo el cursor. */
function setupTilt(still: boolean): Cleanup {
  const tilts = $$("[data-tilt]");
  const offs: Cleanup[] = [];
  const outs = tilts.map((w, idx) => {
    const o = document.createElement("div");
    o.className = "tilt-out";
    w.parentNode!.insertBefore(o, w);
    o.appendChild(w);
    return { o, w, dir: idx % 2 === 0 ? -1 : 1 };
  });
  offs.push(() =>
    outs.forEach(({ o, w }) => {
      o.replaceWith(w);
    }),
  );
  if (still || !outs.length) return () => offs.forEach((f) => f());

  // Entrada/salida ligada al scroll, suavizada.
  let raf = 0,
    cur: number[][] | null = null;
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);
  const tgt = () =>
    outs.map(({ o }) => {
      const r = (o.parentNode as HTMLElement).getBoundingClientRect();
      return [clamp((innerHeight - r.top - 60) / (innerHeight * 0.55)), clamp((innerHeight * 0.4 - r.bottom) / (innerHeight * 0.4))];
    });
  const draw = (vals: number[][]) =>
    outs.forEach(({ o, dir }, i) => {
      const e = ease(vals[i][0]),
        k = 1 - e,
        x = ease(vals[i][1]);
      const tx = dir * k * 140 - dir * x * 90,
        ty = k * 60 - x * 80;
      const ry = -dir * k * 28 + dir * x * 22,
        rx = x * 18,
        rz = dir * k * 6 - dir * x * 4;
      const sc = (0.86 + e * 0.14) * (1 - x * 0.12);
      o.style.transform = `perspective(1200px) translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${sc.toFixed(4)})`;
      o.style.opacity = (Math.min(1, e * 1.3) * (1 - x)).toFixed(3);
      const b = Math.max(k, x);
      o.style.filter = b > 0.01 ? `blur(${(b * 8).toFixed(1)}px)` : "";
    });
  const tick = () => {
    if (jump.on) return void (raf = 0);
    const t = tgt();
    if (!cur) cur = t.map((v) => v.slice());
    let moving = false;
    cur = cur.map((c, i) =>
      c.map((cv, j) => {
        const nv = cv + (t[i][j] - cv) * 0.1;
        if (Math.abs(t[i][j] - nv) > 0.001) {
          moving = true;
          return nv;
        }
        return t[i][j];
      }),
    );
    draw(cur);
    raf = moving ? requestAnimationFrame(tick) : 0;
  };
  cur = tgt();
  draw(cur);
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };
  offs.push(
    on(window, "scroll", onScroll, { passive: true }),
    on(window, "resize", onScroll),
    onSnap(() => {
      cur = tgt();
      draw(cur);
    }),
    () => cancelAnimationFrame(raf),
  );

  // Inclinación con el cursor (solo con mouse).
  if (matchMedia("(hover: hover)").matches) {
    outs.forEach(({ w }, idx) => {
      const img = w.firstElementChild as HTMLElement | null;
      if (!img) return;
      const rest = idx % 2 === 0 ? "rotateY(14deg) rotateX(4deg) rotateZ(-1deg)" : "rotateY(-14deg) rotateX(4deg) rotateZ(1deg)";
      const restF = idx % 2 === 0 ? "drop-shadow(-18px 26px 30px rgba(0,0,0,.5))" : "drop-shadow(18px 26px 30px rgba(0,0,0,.5))";
      img.style.transform = rest;
      img.style.filter = restF;
      offs.push(
        on(w, "pointermove", (ev) => {
          const e = ev as PointerEvent;
          const r = w.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5,
            y = (e.clientY - r.top) / r.height - 0.5;
          img.style.transition = "transform .15s ease-out,filter .3s";
          img.style.transform = `rotateX(${(-y * 12).toFixed(2)}deg) rotateY(${(x * 14).toFixed(2)}deg) translateZ(30px) scale(1.02)`;
          img.style.filter = `drop-shadow(${(-x * 24).toFixed(1)}px ${(20 - y * 14).toFixed(1)}px 30px rgba(0,0,0,.55))`;
        }),
        on(w, "pointerleave", () => {
          img.style.transition = "transform .8s cubic-bezier(.2,.8,.2,1),filter .8s";
          img.style.transform = rest;
          img.style.filter = restF;
        }),
      );
    });
  }
  return () => offs.forEach((f) => f());
}

/** Tarjetas de los fundadores: inclinación 3D con el cursor. */
function setupFounders(still: boolean): Cleanup {
  const rest = "rotateY(-8deg) rotateX(4deg)";
  const can = !still && matchMedia("(hover: hover)").matches;
  const offs: Cleanup[] = [];
  $$("[data-fcard]").forEach((c) => {
    const t = $("[data-f3d]", c),
      img = $("[data-fimg]", c);
    if (!t) return;
    t.style.transform = can ? rest : "none";
    if (!can) return;
    offs.push(
      on(c, "pointermove", (ev) => {
        const e = ev as PointerEvent;
        const r = c.getBoundingClientRect(),
          x = (e.clientX - r.left) / r.width - 0.5,
          y = (e.clientY - r.top) / r.height - 0.5;
        t.style.transition = "transform .15s ease-out";
        t.style.transform = `rotateY(${(x * 18).toFixed(2)}deg) rotateX(${(-y * 14).toFixed(2)}deg) translateZ(20px)`;
        if (img) img.style.transform = `scale(1.06) translate(${(-x * 10).toFixed(1)}px,${(-y * 8).toFixed(1)}px)`;
      }),
      on(c, "pointerleave", () => {
        t.style.transition = "transform .9s cubic-bezier(.2,.8,.2,1)";
        t.style.transform = rest;
        if (img) img.style.transform = "";
      }),
    );
  });
  return () => offs.forEach((f) => f());
}

/** Beneficios resaltados por cercanía al centro, carril horizontal de demostraciones, línea del método y apertura circular del contacto. */
function setupFx(still: boolean): Cleanup {
  const bens = $$("[data-ben]"),
    bcount = $("[data-bcount]");
  const hp = $("[data-hpin]"),
    hin = hp && $("[data-hpin-inner]", hp),
    track = hp && $("[data-htrack]", hp);
  const hcards = track ? $$("[data-card]", track) : [],
    hbar = $("[data-hbar]"),
    hcount = $("[data-hcount]");
  const mwrap = $("[data-mwrap]"),
    mtrack = $("[data-mtrack]"),
    mline = $("[data-mline]"),
    msteps = $$("[data-mstep]");
  const ct = document.getElementById("contacto");
  if (still) {
    if (hin && track) {
      Object.assign(hin.style, { position: "static", height: "auto" });
      Object.assign(track.style, { overflowX: "auto", scrollbarWidth: "none" });
    }
    if (mline) mline.style.transform = "none";
    return () => {};
  }
  let travel = 0,
    hcur: number | null = null,
    raf = 0;
  const layout = () => {
    if (!hp || !hin || !track) return;
    travel = Math.max(0, track.scrollWidth - hin.clientWidth);
    hp.style.height = hin.offsetHeight + travel * 1.1 + "px";
  };
  const frame = () => {
    raf = 0;
    if (jump.on) return;
    const H = innerHeight;
    if (bens.length) {
      let best = 0,
        bk = -1;
      bens.forEach((b, i) => {
        const r = b.getBoundingClientRect();
        const k = clamp(1 - Math.abs(r.top + r.height / 2 - H * 0.5) / (H * 0.45)),
          e = smooth(k);
        b.style.opacity = (0.2 + 0.8 * e).toFixed(3);
        b.style.transform = `translateX(${((1 - e) * -20).toFixed(1)}px)`;
        if (k > bk) {
          bk = k;
          best = i;
        }
      });
      bens.forEach((b, i) => {
        const v = i === best && bk > 0 ? "1" : "";
        if (b.dataset.on !== v) b.dataset.on = v;
      });
      if (bcount) {
        const t = pad(best + 1);
        if (bcount.textContent !== t) bcount.textContent = t;
      }
    }
    let moving = false;
    if (hp && hin && track && hcards.length) {
      const r = hp.getBoundingClientRect();
      const t = clamp(-r.top / Math.max(1, hp.offsetHeight - hin.offsetHeight));
      if (hcur === null) hcur = t;
      hcur += (t - hcur) * 0.11;
      if (Math.abs(t - hcur) < 0.0005) hcur = t;
      else moving = true;
      track.style.transform = `translate3d(${(-hcur * travel).toFixed(1)}px,0,0)`;
      if (hbar) hbar.style.transform = `scaleX(${hcur.toFixed(4)})`;
      const ir = hin.getBoundingClientRect(),
        w = hcards[0].offsetWidth;
      const ax = ir.left + w / 2 + (ir.width - w) * hcur;
      let ci = 0,
        cd = 1e9;
      hcards.forEach((c, i) => {
        const cx = c.offsetLeft - hcur! * travel + ir.left + c.offsetWidth / 2,
          d = Math.abs(cx - ax);
        if (d < cd) {
          cd = d;
          ci = i;
        }
        const e = smooth(clamp(1 - d / (w * 1.6)));
        c.style.opacity = (0.4 + 0.6 * e).toFixed(3);
        c.style.transform = `scale(${(0.93 + 0.07 * e).toFixed(4)}) rotate(${((1 - e) * (cx > ax ? 1.5 : -1.5)).toFixed(2)}deg)`;
      });
      if (hcount) {
        const tx = `${pad(ci + 1)} / ${pad(hcards.length)}`;
        if (hcount.textContent !== tx) hcount.textContent = tx;
      }
    }
    if (mwrap && msteps.length) {
      const horiz = mtrack !== null && mtrack.offsetParent !== null;
      let cur = -1,
        p: number;
      if (horiz) {
        p = clamp((H * 0.85 - mwrap.getBoundingClientRect().top) / (H * 0.5));
        msteps.forEach((_, i) => {
          if (p >= i / msteps.length + 0.03) cur = i;
        });
        if (p >= 0.98) cur = msteps.length - 1;
      } else {
        msteps.forEach((m, i) => {
          if (m.getBoundingClientRect().top < H * 0.62) cur = i;
        });
        p = (cur + 1) / msteps.length;
      }
      if (mline) mline.style.transform = `scaleX(${p.toFixed(4)})`;
    }
    if (ct) {
      const r = ct.getBoundingClientRect();
      const p = smooth(clamp((H - r.top) / (Math.min(r.height, H) * 0.85)));
      if (p >= 1) {
        if (ct.style.clipPath !== "none") ct.style.clipPath = "none";
      } else {
        const cy = Math.min(r.height, Math.max(0, H - r.top));
        const R = p * (Math.hypot(r.width / 2, Math.max(cy, r.height - cy)) + 4);
        ct.style.clipPath = `circle(${R.toFixed(1)}px at 50% ${cy.toFixed(1)}px)`;
      }
    }
    if (moving) raf = requestAnimationFrame(frame);
  };
  layout();
  frame();
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };
  const onResize = () => {
    layout();
    onScroll();
  };
  const offs = [
    on(window, "scroll", onScroll, { passive: true }),
    on(window, "resize", onResize),
    onSnap(() => {
      hcur = null;
      frame();
    }),
  ];
  let ro: ResizeObserver | undefined;
  if (track && hin) {
    ro = new ResizeObserver(onResize);
    ro.observe(track);
    ro.observe(hin);
  }
  document.fonts?.ready.then(onResize);
  return () => {
    offs.forEach((f) => f());
    ro?.disconnect();
    cancelAnimationFrame(raf);
  };
}

/** Menú: se oculta si no cabe, y marca la sección visible. Pasos del método: tocar para resaltar (pantallas táctiles). */
function setupNav(): Cleanup {
  const offs: Cleanup[] = [];
  const steps = $$("[data-mstep]");
  steps.forEach((m) =>
    offs.push(
      on(m, "click", () => {
        const v = m.dataset.tap !== "1";
        steps.forEach((x) => (x.dataset.tap = ""));
        if (v) m.dataset.tap = "1";
      }),
    ),
  );

  const nav = $("[data-hnav]");
  let ro: ResizeObserver | undefined;
  if (nav?.parentElement) {
    const fit = () => {
      const all = $$("[data-hnav]");
      all.forEach((n) => n.removeAttribute("data-hide"));
      if (getComputedStyle(nav).display === "none") return;
      if (nav.scrollWidth > nav.clientWidth + 1) all.forEach((n) => n.setAttribute("data-hide", "1"));
    };
    ro = new ResizeObserver(fit);
    ro.observe(nav.parentElement);
    fit();
    document.fonts?.ready.then(fit);
  }

  const links = $$<HTMLAnchorElement>("[data-hdr]:not(.hclone) [data-hnav] a");
  const ids = ["nosotros", "metodo", "demostraciones", "resultados", "demo", "problemas"];
  const spy = () => {
    if (jump.on) return;
    let cur = "";
    for (const id of ids) {
      const r = document.getElementById(id)?.getBoundingClientRect();
      if (r && r.top <= 140 && r.bottom > 140) {
        cur = id;
        break;
      }
    }
    links.forEach((a) => {
      const v = a.getAttribute("href") === "#" + cur;
      if ((a.dataset.active === "1") !== v) a.dataset.active = v ? "1" : "";
      if (v) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  };
  spy();
  offs.push(on(window, "scroll", spy, { passive: true }), onSnap(spy));
  return () => {
    offs.forEach((f) => f());
    ro?.disconnect();
  };
}

/** Aparición al hacer scroll de los [data-reveal] (solo lo que está debajo del primer pantallazo). */
function setupReveal(still: boolean): Cleanup {
  if (still) return () => {};
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        // Durante un salto se ignora; sigue observado y aparece si el usuario vuelve.
        if (!e.isIntersecting || jump.on) return;
        show(e.target as HTMLElement);
      }),
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );
  const hidden = new Set<HTMLElement>();
  const show = (el: HTMLElement) => {
    el.style.opacity = "1";
    el.style.transform = "none";
    io.unobserve(el);
    hidden.delete(el);
  };
  $$("[data-reveal]").forEach((el) => {
    if (el.getBoundingClientRect().top < innerHeight) return;
    const sib = el.parentElement ? [...el.parentElement.children].filter((c) => c.hasAttribute("data-reveal")).indexOf(el) : 0;
    const delay = Math.max(0, sib) * 70;
    el.style.opacity = "0";
    el.style.transform = "translateY(28px)";
    el.style.transition = `opacity .8s cubic-bezier(.2,.7,.2,1) ${delay}ms, transform .8s cubic-bezier(.2,.7,.2,1) ${delay}ms`;
    hidden.add(el);
    io.observe(el);
  });
  // Al llegar de un salto, lo visible aparece ya colocado, sin animación.
  const off = onSnap(() =>
    hidden.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= innerHeight) return;
      el.style.transition = "none";
      show(el);
    }),
  );
  return () => {
    off();
    io.disconnect();
  };
}

/** Enlaces internos (#id): salto instantáneo hasta cerca del destino y tramo final animado a mano (igual en todos los
 *  navegadores), sin recorrer las secciones fijas de por medio. Los efectos se congelan durante el tramo y se ajustan
 *  al llegar; la rueda, la pantalla o una tecla lo sueltan antes. */
function setupJump(still: boolean): Cleanup {
  let raf = 0;
  const to = (top: number) => window.scrollTo({ top, behavior: "instant" });
  // Los efectos ignoran el scroll mientras jump.on; para ajustarlos se suelta un momento.
  const snapAll = () => {
    const was = jump.on;
    jump.on = false;
    jump.snaps.forEach((f) => f());
    jump.on = was;
  };
  const end = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    if (!jump.on) return;
    jump.on = false;
    snapAll();
    delete document.documentElement.dataset.jump;
  };
  const onClick = (ev: Event) => {
    const e = ev as MouseEvent;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
    const id = a?.getAttribute("href")?.slice(1);
    const el = id ? document.getElementById(id) : null;
    if (!el) return;
    e.preventDefault();
    end();
    if (location.hash !== "#" + id) history.pushState(null, "", "#" + id);
    const max = document.documentElement.scrollHeight - innerHeight;
    const goal = Math.round(clamp(el.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0), 0, max));
    const dist = goal - scrollY;
    if (Math.abs(dist) < 2) return;
    jump.on = true;
    // Sin transiciones de color del header mientras dura (ver home.css).
    document.documentElement.dataset.jump = "1";
    if (still) {
      to(goal);
      return end();
    }
    const hop = Math.min(Math.abs(dist), innerHeight * 0.6);
    const from = goal - Math.sign(dist) * hop;
    // Antes del tramo, y sin pintar entre medias: lo que se ve en el punto de partida aparece ya revelado, y el resto de
    // efectos queda en su estado final (el del destino), así no cambian durante el tramo ni al llegar.
    to(from);
    snapAll();
    to(goal);
    snapAll();
    to(from);
    const t0 = performance.now(),
      dur = 550;
    const step = (now: number) => {
      const k = clamp((now - t0) / dur);
      to(from + (goal - from) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(step);
      else end();
    };
    raf = requestAnimationFrame(step);
  };
  const offs = [
    on(document, "click", onClick, { capture: true }),
    on(window, "wheel", end, { passive: true }),
    on(window, "touchstart", end, { passive: true }),
    on(window, "keydown", end),
  ];
  return () => {
    offs.forEach((f) => f());
    cancelAnimationFrame(raf);
    jump.on = false;
    delete document.documentElement.dataset.jump;
  };
}

export function PageEffects() {
  useEffect(() => {
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    splitLetters();
    // El orden importa: el header se clona (setupHero) antes de marcar el enlace activo (setupNav).
    const cleanups = [setupPin(still), setupTilt(still), setupHero(still), setupFounders(still), setupFx(still), setupNav(), setupReveal(still), setupJump(still)];
    return () => cleanups.forEach((f) => f());
  }, []);

  return null;
}

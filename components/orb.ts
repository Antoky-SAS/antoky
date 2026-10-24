// Port de orb.js del diseño (claude.ai/design): anillos que recorren una esfera, con un leve ondulado.
import * as THREE from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";

const DEFAULTS = {
  numLines: 20,
  radius: 1.5,
  speed: 20,
  lineWidth: 2,
  color: "#0B0B0C",
  accent: "#0B0B0C",
  accentEvery: 9999,
  background: "#F3F3F0",
  squiggleAmount: 0.04,
  squiggleFrequency: 4,
  squiggleSpeed: 2,
  pointsPerLine: 96,
  still: false,
};

export type OrbOptions = Partial<typeof DEFAULTS>;

export function mountOrb(el: HTMLElement, o: OrbOptions = {}) {
  const c = { ...DEFAULTS, ...o };
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
  renderer.setClearColor(0x000000, 0);
  el.appendChild(renderer.domElement);
  Object.assign(renderer.domElement.style, { width: "100%", height: "100%", display: "block", cursor: "grab", touchAction: "pan-y" });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 5.1);
  const root = new THREE.Group();
  scene.add(root);
  const bg = new THREE.Color(c.background);
  const n = c.numLines,
    P = c.pointsPerLine,
    VC = P + 1;
  const lines: { geo: LineGeometry; mat: LineMaterial; col: THREE.Color; off: number; cosR: number; sinR: number }[] = [];
  for (let i = 0; i < n; i++) {
    const g = new THREE.Group();
    const geo = new LineGeometry();
    const mat = new LineMaterial({ color: 0xffffff, linewidth: c.lineWidth, vertexColors: true });
    g.add(new Line2(geo, mat));
    g.rotation.y = (i / n) * Math.PI;
    root.add(g);
    lines.push({
      geo,
      mat,
      col: new THREE.Color(i % c.accentEvery === 0 ? c.accent : c.color),
      off: (i / n) * c.speed,
      cosR: Math.cos((i / n) * Math.PI),
      sinR: Math.sin((i / n) * Math.PI),
    });
  }
  const pos = new Float32Array(VC * 3),
    colb = new Float32Array(VC * 3);
  const camDir = new THREE.Vector3();
  const cv = renderer.domElement;

  // Arrastre con inercia.
  let yaw = 0,
    pitch = 0.35,
    vy = 0,
    vp = 0,
    drag = false,
    lx = 0,
    ly = 0,
    lastT = 0;
  const qY = new THREE.Quaternion(),
    qX = new THREE.Quaternion(),
    AX = new THREE.Vector3(1, 0, 0),
    AY = new THREE.Vector3(0, 1, 0);
  const onDown = (e: PointerEvent) => {
    drag = true;
    lx = e.clientX;
    ly = e.clientY;
    vy = vp = 0;
    cv.setPointerCapture(e.pointerId);
    cv.style.cursor = "grabbing";
  };
  const onMove = (e: PointerEvent) => {
    if (!drag) return;
    const dx = e.clientX - lx,
      dy = e.clientY - ly;
    lx = e.clientX;
    ly = e.clientY;
    const k = 4.2 / Math.max(200, el.clientWidth);
    vy = dx * k;
    vp = dy * k;
    yaw += vy;
    pitch += vp;
  };
  const onUp = (e: PointerEvent) => {
    drag = false;
    cv.style.cursor = "grab";
    try {
      cv.releasePointerCapture(e.pointerId);
    } catch {}
  };
  cv.addEventListener("pointerdown", onDown);
  cv.addEventListener("pointermove", onMove);
  cv.addEventListener("pointerup", onUp);
  cv.addEventListener("pointercancel", onUp);

  const resize = () => {
    const w = el.clientWidth,
      h = el.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    lines.forEach((l) => l.mat.resolution.set(w, h));
  };
  const ro = new ResizeObserver(resize);
  ro.observe(el);
  resize();
  let visible = true;
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
  });
  io.observe(el);

  const clock = new THREE.Clock();
  const frame = () => {
    const t = c.still ? 4 : clock.getElapsedTime();
    const dt = Math.min(0.05, t - lastT);
    lastT = t;
    if (!drag) {
      yaw += vy;
      pitch += vp;
      vy *= 0.94;
      vp *= 0.94;
      if (!c.still) yaw += dt * 0.12;
    }
    qX.setFromAxisAngle(AX, pitch);
    qY.setFromAxisAngle(AY, yaw);
    root.quaternion.copy(qX).multiply(qY);
    camDir.copy(camera.position).normalize().applyQuaternion(root.quaternion.clone().invert());
    for (let li = 0; li < n; li++) {
      const L = lines[li];
      const prog = ((t + L.off) % c.speed) / c.speed,
        lat = prog * Math.PI;
      const cr = Math.sin(lat) * c.radius,
        yp = Math.cos(lat) * c.radius;
      for (let i = 0; i < P; i++) {
        const a = (i / P) * Math.PI * 2;
        const sq = Math.sin(a * c.squiggleFrequency + t * c.squiggleSpeed + li * 0.5) * c.squiggleAmount;
        const rs = Math.cos(a * c.squiggleFrequency * 1.3 + t * c.squiggleSpeed * 0.8) * c.squiggleAmount * 0.5;
        const dr = cr + (sq + rs) * cr;
        const ys = Math.sin(a * c.squiggleFrequency * 0.7 + t * c.squiggleSpeed * 1.2) * c.squiggleAmount * 0.4;
        const x = Math.cos(a) * dr,
          y = yp + ys * cr,
          z = Math.sin(a) * dr,
          k = i * 3;
        pos[k] = x;
        pos[k + 1] = y;
        pos[k + 2] = z;
        // Más tenue en la cara de atrás.
        const wx = x * L.cosR + z * L.sinR,
          wz = -x * L.sinR + z * L.cosR;
        const d = (wx * camDir.x + y * camDir.y + wz * camDir.z) / c.radius;
        const op = ((d + 1) / 2) * 0.88 + 0.12;
        colb[k] = bg.r + (L.col.r - bg.r) * op;
        colb[k + 1] = bg.g + (L.col.g - bg.g) * op;
        colb[k + 2] = bg.b + (L.col.b - bg.b) * op;
      }
      const e = P * 3;
      pos[e] = pos[0];
      pos[e + 1] = pos[1];
      pos[e + 2] = pos[2];
      colb[e] = colb[0];
      colb[e + 1] = colb[1];
      colb[e + 2] = colb[2];
      L.geo.setPositions(pos);
      L.geo.setColors(colb);
    }
    renderer.render(scene, camera);
  };
  let raf = 0;
  const loop = () => {
    if (visible) frame();
    raf = requestAnimationFrame(loop);
  };
  loop();

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    cv.removeEventListener("pointerdown", onDown);
    cv.removeEventListener("pointermove", onMove);
    cv.removeEventListener("pointerup", onUp);
    cv.removeEventListener("pointercancel", onUp);
    lines.forEach((l) => {
      l.geo.dispose();
      l.mat.dispose();
    });
    renderer.dispose();
    renderer.domElement.remove();
  };
}

// Genera versiones WebP redimensionadas de las imágenes pesadas (npm run images).
// Los originales (PNG/JPG) se conservan: los usa design-system/prepare.mjs y sirven de fuente.
import { readdirSync } from "node:fs";
import sharp from "sharp";

const A = "public/assets/";

// [archivo, ancho máximo]. El ancho es ~2x el tamaño en pantalla.
const jobs = [
  ["myslotfy.png", 1200],
  ["talentoya.png", 1200],
  ["carlos-arias-v2.png", 640],
  ["sebastian-valle-v2.png", 640],
];
// Stock: las de tarjetas grandes a 1200px, las de la galería (220px en pantalla) a 440px.
const TARJETAS = ["photo-1522071820081-009f0129c71c.jpg", "photo-1512941937669-90a1b58e7e9c.jpg"];
for (const f of readdirSync(A + "stock").filter((f) => f.endsWith(".jpg"))) {
  jobs.push(["stock/" + f, TARJETAS.includes(f) ? 1200 : 440]);
}

// Logos: WebP sin pérdida, mismo tamaño (bordes nítidos).
const LOGOS = ["antoky-logo-blanco.png", "antoky-isotipo-blanco.png"];
for (const f of LOGOS) jobs.push([f, null]);

for (const [f, width] of jobs) {
  const out = A + f.replace(/\.(png|jpg)$/, ".webp");
  const img = width ? sharp(A + f).resize({ width, withoutEnlargement: true }) : sharp(A + f);
  const info = await (width ? img.webp({ quality: 78 }) : img.webp({ lossless: true })).toFile(out);
  console.log(out, info.width + "x" + info.height, Math.round(info.size / 1024) + "KB");
}

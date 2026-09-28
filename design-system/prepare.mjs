// Prepara el build del sistema de diseño (npm run build:ds).
// 1) dist-ds/styles.css: fuentes + tokens.css + globals.css en un solo archivo.
// 2) design-system/assets.generated.ts: los assets de marca como data URIs, para que el
// bundle del sistema de diseño funcione sin servidor de archivos. Las fotos de los fundadores
// se recomprimen a JPEG 800px (los PNG originales pesan ~1.8MB). Requiere ImageMagick (`convert`).
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const A = "public/assets/";
const png = (f) => "data:image/png;base64," + readFileSync(A + f).toString("base64");
const jpeg = (f) =>
  "data:image/jpeg;base64," +
  execFileSync("convert", [A + f, "-resize", "800x", "-strip", "-quality", "82", "jpg:-"]).toString("base64");

const out = {
  logoBlanco: png("antoky-logo-blanco.png"),
  logoNegro: png("antoky-logo-negro.png"),
  isotipoBlanco: png("antoky-isotipo-blanco.png"),
  isotipoNegro: png("antoky-isotipo-negro.png"),
  isotipoA: png("antoky-isotipo-a.png"),
  isotipoY: png("antoky-isotipo-y.png"),
  fotoCarlos: jpeg("carlos-arias-v2.png"),
  fotoSebastian: jpeg("sebastian-valle-v2.png"),
};
writeFileSync(
  "design-system/assets.generated.ts",
  "// Generado por design-system/prepare.mjs — no editar.\nexport const embeddedAssets = " + JSON.stringify(out, null, 2) + ";\n"
);
for (const [k, v] of Object.entries(out)) console.log(k, Math.round(v.length / 1024) + "KB");

const FONTS =
  '@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=Inter:wght@400;500&display=swap");';
mkdirSync("dist-ds", { recursive: true });
writeFileSync(
  "dist-ds/styles.css",
  [FONTS, readFileSync("app/tokens.css", "utf8"), readFileSync("app/globals.css", "utf8")].join("\n\n")
);
console.log("dist-ds/styles.css");

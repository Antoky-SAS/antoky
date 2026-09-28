// Rutas de los assets de marca. El sitio los sirve desde public/assets; el bundle del
// sistema de diseño (design-system/index.ts) las reemplaza por data URIs embebidos.
// Los componentes leen este objeto al renderizar, nunca en tiempo de importación.
export const assets = {
  logoBlanco: "/assets/antoky-logo-blanco.png",
  logoNegro: "/assets/antoky-logo-negro.png",
  isotipoBlanco: "/assets/antoky-isotipo-blanco.png",
  isotipoNegro: "/assets/antoky-isotipo-negro.png",
  isotipoA: "/assets/antoky-isotipo-a.png",
  isotipoY: "/assets/antoky-isotipo-y.png",
  fotoCarlos: "/assets/carlos-arias-v2.png",
  fotoSebastian: "/assets/sebastian-valle-v2.png",
};

export type AssetName = keyof typeof assets;

# Notas de design-sync (Antoky)

## Cómo está armado
- El repo es un sitio Next.js, no una librería. En la primera sincronización (2026-09-28) se refactorizó `app/page.tsx` a componentes con props en `components/`. El sitio quedó idéntico píxel a píxel (capturas de 1280 y 390, con movimiento reducido).
- Entry del DS: `design-system/index.ts`. El sitio no lo importa. `npm run build:ds` (= `cfg.buildCmd`) ejecuta `design-system/prepare.mjs`, que genera `dist-ds/styles.css` (Google Fonts @import + app/tokens.css + app/globals.css) y `design-system/assets.generated.ts`, y luego `tsc -p design-system`, que emite `dist-ds/`. Los dos generados están en gitignore.
- Assets: los componentes leen `components/assets.ts` al renderizar. El entry del DS los reemplaza por data URIs: logos en PNG y fotos de los fundadores recomprimidas a JPEG de 800px con ImageMagick `convert`. Hace falta `convert` en la máquina.
- `package.json` tiene `"types": "dist-ds/design-system/index.d.ts"`: el converter busca ahí la raíz del `.d.ts`. Sin ese campo sale ZERO_MATCH.
- Los tipos de props van inline (sin interfaces auxiliares ni `MouseEventHandler`). Los tipos con nombre salen sin resolver en el `<Name>.d.ts` emitido.
- Grupos: stubs de `docsMap` en `.design-sync/groups/*.md`. Usar categorías ASCII, porque "Básicos" se convirtió en el slug `b-sicos`.
- Provider: `Page` con `{fill:false}`. Sin `.page`, el texto hereda negro.
- Las fotos de stock NO se embeben (el usuario las excluyó). Los previews de FeatureCard e ImageCard usan URLs remotas de images.unsplash.com con los mismos IDs.
- El preview de Loader usa un contenedor con `transform` (para encerrar el `position:fixed`) y `animation-delay:-5s` (para mostrar el estado final). El de Aura simula un `pointermove`.
- Playwright 1.63 coincide con `chromium_headless_shell-1243` en la cache.

## Avisos de render conocidos
- Ninguno pendiente. El GRID_OVERFLOW de Logo se resolvió con `cardMode: column`.

## Riesgos al re-sincronizar
- `globals.css` es la fuente de todos los estilos del DS. Una clase nueva o renombrada en el sitio cambia los previews, y hay que re-verificar.
- Las fuentes vienen por @import remoto de Google Fonts (FONT_REMOTE). No hay woff2 locales.
- Los previews de FeatureCard e ImageCard dependen de la red (Unsplash).
- Si cambian las fotos de los fundadores o los logos en `public/assets`, hay que correr `npm run build:ds` antes del converter.
- El texto por defecto de los componentes (copy, correo, WhatsApp) está hardcodeado en `components/`. Si el sitio cambia de copy, el DS también cambia.

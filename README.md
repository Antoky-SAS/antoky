# Antoky — sitio web

Landing de una página. Next.js 16 (App Router) con export estático (`out/`).
Fuente de verdad del diseño: `design/Antoky v2.dc.html` (+ `design/README.md`, `design/screenshots/`).

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # genera out/ (HTML estático, se publica en cualquier hosting)
npm start       # sirve out/
```

## Variables de entorno (opcionales)
- `NEXT_PUBLIC_FORM_ENDPOINT`: URL que recibe el formulario de contacto como JSON (p. ej. Formspree).
  Sin definir, el envío se simula como en el prototipo.
- `NEXT_PUBLIC_SITE_URL`: URL pública, para las etiquetas Open Graph (por defecto `https://antoky.com`).

## Estructura
- `app/page.tsx`: secciones (hero, cinta, productos, proceso, nosotros, contacto, footer).
- `app/globals.css`: todos los estilos, copiados literalmente del prototipo.
- `components/`: partes interactivas (loader, aura del cursor, header + menú móvil + scroll spy, formulario, logo del footer).
- `public/assets/`: logos, fotos de los fundadores e imágenes de stock.

## Pendientes (del handoff)
- Reemplazar las imágenes de stock por material real.
- Validar las bios de los cofounders.
- Definir `NEXT_PUBLIC_FORM_ENDPOINT` con el servicio de formularios elegido.

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
- `RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO`: envío de correos del formulario (`/api/contacto`).
- `KV_REST_API_URL` + `KV_REST_API_TOKEN` (o `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`): Upstash Redis
  para limitar envíos del formulario. Se crean al instalar Upstash desde el Vercel Marketplace
  (`vercel integration add upstash`, luego `vercel env pull .env.local`). Sin ellas no hay límite.

## Seguridad del formulario de contacto
Reglas en `lib/contacto.ts` (compartidas cliente/servidor) y `lib/ratelimit.ts`:
- Límites: nombre 80, correo 120, teléfono 20, mensaje 1000 caracteres. El servidor rechaza (400) lo que los supere.
- Teléfono: solo dígitos, espacios, guiones y `+` inicial (el campo filtra letras al escribir o pegar).
- Anti-bots: honeypot `empresa_web` y tiempo mínimo de 3 s entre abrir y enviar (respuesta OK silenciosa).
- Límite de envíos: 3 cada 10 min y 10 al día por IP; 5 al día por correo (429 con `Retry-After`).
- Solo JSON (415), cuerpo máx. 10 KB (413), `Origin` debe ser el propio sitio (403).

## Rendimiento
- `npm run images`: genera los `.webp` redimensionados de `public/assets/` desde los PNG/JPG originales
  (`scripts/optimize-images.mjs`). Correrlo al cambiar o agregar imágenes; el sitio usa los `.webp`.
- La aurora de fondo dibuja en un Web Worker (`components/aurora.worker.ts` + `aurora-core.ts`).
  `predev`/`prebuild` lo transpilan a `public/aurora/` (`scripts/build-worker.mjs`, salida ignorada por git).
- La fuente (Bricolage Grotesque, archivo latin de Google Fonts) está self-hosted en `app/fonts/` vía `next/font/local`.

## Estructura
- `app/page.tsx`: secciones (hero, cinta, productos, proceso, nosotros, contacto, footer).
- `app/globals.css`: todos los estilos, copiados literalmente del prototipo.
- `components/`: partes interactivas (loader, aura del cursor, header + menú móvil + scroll spy, formulario, logo del footer).
- `public/assets/`: logos, fotos de los fundadores e imágenes de stock.

## Pendientes (del handoff)
- Reemplazar las imágenes de stock por material real.
- Validar las bios de los cofounders.
- Definir `NEXT_PUBLIC_FORM_ENDPOINT` con el servicio de formularios elegido.

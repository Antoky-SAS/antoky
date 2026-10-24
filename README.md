# Antoky — sitio web

Landing de una página. Next.js 16 (App Router) con export estático (`out/`).
Fuente de verdad del diseño: `Antoky Home v8.dc.html` en claude.ai/design (proyecto f4b66606-76f4-40ed-b062-44bb0957493d).
`design/` guarda la versión anterior (v2), que es la que documenta el sistema de diseño (`design-system/`).

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
- Campos: nombre (80), empresa (120), correo o WhatsApp (120; correo válido, o 7 a 15 dígitos) y problema (1000, obligatorio). El servidor rechaza (400) lo que no cumpla.
  Si el contacto es un correo, se usa como Reply-To.
- Anti-bots: honeypot `empresa_web` y tiempo mínimo de 3 s entre abrir y enviar (respuesta OK silenciosa).
- Límite de envíos: 3 cada 10 min y 10 al día por IP; 5 al día por contacto (correo o dígitos del teléfono) (429 con `Retry-After`).
- Solo JSON (415), cuerpo máx. 10 KB (413), `Origin` debe ser el propio sitio (403).

## Rendimiento
- `npm run images`: genera los `.webp` redimensionados de `public/assets/` desde los PNG/JPG originales
  (`scripts/optimize-images.mjs`). Correrlo al cambiar o agregar imágenes; el sitio usa los `.webp`.
- Fuentes (Schibsted Grotesk, Instrument Serif, Geist Mono) vía `next/font/google`: se descargan en el build y se sirven desde el sitio.

## Estructura
- `app/page.tsx`: secciones (hero, qué solucionamos, antes/después, resultados, demostraciones + nosotros, cómo trabajamos, contacto, footer).
- `app/home.css`: estilos del sitio, copiados del diseño v8.
- `app/globals.css`, `app/tokens.css` y el resto de `components/`: solo para el bundle del sistema de diseño (v2).
- Partes interactivas: `HeroOrb` + `orb.ts` (esfera three.js del hero), `PageEffects` (efectos de scroll: bola del hero, tarjetas apiladas, carril de demostraciones, inclinación 3D, aparición), `ContactForm` + `EnvioCarro` (animación de envío).
- `public/assets/`: logos, fotos de los fundadores; `public/assets/flujo/`: ilustraciones antes/después (PNG fuente → `npm run images`).
  `public/assets/cinta/` y `stock/` ya no los usa nada (se pueden borrar).

## Pendientes (del handoff)
- Reemplazar las imágenes de stock por material real.
- Validar las bios de los cofounders.
- Definir `NEXT_PUBLIC_FORM_ENDPOINT` con el servicio de formularios elegido.

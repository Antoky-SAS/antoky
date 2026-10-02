# Handoff: Sitio web Antoky (landing de una página)

> ## ⚠ FUENTE DE VERDAD: `Antoky v2.dc.html`
> El archivo `Antoky v2.dc.html` de esta carpeta es la **única fuente de verdad** del diseño. Todo valor (color, tamaño, espaciado, texto, duración, easing, breakpoint) debe tomarse **literalmente de ese archivo**.
> - Si este README y el HTML difieren, **gana el HTML**.
> - Si algo no está descrito aquí, **búscalo en el HTML**; no lo inventes ni lo "mejores".
> - Las capturas de `screenshots/` sirven solo para comparar visualmente; ante cualquier diferencia, **gana el HTML**.
> - Al terminar cada sección, abre el prototipo y tu implementación lado a lado en 1440px, 1024px, 768px y 390px, y corrige hasta que sean idénticos.
>
> **Cómo leer el HTML:** la maquetación está en el bloque `<x-dc>…</x-dc>`, con todos los estilos inline. Los `style-hover` / `style-focus` son los estados `:hover` / `:focus`. Los `{{ nombre }}` son valores que se calculan en `renderVals()`, dentro de la clase `Component` (en el `<script data-dc-script>` al final del archivo). Ahí están el loader, el aura, el marquee, la galería, el menú móvil, los cofounders y el scroll spy, con sus estilos exactos. `<sc-if>` es un render condicional y `<sc-for>` es un bucle.
>
> ## 🆕 Cambios de esta versión (actualización 2)
> Si el sitio ya está implementado, aplique **solo** estos cambios. Los valores exactos están en `Antoky v2.dc.html` (gana el HTML). Las capturas de `screenshots/` son de la versión anterior.
>
> 1. **Tipografía:** toda la página (títulos y cuerpo) pasa de Montserrat/Inter a **Bricolage Grotesque** (Google Fonts: `family=Bricolage+Grotesque:opsz,wght@12..96,300..800`). Pesos y tamaños se mantienen.
> 2. **Aura del cursor:** se elimina el halo amarillo que seguía al puntero. **Solo queda el anillo del clic**: círculo de 90px con borde de 2px `#FFD600`, que anima `scale(0.2)→1.6` y `opacity 0.9→0` en 650ms con `cubic-bezier(.2,.7,.2,1)`.
> 3. **Aurora de fondo (nueva):** canvas detrás de todo el contenido (`z-index:-1` dentro de una raíz con `position:relative; isolation:isolate`). Va **anclado al documento**, no fijo en la pantalla, para que no salte al hacer scroll. Se divide en tiles de 640px y solo se redibujan los visibles. Ver `auroraBuild()`, `drawAurora()` y `drawRegion()` en el HTML.
>    - 5 cintas color lima (`rgb(212,255,58)` y núcleo `rgb(238,255,175)`). Cada una tiene 15 líneas finas en escritorio y 11 en móvil, y la cinta secundaria 8 y 6. Siguen un spline Catmull-Rom con ondulación senoidal y suavizado; los puntos de control están en fracciones del ancho y del alto del documento.
>    - La cinta se torsiona: su ancho varía a lo largo del recorrido.
>    - La luz corre por las líneas con `setLineDash` animado.
>    - 320 chispas que titilan (160 en móvil).
>    - Halo: una copia a 1/4 de resolución con `blur(5px)`, sumada con `lighter` al 60%.
>    - Intensidad 10/10 y velocidad ×1.3 (valores por defecto). En móvil va a 30fps. Con `prefers-reduced-motion` queda estática.
>    - Las secciones oscuras pasan a `background:transparent` para dejar ver la aurora. El negro `#0B0B0B` lo pone la raíz.
> 4. **Productos ahora es oscuro:** fondo transparente sobre negro, texto `#F5F5F5` y eyebrow `#9AA0A6`.
> 5. **Tarjetas translúcidas (glass):** las de Productos y Cómo trabajamos usan `background:rgba(18,20,23,0.55); backdrop-filter:blur(14px); border:1px solid rgba(255,255,255,0.07)`. Los chips usan `rgba(22,24,27,0.7)`. **No llevan ningún borde amarillo ni lima.**
> 6. **Inclinación 3D en tarjetas (`[data-tilt]`):** aplica a MySlotfy, TalentoYa, Software educativo, las dos tarjetas con foto, las 4 de Cómo trabajamos y los retratos de los fundadores. Ver `initTilt()`.
>    - **Inclinación:** máximo **20°** según la posición del cursor. Software educativo usa 0.4× por ser ancha.
>    - **Transform:** `perspective(1000px) translateY(-lift) rotateX rotateY scale(1.025)`.
>    - **Reflejo:** `radial-gradient` blanco que sigue al cursor, con `mix-blend-mode:screen`.
>    - **Profundidad:** los hijos con `data-depth` se desplazan en paralaje (`translate = -rotY·depth·0.9, rotX·depth·0.9`). Imágenes en negativo y texto en positivo; las `<img>` llevan además `scale(1.07)`.
>    - **Retorno:** resorte con rebote elástico (rigidez 150, amortiguación 9). En hover usa rigidez 260 y amortiguación 24.
>    - **Restricciones:** solo en escritorio con puntero fino (`(hover:hover) and (pointer:fine)` y ancho ≥860px). Sin borde de color.
> 7. **Loader:** se corrige el recorte del isotipo para que la pieza amarilla no arrastre parte de la A blanca:
>    - Pieza A: `clip-path: polygon(0 0,100% 0,100% 100%,60% 100%,53% 40%,0 40%)`.
>    - Pieza Y: `clip-path: polygon(27.5% 42.5%,52% 42.5%,24.3% 100%,0 100%)`.
> 8. **Nosotros:** ambos fundadores pasan a **"CoFounder"** (sin "- CEO").
> 9. **Footer:** sin cambios (se mantiene el brillo iridiscente original).
> 10. **No implementar:** el isotipo 3D saltarín (`initHopper`, `showHopper:false`). Está apagado en el diseño.
>
> **Prompt sugerido para actualizar:** *"Lee `design_handoff_antoky_web/README.md`, sección 'Cambios de esta versión (actualización 2)', y aplica al sitio existente solo esos 10 puntos. Replica literalmente los valores, la lógica de la aurora (auroraBuild/drawAurora/drawRegion) y la de la inclinación 3D (initTilt) desde `design_handoff_antoky_web/Antoky v2.dc.html`, que es la fuente de verdad. Implementa la aurora y la inclinación como componentes cliente aislados (por ejemplo `<AuroraBackground />` y un hook `useTilt`) que limpien sus listeners y requestAnimationFrame al desmontarse. Abre el prototipo con `npx serve design_handoff_antoky_web` y compáralo con tu implementación en 1440, 1024, 768 y 390px."*
>
> **Prompt sugerido para Claude Code (desde cero):** *"Implementa el sitio de Antoky replicando exactamente `design_handoff_antoky_web/Antoky v2.dc.html`, que es la fuente de verdad. Lee primero el README y luego el HTML completo. Copia literalmente todos los valores de estilo, textos, animaciones y breakpoints. Usa las imágenes de `assets/`. Compara con `screenshots/` y con el prototipo abierto en el navegador hasta que sean idénticos."*

## Overview
Sitio institucional de **Antoky**, empresa colombiana de software SaaS y desarrollo a la medida. Objetivo: presentar la marca y generar confianza en empresas, microempresas y colegios, y captar contactos mediante un formulario. Idioma: español (trato de "usted").

## About the Design Files
`Antoky v2.dc.html` es la **fuente de verdad**: una referencia de diseño hecha en HTML (prototipo que muestra el aspecto y el comportamiento), no código de producción. La tarea es **recrearla** en el entorno del proyecto destino usando sus patrones. Si no hay proyecto, se recomienda **Next.js (App Router) + React + Tailwind CSS** (o CSS Modules), con despliegue estático. Para abrir el prototipo, sirve la carpeta con un servidor local (`npx serve .`) y abre `Antoky v2.dc.html`. `support.js` es solo el runtime del prototipo; no lo porte.

## Fidelity
**High-fidelity.** Colores, tipografía, espaciados, textos e interacciones son finales. Recrear pixel-perfect.

## Estructura global
- Página única con scroll suave (`html{scroll-behavior:smooth}`); anclas `#inicio`, `#proyectos`, `#proceso`, `#nosotros`, `#contacto`.
- Contenedor: `max-width:1140px; margin:0 auto; padding-inline: clamp(20px,4vw,32px)`.
- Fondo general `#0B0B0B`, texto `#F5F5F5`, fuente **Bricolage Grotesque** en títulos y cuerpo (ver actualización 2).
- Breakpoint principal: **860px** (por debajo = móvil: menú hamburguesa, pastillas del hero separadas).
- Etiqueta de sección ("01 — Productos", etc.): Montserrat 12px/500, `letter-spacing:0.3em`, mayúsculas, color `#9AA0A6` (sobre claro `#686F76`).

Orden: Loader → Header → Hero → Cinta deslizante → Productos → Cómo trabajamos → Nosotros → Contacto → Footer.

## Screens / Views

### 1. Loader (pantalla de carga)
- Overlay `position:fixed; inset:0; z-index:100; background:#0B0B0B`, contenido centrado en columna, gap 28px.
- El isotipo (`antoky-isotipo-blanco.png`, relación 837/526, ancho `min(34vw,150px)`) se arma con dos capas de la misma imagen recortadas con `clip-path`:
  - Pieza "A" (`polygon(0 0,100% 0,100% 100%,56% 100%,56% 36%,0 36%)`): entra desde `translate(40px,-60px)`, opacidad 0→1, 0.7s, delay 0.15s.
  - Pieza "Y" (`polygon(0 36%,56% 36%,56% 100%,0 100%)`): entra desde `translate(-70px,50px)`, 0.7s, delay 0.55s. Easing `cubic-bezier(.2,.8,.2,1)`.
- Wordmark (`antoky-logo-blanco.png`, ancho `min(62vw,280px)`): se revela con `clip-path: inset(0 100% 0 0) → inset(0)`, 0.9s, delay 1.05s, `cubic-bezier(.7,0,.2,1)`.
- Barra de progreso: 2px de alto, fondo `#1C1F23`, relleno `#FFD600` con `scaleX 0→1` en 2.1s (`cubic-bezier(.6,0,.3,1)`).
- Salida: cuando pasan ≥2.3s **y** se disparó `window.load`, el contenido baja su opacidad y sube 30px, y el overlay se recoge hacia arriba (`clip-path: inset(0 0 0 0) → inset(0 0 100% 0)`, 0.9s). Se desmonta 900ms después.

### 2. Header (sticky)
- `position:sticky; top:0; z-index:20; background:rgba(11,11,11,0.82); backdrop-filter:blur(12px)`; padding vertical 16px.
- Izquierda: logo blanco, 24px de alto, enlace a `#inicio`.
- **Desktop**: nav Montserrat 14px/500, gap 32px. Enlaces: "Productos" (#proyectos), "Cómo trabajamos" (#proceso), "Nosotros" (#nosotros). Color `#D9DDE1`; activo/hover `#FFD600` (transición 0.3s).
  - **Indicador activo**: barra de 2px `#FFD600` (radio 2px) bajo el enlace activo, que se desliza entre enlaces animando `transform: translateX` y `width` (0.45s `cubic-bezier(.65,0,.35,1)`); opacidad 0 si no hay sección activa.
  - Botón "Hablemos →" (#contacto): fondo `#FFD600`, texto `#0B0B0B`, padding 12px 22px, pill (999px), weight 600.
- **Móvil (<860px)**: botón hamburguesa 44×44, radio 12px, borde `1px #2A2E33`, fondo `#16181B`; tres líneas de 18×2px `#F5F5F5` separadas 5px. Al abrir: la 1.ª `translateY(7px) rotate(45deg)`, la 2.ª opacidad 0, la 3.ª `translateY(-7px) rotate(-45deg)` (0.3s).

### 3. Menú móvil full-screen
- `position:fixed; inset:0; z-index:15; background:#0B0B0B`. Se abre en círculo desde el botón: `clip-path: circle(0px at calc(100% - 42px) 38px) → circle(150% at …)`, 0.7s `cubic-bezier(.7,0,.2,1)`. Bloquea el scroll del body mientras está abierto.
- Decoración: paralelogramo amarillo `#FFD600` opacidad 0.9, arriba a la derecha (`top:-10%; right:-30%; 70%×60%; clip-path:polygon(60% 0,100% 0,40% 100%,0 100%)`).
- Etiqueta "Menú", luego los enlaces grandes: Montserrat `clamp(34px,10vw,48px)`/700, `letter-spacing:-0.03em`, padding 12px 0, borde inferior `1px #1C1F23`, con número "01/02/03" delante (13px, `#686F76`, ancho 28px). Entrada escalonada: opacidad + `translateY(30px→0)`, delay `0.15s + i·0.07s`. El enlace activo en `#FFD600`.
- Pie: botón "Hablemos →" a todo el ancho (pill, 18px 22px, 16px/600) y la fila "Ceau922@gmail.com" · "Colombia" (14px, `#9AA0A6`). Aparece con delay de 0.45s. Al tocar cualquier enlace, el menú se cierra.

### 4. Hero (#inicio)
- Padding vertical: arriba `clamp(64px,10vw,120px)`, abajo `clamp(72px,10vw,130px)`.
- Fondo decorativo: patrón de puntos en el 58% derecho (`radial-gradient(circle,#2A2E33 3.2px,transparent 3.6px)`, tamaño 18px), con máscara que se desvanece hacia la izquierda (`linear-gradient(90deg,transparent 0%,#000 45%)`), opacidad 0.9.
- Etiquetas:
  - Desktop: una sola pastilla (borde `1px #2A2E33`, fondo `#16181B`, pill, padding 7px 14px, 14px, texto `#FFD600`): "SaaS | Desarrollo a la medida | Empresas · Microempresas · Colegios" (separadores `|` en `#3A3F45`).
  - Móvil: cinco pastillas separadas (13px, padding 7px 13px, gap 8px): SaaS, Desarrollo a la medida, Empresas, Microempresas, Colegios.
- H1: Montserrat `clamp(40px,5.4vw,68px)`/700, line-height 1.08, `letter-spacing:-0.035em`, max-width 720px. Texto en tres líneas: "Soluciones tecnológicas" / "para un futuro más humano" (en `#FFD600`) / "desde Colombia".
- Subtítulo: Montserrat `clamp(18px,1.8vw,24px)`/500, `#D9DDE1`, max-width 620px: "Tecnología con compromiso y visión de futuro".
- CTAs (gap 18px): "Hablemos" (amarillo) y "Ver soluciones" (fondo `#F5F5F5`, a #proyectos). Radio 6px, padding 12px 18px, Montserrat 16px/600.

### 5. Cinta deslizante (marquee)
- Borde inferior `1px #1C1F23`, padding 22px 0. Palabras repetidas: Innovación, Estrategia, Personas, Resultados, SaaS, Desarrollo a la medida. Montserrat 22px/700, mayúsculas, `letter-spacing:0.02em`, gap 40px, cada una seguida de un paralelogramo `#FFD600` de 22×12 con `skewX(-32deg)`.
- Animación: `translateX(0 → -50%)` lineal infinita en 40s (el contenido se duplica para que el loop no tenga cortes).

### 6. Productos (#proyectos) — fondo claro `#F5F5F5`, texto `#0B0B0B`
- Padding `clamp(64px,8vw,96px)` arriba, `clamp(72px,9vw,112px)` abajo; columna con gap 20px.
- **Orden:** etiqueta "01 — Productos" → fila de productos propios (MySlotfy, TalentoYa) → card "Software educativo" → fila de servicios (a la medida, app móvil).
- **Productos propios (nuevo)** — grid `repeat(auto-fit,minmax(min(100%,420px),1fr))`, gap 20px. Cada tarjeta: fondo `#0B0B0B`, texto `#F5F5F5`, radio 20px, `overflow:hidden`, columna.
  - Captura arriba: contenedor `aspect-ratio:16/10`, fondo `#16181B`, borde inferior `1px #23262A`; imagen `object-fit:cover` a sangre.
  - Cuerpo (padding `clamp(24px,3vw,36px)`, gap 14px, `flex:1`): etiqueta pill (13px, `#FFD600`, borde `#2A2E33`, fondo `#16181B`, padding 6px 12px); H3 Montserrat `clamp(26px,2.6vw,34px)`/700, `-0.02em`; párrafo 16px/1.6 `#D9DDE1`; fila de botones (gap 12px, `margin-top:auto`, padding-top 10px) alineada abajo para que ambas tarjetas coincidan.
  - Botón 1 "Visitar sitio ↗": amarillo, padding 12px 18px, radio 6px, 15px/600, abre en pestaña nueva (`target="_blank" rel="noopener"`). Hover como los demás amarillos.
  - Botón 2 "Solicitar demo" → #contacto: transparente, texto `#F5F5F5`, borde `1px #3A3F45`, padding 11px 18px. Hover: fondo y borde `#F5F5F5`, texto `#0B0B0B`, `translateY(-3px)`.
  - **MySlotfy** — `assets/myslotfy.png` — etiqueta "Producto propio · Agendamiento" — "Agendamiento de citas en línea para pequeños negocios en Colombia. Sus clientes reservan solos y usted organiza su agenda desde un solo lugar." — enlace `https://www.myslotfy.com/`.
  - **TalentoYa** — `assets/talentoya.png` — etiqueta "Producto propio · Talento humano" — "Plataforma para gestionar el talento humano de su empresa: colaboradores, procesos y documentos organizados en un solo sistema." — enlace `https://www.talentoya.com.co/`.
- **Card grande "Software educativo"**: fondo `#0B0B0B`, radio 20px, min-height 420px, grid `repeat(auto-fit,minmax(min(100%,420px),1fr))`.
  - Columna de texto (padding `clamp(28px,4vw,48px)`, gap 18px): chips (13px, `#FFD600`, borde `#2A2E33`, fondo `#16181B`, padding 6px 12px): Notas y boletines, Matrículas, Asistencia, Comunicación con padres. H2 Montserrat `clamp(26px,2.6vw,34px)`/700 "Software educativo". Párrafo 16px/1.6 `#D9DDE1`, max 460px: "Una plataforma en la nube para gestionar la vida académica de su colegio: directivos, docentes y familias conectados en un solo lugar." Viñetas (14px) con un paralelogramo amarillo de 10×10 (`clip-path:polygon(40% 0,100% 0,60% 100%,0 100%)`): SaaS, Web y móvil, Soporte incluido. Botón amarillo "Obtener software educativo" (15px).
  - Columna de galería (min-height 340px): dos filas de imágenes de 220×150 (radio 12px, gap 14px) que se deslizan en sentidos opuestos (38s hacia la izquierda, 46s en reversa). Un degradado de `#0B0B0B` a transparente cubre el 30% izquierdo.
- **Dos cards abajo** (mismo grid, gap 20px): radio 20px, min-height 420px, imagen de fondo con `object-fit:cover` y degradado `rgba(11,11,11,0) 30% → rgba(11,11,11,0.92) 100%`. Contenido abajo (padding 28px, gap 12px): H3 Montserrat 26px/700, párrafo 16px `#D9DDE1`, botón claro (`#F5F5F5`, padding 10px 16px).
  - "Software a la medida" — "Aplicaciones web e integraciones diseñadas para sus procesos." — "Obtener software a la medida".
  - "Aplicación móvil" — "Apps para iOS y Android que acercan su servicio a sus clientes." — "Obtener aplicación móvil".
- Todos los botones llevan a #contacto, salvo "Visitar sitio ↗" (web externa del producto).

### 7. Cómo trabajamos (#proceso)
- Padding `clamp(72px,10vw,128px)`. H2 Montserrat `clamp(38px,5vw,68px)`/700, lh 1.02, `-0.035em`, max 860px, margen inferior 72px: "De la primera reunión a la entrega, **sin sorpresas.**" (la última parte en `#FFD600`).
- 4 tarjetas: 4 columnas en desktop, 2 en tablet (<~928px) y 1 en móvil (<~456px); gap 16px. Tarjeta: fondo `#16181B`, borde `1px #23262A`, radio 24px, padding 36px, min-height 320px, columna gap 18px. Número Montserrat 64px/700 `#FFD600`; título 22px/600 empujado hacia abajo (`margin-top:auto`); texto 15px/1.6 `#9AA0A6`.
  1. Diagnóstico — "Entendemos su organización, sus procesos y lo que necesita resolver."
  2. Estrategia — "Definimos alcance, tiempos y costos por escrito."
  3. Desarrollo — "Construimos por etapas y le mostramos avances reales en cada una."
  4. Resultados y soporte (tarjeta **amarilla** `#FFD600`, texto `#0B0B0B`, párrafo `#2A2E33`) — "Capacitamos a su equipo y seguimos acompañándolo después del lanzamiento."

### 8. Nosotros (#nosotros)
- Grid `repeat(auto-fit,minmax(min(100%,460px),1fr))`, gap 72px.
- Izquierda: H2 "Personas en el centro." (mismo estilo que el H2 de proceso); párrafo 18px/1.7 `#D9DDE1`, max 500px: "Antoky nace de dos fundadores colombianos convencidos de que la buena tecnología no debe ser exclusiva de las grandes empresas. Trabajamos directamente con cada cliente, sin intermediarios." Lista vertical Montserrat 13px/500, `0.3em`, mayúsculas: Innovación, Estrategia, Personas, **Resultados** (en `#FFD600`).
- Derecha: 2 cards de CoFounder (grid `minmax(min(100%,230px),1fr)`, gap 20px).
  - Foto: `aspect-ratio:4/5`, radio 24px, borde `1px #23262A`, `object-fit:cover`. En la esquina inferior derecha, un paralelogramo `#FFD600` (40%×60%, `bottom:-20%; right:-20%; skewX(-32deg)`).
  - **Hover**: la foto escala a 1.04 (0.5s) y aparece (opacidad 0→1, 0.35s) un overlay `linear-gradient(180deg, rgba(11,11,11,0.35) 0%, rgba(11,11,11,0.92) 60%)` con una línea amarilla de 32×3 y la bio (15px/1.6), padding 24px, alineada abajo.
  - Debajo de la foto: nombre Montserrat 20px/700; cargo 14px `#9AA0A6`.
  - **Carlos Arias** — CoFounder - CEO — `carlos-arias-v2.png` — "Lidera la estrategia comercial y la relación con clientes. Se asegura de que cada solución responda a una necesidad real del negocio."
  - **Sebastián Valle** — CoFounder - CEO — `sebastian-valle-v2.png` — "Dirige la arquitectura y el desarrollo de producto. Convierte procesos complejos en software claro, seguro y escalable."
  - Las bios están pendientes de validación final por el cliente.

### 9. Contacto (#contacto)
- La sección tiene padding lateral/inferior `clamp(12px,3vw,32px)`. Bloque interior: fondo `#FFD600`, texto `#0B0B0B`, radio 32px, padding `clamp(28px,5vw,64px)`, grid `minmax(min(100%,360px),1fr)`, gap `clamp(32px,4vw,56px)`.
- Izquierda: H2 Montserrat `clamp(34px,4vw,54px)`/700 "Construyamos el futuro juntos."; párrafo 18px `#2A2E33`: "Cuéntenos qué necesita. Respondemos en menos de un día hábil y la primera reunión es sin costo." Tabla de datos (15px, filas con padding 16px 0 y separadores `1px rgba(11,11,11,0.25)`):
  - Correo → `mailto:Ceau922@gmail.com`
  - WhatsApp → `+57 313 7264497` (enlace `https://wa.me/573137264497`)
  - Ubicación → Colombia
- Derecha: tarjeta del formulario (fondo `#0B0B0B`, radio 24px, padding `clamp(24px,3vw,36px)`). Campos (etiqueta 13px `#D9DDE1`, gap 8px; input con fondo `#16181B`, borde `1px #2A2E33`, radio 14px, padding 15px 18px, 15px; al enfocar, borde `#FFD600`):
  - Nombre* ("Su nombre"), Correo electrónico* (email, "nombre@empresa.com"), Teléfono de contacto* (tel, "+57 300 000 0000"), Tipo de organización (select: Empresa, Microempresa, Colegio, Otro; con chevron SVG personalizado), Mensaje (textarea de 4 filas, "Cuéntenos brevemente su proyecto").
  - Botón "Enviar mensaje →": amarillo, pill, padding 18px 24px.
  - **Estado de éxito** (reemplaza el formulario, min-height 440px): círculo amarillo de 48px con ✓, "Mensaje recibido." (30px/700), "Gracias, {primer nombre}. Le escribiremos muy pronto." y un botón con borde "Enviar otro mensaje" que vuelve a mostrar el formulario.

### 10. Footer
- Padding `clamp(48px,7vw,72px)` arriba, 32px abajo.
- Logo blanco a **todo el ancho** del contenedor. **Aura dentro de las letras** en hover: una capa encima enmascarada con el propio logo (`mask-image: url(logo)`, `mask-size:100% 100%`) con `radial-gradient(circle 130px at var(--x) var(--y), #FF2BD6 0%, #7A5CFF 28%, #00E5FF 52%, #00FFA3 68%, transparent 82%)` que sigue al cursor (se actualizan `--x/--y` en mousemove), con `hue-rotate` 0→360° en bucle de 3s. Opacidad 0→1 en 0.4s. Mientras está activa, el aura amarilla global baja a opacidad 0.25.
- Fila inferior (margen superior 40px, borde superior `1px #1C1F23`, 13px `#9AA0A6`): "Tecnología con compromiso y visión de futuro" (Montserrat 12px, `0.2em`, mayúsculas) · "© 2026 Antoky · Colombia".

## Interactions & Behavior
- **Aura del cursor** (solo con puntero fino; se desactiva con `pointer: coarse`): círculo fijo de 420px con `radial-gradient(rgba(255,214,0,0.16) 0%, rgba(255,214,0,0.06) 35%, transparent 70%)` y `mix-blend-mode:screen`, `pointer-events:none`, z-index 50. Sigue al cursor con suavizado (lerp 0.14 por frame vía requestAnimationFrame). Se oculta cuando el puntero sale de la ventana.
- **Click**: un anillo de 90px con borde `2px #FFD600` escala de 0.2 a 1.6 y se desvanece en 650ms (`cubic-bezier(.2,.7,.2,1)`), en la posición del cursor.
- **Hover de botones** (todos los CTA): transición 0.25s de background/color/transform/box-shadow. Los botones amarillos pasan a `#F5F5F5` y los claros a `#FFD600`; todos suben 3px (`translateY(-3px)`) con `box-shadow: 0 12px 28px -6px rgba(255,214,0,0.55)`.
- **Scroll spy**: la sección activa es la última (entre proyectos, proceso, nosotros, contacto) cuyo borde superior quedó por encima del 35% de la altura de la ventana. Se recalcula al hacer scroll y al redimensionar la ventana.
- Enlaces por defecto: `#FFD600`, hover `#FFE34D`, sin subrayado.
- Formulario: validación HTML5 nativa (`required`, `type=email`). En el prototipo el envío es simulado; **en producción conectar a un backend o servicio** (API route + email, Formspree, Resend, etc.) con estado de carga y de error.

## State Management
- `active`: id de la sección activa (scroll spy) → controla el color y el indicador del nav.
- `menu`: menú móvil abierto o cerrado; se cierra solo si la ventana pasa a ≥860px.
- `vw`: ancho del viewport, para el breakpoint de 860px (puede sustituirse por CSS/media queries).
- `hoverF`: índice del cofounder en hover (se puede hacer solo con CSS `:hover`).
- `loading` / `loaderGone`: fases del loader.
- `enviado`, `nombre`: estado de éxito del formulario.
- Flags opcionales del prototipo (hoy todos en true): `showMarquee`, `showAura`, `showLoader`.

## Design Tokens
**Colores**
- Amarillo acento `#FFD600` (hover de enlaces `#FFE34D`). Nota: el brief original pedía `#F2B705`; el diseño aprobado usa `#FFD600`.
- Negro fondo `#0B0B0B` · Superficie `#16181B` · Bordes `#1C1F23`, `#23262A`, `#2A2E33`, `#3A3F45`
- Blanco `#F5F5F5` · Texto secundario `#D9DDE1` · Muted `#9AA0A6` · Muted sobre claro `#686F76` · Texto sobre amarillo `#2A2E33`
- Aura del footer: `#FF2BD6`, `#7A5CFF`, `#00E5FF`, `#00FFA3`

**Tipografía** (Google Fonts): Montserrat 300–800 para títulos, nav y botones; Inter 400/500 para el cuerpo.
- H1 `clamp(40px,5.4vw,68px)` · H2 de sección `clamp(38px,5vw,68px)` · H2 de contacto `clamp(34px,4vw,54px)` · H2 de card `clamp(26px,2.6vw,34px)` · H3 26px / 22px · Cuerpo 15–18px · Etiquetas 12–14px
- Tracking de títulos entre -0.02em y -0.035em; etiquetas en mayúsculas con 0.2–0.3em.

**Radios**: 6px (botones del hero/cards), 12px (thumbnails, hamburguesa), 14px (inputs), 20px (cards de producto), 24px (tarjetas de proceso, fotos, formulario), 32px (bloque de contacto), 999px (pills).

**Sombras**: solo la de hover de botones: `0 12px 28px -6px rgba(255,214,0,0.55)`.

**Motivo gráfico**: paralelogramo inclinado (`skewX(-32deg)` o `clip-path` equivalente), tomado del isotipo.

## Assets
- `assets/antoky-logo-blanco.png`, `antoky-logo-negro.png`: wordmark de la marca.
- `assets/antoky-isotipo-blanco.png`, `antoky-isotipo-negro.png`: isotipo (usado en el loader).
- `assets/carlos-arias-v2.png`, `assets/sebastian-valle-v2.png`: fotos reales de los fundadores.
- `assets/myslotfy.png`, `assets/talentoya.png`: capturas de los productos propios (1672×941).
- `assets/stock/*.jpg`: imágenes de stock de Unsplash, ya descargadas para uso local (pendientes de reemplazar por capturas o fotos reales de proyectos). Los nombres de archivo corresponden a estos IDs:
  - Galería educativa: IDs `photo-1509062522246-3755977927d7`, `photo-1503676260728-1c00da094a0b`, `photo-1524178232363-1fb2b075b655`, `photo-1427504494785-3a9ca7044f45`, `photo-1580582932707-520aed937b7b`, `photo-1498050108023-c5249f4df085`.
  - Software a la medida: `photo-1522071820081-009f0129c71c` · Aplicación móvil: `photo-1512941937669-90a1b58e7e9c`.
- Recomendado: exportar el logo también en SVG (mejor nitidez y mejor máscara para el aura del footer).

## Screenshots (desktop, referencia visual)
`screenshots/01-hero.png`, `02-productos.png`, `03-como-trabajamos.png`, `04-nosotros.png`, `05-cofounders.png`, `06-contacto.png`, `07-footer.png`. Muestran solo el estado inicial, sin hover ni animaciones. Para ver móvil, las interacciones y el movimiento, abre el prototipo en el navegador y ajusta el ancho de la ventana (el breakpoint está en 860px).

## Files
- `Antoky v2.dc.html`: **FUENTE DE VERDAD**. Prototipo completo (plantilla con estilos inline + lógica en la clase `Component` al final del archivo). Usa las imágenes locales de `assets/`, así que funciona sin Unsplash.
- `support.js`: runtime necesario solo para abrir el prototipo.
- `assets/`: logos y fotos.

## Pendientes
- Reemplazar las imágenes de stock por material real.
- Validar las bios de los cofounders.
- Conectar el formulario a un backend.
- Agregar SEO: `<title>`, meta description, Open Graph, favicon con el isotipo y `lang="es-CO"`.
- Pruebas finales en distintos dispositivos y navegadores, y soporte de `prefers-reduced-motion` (desactivar marquee, loader y aura).

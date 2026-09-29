# Antoky — convenciones de uso

Marca de software colombiana: fondo negro, acento amarillo, títulos Montserrat, cuerpo Inter, textos en español (trato de "usted"). Los componentes viven en `window.Antoky.*`.

## Raíz obligatoria
Envuelva siempre la composición en `<Page>`. Aporta fondo `#0B0B0B`, texto `#F5F5F5` e Inter; sin él los textos salen negros sobre blanco y los títulos pierden color. `fill={false}` si no debe ocupar todo el alto de la ventana.

```jsx
const { Page, Header, Hero, Eyebrow, SectionHeading, ProcessSteps, Footer } = window.Antoky;
<Page>
  <Header />
  <Hero />
  <section className="proceso">
    <div className="wrap sec-in">
      <Eyebrow>02 — Cómo trabajamos</Eyebrow>
      <SectionHeading highlight="sin sorpresas.">De la primera reunión a la entrega, </SectionHeading>
      <ProcessSteps />
    </div>
  </section>
  <Footer />
</Page>
```

## Estilo: clases del sitio + tokens
No hay utilidades tipo Tailwind. Para el layout propio use estas clases (definidas en `styles.css` → `_ds_bundle.css`):

| Clase | Efecto |
|---|---|
| `wrap` | contenedor centrado, máx. 1140px |
| `sec-in` | padding vertical/horizontal de sección |
| `productos` | sección **clara** (#F5F5F5, texto negro; el `Eyebrow` pasa a gris #686F76) |
| `proceso`, `nosotros` | sección negra (el `h2` de `proceso` deja 72px debajo) |
| `m` | tipografía Montserrat (títulos, botones, navegación) |
| `hl` | texto en amarillo #FFD600 |
| `cards2` | rejilla de 2 columnas para `ProductCard` o `ImageCard` |
| `contacto` + `contacto-in` | bloque amarillo redondeado (32px) de contacto |
| `form-card` | tarjeta negra que contiene `ContactForm` |
| `only-desktop` / `only-mobile` | visibilidad por debajo/encima de 860px |

Para estilos nuevos use los tokens `var(--ak-*)`: `--ak-negro`, `--ak-amarillo`, `--ak-blanco`, `--ak-superficie` (#16181B, tarjetas y campos), `--ak-borde`, `--ak-borde-fuerte`, `--ak-linea`, `--ak-gris-400` (texto secundario), `--ak-gris-200` (párrafos sobre negro), `--ak-gris-500`, `--ak-font-display`, `--ak-font-body`, radios `--ak-radio-boton` (6px), `--ak-radio-tarjeta` (20px), `--ak-radio-tarjeta-lg` (24px), `--ak-radio-bloque` (32px), `--ak-radio-pill`, y `--ak-ancho`.

## Reglas de marca
- Un solo acento: amarillo. Resalte el remate de un título (`SectionHeading highlight`, `<span>` dentro del `title` de `Hero`) y el último elemento de una serie (`ProcessSteps`, `ValueList`).
- CTA principal = `Button` (amarillo); secundario = `variant="light"`. Tamaños: `hero` en portadas, `md` en tarjetas, `pill` en navegación, `lg` en formularios.
- `Eyebrow` sigue el patrón `"NN — Nombre"` (p. ej. `01 — Productos`).
- `Logo tone="blanco"` sobre negro y `tone="negro"` sobre claro. Nunca sobre amarillo (la barra amarilla del logo desaparece).
- Fotos de fundadores reales: `<Founders />` o `founders()` (Carlos Arias y Sebastián Valle, ambos CoFounder - CEO). No invente otros miembros del equipo.
- `Loader` y `Aura` son efectos de página completa: uno por página, como mucho.

## Dónde mirar
`styles.css` (y `_ds_bundle.css`, que importa) tiene todas las clases y tokens. Cada componente tiene `components/<grupo>/<Nombre>/<Nombre>.d.ts` (props) y `.prompt.md` (uso).

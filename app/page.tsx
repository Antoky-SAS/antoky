import type { ReactNode } from "react";
import { Carousel } from "@/components/Carousel";
import { ContactForm } from "@/components/ContactForm";
import { HeroField } from "@/components/HeroField";
import { PageEffects } from "@/components/PageEffects";

// Diseño: "Antoky Home v5.dc.html" (claude.ai/design).

const Serif = ({ children }: { children: ReactNode }) => <span className="serif">{children}</span>;
const Eyebrow = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <span className={`mono eyebrow ${className}`}>{children}</span>
);
const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const NAV = [
  ["#soluciones", "Soluciones"],
  ["#sectores", "Sectores"],
  ["#portal", "Portal"],
  ["#metodo", "Cómo trabajamos"],
  ["#nosotros", "Nosotros"],
];

const PROBLEMAS = [
  { n: "01", t: "Información dispersa", d: "Tus equipos dependen de Excel, WhatsApp y sistemas desconectados para mantener la operación funcionando." },
  { n: "02", t: "Errores y reprocesos", d: "Pedidos, inventarios y registros que requieren correcciones constantes por depender de tareas manuales." },
  { n: "03", t: "Tiempo desperdiciado", d: "Personas dedicando horas a actividades repetitivas que podrían automatizarse." },
  { n: "04", t: "Poca visibilidad", d: "Información que llega tarde, está incompleta o resulta difícil de consultar cuando necesitas tomar decisiones." },
];

const BARRAS = [38, 62, 45, 80, 55, 92, 68, 74, 50, 86];

const FLUJO = [
  { icon: "1", t: "Pedido recibido", tag: "08:02" },
  { icon: "2", t: "Inventario validado", tag: "08:02" },
  { icon: "3", t: "Factura generada", tag: "08:03" },
  { icon: "✓", t: "Despacho notificado", tag: "LISTO", listo: true },
];

const ENLACES = [
  ["Pedidos", "Inventario"],
  ["Inventario", "Facturación"],
  ["Facturación", "Contabilidad"],
];

type Tono = "w" | "d" | "y";
type Caso = { tono: Tono; chip: string; t: string; img: string; alt: string };
// Fotos de Unsplash (licencia Unsplash), descargadas a public/assets/cinta/.
const CINTA_A: Caso[] = [
  { tono: "w", chip: "Lote 0412 · Registrado", t: "Agroindustria: trazabilidad por lote.", img: "trazabilidad", alt: "Lotes y sacos en bodega" },
  { tono: "d", chip: "Pedido confirmado", t: "Distribución: pedidos centralizados en un solo sistema.", img: "pedidos", alt: "Centro de distribución" },
  { tono: "w", chip: "Cosecha sincronizada", t: "Agroindustria: registro de campo sin papel.", img: "campo", alt: "Trabajador en cultivo" },
  { tono: "y", chip: "Factura emitida", t: "Comercialización: facturación automática.", img: "facturacion", alt: "Oficina administrativa" },
];
const CINTA_B: Caso[] = [
  { tono: "w", chip: "Entrega en ruta", t: "Distribución: seguimiento de entregas.", img: "entregas", alt: "Camión de reparto en ruta" },
  { tono: "y", chip: "Stock actualizado", t: "Agroindustria: inventario de bodega en tiempo real.", img: "inventario", alt: "Bodega con estanterías" },
  { tono: "w", chip: "Recordatorio enviado", t: "Comercialización: cartera y cobros al día.", img: "cartera", alt: "Tablet con gráficos de cobros" },
  { tono: "d", chip: "Reporte listo", t: "Gerencia: indicadores de operación sin consolidar a mano.", img: "indicadores", alt: "Tablero de indicadores" },
];

const DIAGNOSTICO = [
  "Identificación de cuellos de botella y tareas manuales.",
  "Evaluación de oportunidades de mejora y automatización.",
  "Análisis de herramientas, sistemas e integraciones.",
  "Priorización de iniciativas según su potencial de impacto y viabilidad.",
];

const PORTAL = [
  { t: "Entregas y accesos", d: "Accede a tus herramientas y revisa lo que construimos." },
  { t: "Avance del proyecto", d: "Consulta tareas, prioridades y próximos pasos." },
  { t: "Comentarios y soporte", d: "Comparte ideas, solicita ajustes y recibe ayuda." },
  { t: "Resultados", d: "Revisa indicadores y define nuevas mejoras." },
];

const METODO = [
  { n: "01", tag: "PUNTO DE PARTIDA", t: "Entendemos", d: "Conocemos tu empresa, sus procesos, problemas y objetivos." },
  { n: "02", tag: "HOJA DE RUTA", t: "Diagnosticamos", d: "Analizamos oportunidades y definimos una hoja de ruta priorizada." },
  { n: "03", tag: "IMPLEMENTACIÓN", t: "Construimos", d: "Diseñamos, desarrollamos e implementamos la solución acordada." },
  { n: "04", tag: "CONTINUO", t: "Evolucionamos", d: "Acompañamos su funcionamiento, medimos resultados y realizamos mejoras.", oscuro: true },
];

const FUNDADORES = [
  { name: "Carlos Arias", role: "CoFounder", img: "/assets/carlos-arias-v2.webp", bio: "Escucha los desafíos de tu empresa y acompaña la definición de soluciones alineadas con tus necesidades y objetivos." },
  { name: "Sebastián Valle", role: "CoFounder", img: "/assets/sebastian-valle-v2.webp", bio: "Lidera el diseño técnico y desarrollo de soluciones que convierten procesos empresariales complejos en herramientas prácticas y escalables." },
];

const FOOTER = [
  { titulo: "Menú", links: [["#inicio", "Inicio"], ["#soluciones", "Soluciones"], ["#sectores", "Sectores"], ["#metodo", "Cómo trabajamos"], ["#nosotros", "Nosotros"]] },
  { titulo: "Soluciones", links: [["#soluciones", "Software a medida"], ["#soluciones", "Automatización de procesos"], ["#soluciones", "Integración de sistemas"], ["#soluciones", "IA aplicada"], ["#portal", "Portal de cliente"]] },
  { titulo: "Contacto", links: [["#contacto", "Agendar diagnóstico"], ["mailto:contacto@antoky.com", "contacto@antoky.com"], ["https://wa.me/573137264497", "WhatsApp +57 313 7264497"]] },
];

function CintaFila({ casos, reversa }: { casos: Caso[]; reversa?: boolean }) {
  // Tres copias: la animación recorre la mitad del ancho y vuelve sin salto.
  const items = [...casos, ...casos, ...casos];
  return (
    <div className={`cinta-row${reversa ? " cinta-row-r" : ""}`}>
      {items.map((c, i) => (
        <div key={i} className={`caso caso-${c.tono}`} aria-hidden={i >= casos.length || undefined}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/assets/cinta/${c.img}.webp`} alt={i < casos.length ? c.alt : ""} loading="lazy" decoding="async" width={300} height={280} />
          <div className="caso-shade" />
          <span className="mono caso-chip">{c.chip}</span>
          <span className="caso-t">{c.t}</span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="root">
      <PageEffects />

      <header className="header">
        <div className="header-in">
          <a href="#inicio" className="header-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/antoky-logo-blanco.webp" alt="Antoky" className="logo-dark" height={21} />
          </a>
          <nav data-hnav="" className="hnav" aria-label="Principal">
            {NAV.map(([href, label]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>
          <a href="#contacto" className="hcta">
            <span className="hcta-l">Agendar diagnóstico</span>
            <span className="hcta-s">Agendar</span>
            <Arrow />
          </a>
        </div>
      </header>

      <main className="main">
        <section id="inicio" className="hero">
          <HeroField />
          <h1 data-reveal="">
            Tu empresa no debería perder tiempo en procesos que <Serif>la tecnología puede resolver.</Serif>
          </h1>
          <p data-reveal="" className="hero-p">
            Desarrollamos software a medida, automatizaciones y soluciones con inteligencia artificial para que tu empresa trabaje con mayor
            eficiencia, reduzca errores y pueda crecer sin aumentar innecesariamente su carga operativa.
          </p>
          <div data-reveal="" className="hero-ctas">
            <a href="#contacto" className="btn-y">
              Agendar diagnóstico →
            </a>
            <a href="#soluciones" className="btn-w">
              Explorar soluciones
            </a>
          </div>
          <div data-reveal="" className="hero-pts">
            {["Primera conversación sin costo", "Hecho a la medida de tu operación", "Agroindustria y distribución"].map((t) => (
              <span key={t}>
                <i />
                {t}
              </span>
            ))}
          </div>
        </section>

        <section id="problemas" className="sec">
          <div data-reveal="" className="sec-head">
            <div className="sec-title">
              <Eyebrow>01 / EL PUNTO DE PARTIDA</Eyebrow>
              <h2>
                ¿Tu operación está creciendo, pero tus procesos <Serif>siguen siendo manuales?</Serif>
              </h2>
            </div>
            <p className="sec-aside">
              Muchas empresas pierden tiempo y recursos porque sus herramientas no están preparadas para la complejidad de su operación.
            </p>
          </div>
          <div className="grid grid-250">
            {PROBLEMAS.map((p) => (
              <div key={p.n} data-reveal="" className="card problema">
                <span className="mono num">{p.n}</span>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </div>
            ))}
          </div>
          <p data-reveal="" className="statement">
            El problema no siempre es la falta de personal. <span>A veces es la forma en que funciona tu operación.</span>
          </p>
        </section>

        <section id="soluciones" className="sec sec-40 anchor">
          <Carousel
            heading={
              <div className="sec-title">
                <Eyebrow>02 / SOLUCIONES</Eyebrow>
                <h2>
                  Tecnología diseñada para <Serif>resolver problemas reales.</Serif>
                </h2>
                <p className="sec-lead">
                  No empezamos recomendándote una aplicación. Primero entendemos cómo funciona tu negocio y después definimos qué tecnología puede
                  generar mayor impacto.
                </p>
              </div>
            }
          >
            <article className="sol">
              <div className="sol-vis sol-panel">
                <div className="vis-top">
                  <b>Panel de operación</b>
                  <span className="mono muted">HOY</span>
                </div>
                <div className="kpis">
                  <div>
                    <span>Pedidos</span>
                    <b>128</b>
                  </div>
                  <div>
                    <span>Despachos</span>
                    <b>42</b>
                  </div>
                  <div className="kpi-y">
                    <span>Inventario</span>
                    <b>Al día</b>
                  </div>
                </div>
                <div className="bars">
                  {BARRAS.map((h, i) => (
                    <span key={i} style={{ height: `${h}%`, background: i === 5 ? "#FFD600" : "#3A3A40", animationDelay: `${(i * 0.12).toFixed(2)}s` }} />
                  ))}
                </div>
              </div>
              <div className="sol-body">
                <span className="mono num">01</span>
                <h3>Software empresarial a medida</h3>
                <p>
                  Desarrollamos sistemas adaptados a los procesos y necesidades de tu empresa, evitando que tu operación tenga que ajustarse a
                  herramientas que no encajan.
                </p>
              </div>
            </article>

            <article className="sol">
              <div className="sol-vis sol-flow">
                <div className="vis-top">
                  <b>Flujo automático</b>
                  <span className="mono live">
                    <i />
                    ACTIVO
                  </span>
                </div>
                {FLUJO.map((s, i) => (
                  <div key={s.t} className="flow-step" style={{ animationDelay: `${i * 0.6}s` }}>
                    <span className={`flow-ic${s.listo ? " flow-ic-y" : ""}`}>{s.icon}</span>
                    <span className="flow-t">{s.t}</span>
                    <span className="mono flow-tag">{s.tag}</span>
                  </div>
                ))}
              </div>
              <div className="sol-body">
                <span className="mono num">02</span>
                <h3>Automatización de procesos</h3>
                <p>Reducimos tareas repetitivas, intervención manual y reprocesos mediante flujos de trabajo automatizados.</p>
              </div>
            </article>

            <article className="sol">
              <div className="sol-vis sol-links">
                <div className="vis-top">
                  <b>Sistemas conectados</b>
                  <span className="mono">SINCRONIZANDO</span>
                </div>
                <div className="links">
                  {ENLACES.map(([a, b], i) => (
                    <div key={a}>
                      <span className="link-a">{a}</span>
                      <span className="link-line">
                        <span style={{ animationDelay: `${i * 0.8}s` }} />
                      </span>
                      <span className="link-b">{b}</span>
                    </div>
                  ))}
                </div>
                <span className="links-note">La información fluye sin transferencias manuales</span>
              </div>
              <div className="sol-body">
                <span className="mono num">03</span>
                <h3>Integración de sistemas</h3>
                <p>
                  Conectamos las herramientas que ya utilizas para que la información fluya entre áreas y procesos sin depender de transferencias
                  manuales.
                </p>
              </div>
            </article>

            <article className="sol">
              <div className="sol-vis sol-ia">
                <div className="vis-top">
                  <b className="ia-title">
                    <span className="ia-ic">✳</span>Asistente de operación
                  </b>
                  <span className="mono muted">IA</span>
                </div>
                <div className="chat">
                  <div className="msg msg-me">¿Qué pedidos siguen pendientes de despacho esta semana?</div>
                  <div className="msg msg-dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </div>
                  <div className="msg msg-ai">
                    Hay 6 pedidos pendientes. Te preparé el resumen por cliente y fecha de entrega.
                    <span className="msg-acts">
                      <span className="msg-act-y">Ver resumen</span>
                      <span>Exportar</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="sol-body">
                <span className="mono num">04</span>
                <h3>Inteligencia artificial aplicada</h3>
                <p>
                  Implementamos capacidades de IA para apoyar procesos, analizar información y aumentar la productividad cuando existe un caso de uso
                  viable.
                </p>
              </div>
            </article>
          </Carousel>
          <p className="fine">Vistas ilustrativas. Cada solución se diseña según el alcance de tu proyecto.</p>
        </section>

        <section id="sectores" className="sec sec-40 anchor">
          <div data-reveal="" className="sec-title sec-title-w">
            <Eyebrow>03 / SECTORES</Eyebrow>
            <h2>
              Entendemos los desafíos de <Serif>operaciones exigentes.</Serif>
            </h2>
          </div>
          <div className="grid grid-320">
            <div data-reveal="" className="card sector">
              <span className="mono num">SECTOR 01</span>
              <h3>Agroindustria</h3>
              <p>
                Soluciones para empresas agrícolas, productoras, comercializadoras y agroindustriales que necesitan mejorar su trazabilidad,
                inventarios, control operativo, coordinación y gestión de información.
              </p>
            </div>
            <div data-reveal="" className="card sector">
              <span className="mono num">SECTOR 02</span>
              <h3>Distribución y comercialización</h3>
              <p>Soluciones para empresas que necesitan optimizar la gestión de pedidos, inventarios, entregas, procesos comerciales y administrativos.</p>
            </div>
          </div>
          <div className="cinta">
            <CintaFila casos={CINTA_A} />
            <CintaFila casos={CINTA_B} reversa />
          </div>
        </section>

        <section id="diagnostico" data-reveal="" className="diag">
          <div className="diag-l">
            <Eyebrow className="eyebrow-y">04 / DIAGNÓSTICO</Eyebrow>
            <h2>
              Antes de invertir en software, descubre <span className="serif y">qué necesita realmente tu empresa.</span>
            </h2>
            <p>
              Nuestro enfoque comienza entendiendo tu operación. Identificamos problemas, evaluamos oportunidades y te ayudamos a establecer
              prioridades antes de tomar decisiones tecnológicas.
            </p>
            <div className="diag-cta">
              <a href="#contacto" className="btn-y btn-lift">
                Agendar diagnóstico →
              </a>
              <span>Comienza con una conversación inicial sin costo para conocer tu operación y evaluar si podemos ayudarte.</span>
            </div>
          </div>
          <div className="diag-r">
            {DIAGNOSTICO.map((t, i) => (
              <div key={t} className="diag-item">
                <span className="mono">0{i + 1}</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="portal" className="portal anchor">
          <div data-reveal="" className="portal-l">
            <Eyebrow>05 / PORTAL DE CLIENTE</Eyebrow>
            <h2>
              Tu proyecto, <Serif>en un solo lugar.</Serif>
            </h2>
            <p className="sec-lead">Sigue el avance, revisa entregas y comunícate con nuestro equipo desde un espacio pensado para tu empresa.</p>
            <div className="portal-items">
              {PORTAL.map((it) => (
                <div key={it.t}>
                  <b>{it.t}</b>
                  <span>{it.d}</span>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal="" className="browser" aria-hidden="true">
            <div className="browser-bar">
              <i />
              <i />
              <i />
              <span className="mono">portal.antoky.com / tu-empresa</span>
            </div>
            <div className="app">
              <div className="app-side">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/antoky-logo-blanco.webp" alt="" className="logo-dark" height={14} />
                <span className="on">Mi espacio</span>
                <span>Soluciones</span>
                <span>Avances</span>
                <span>Soporte</span>
                <span>Resultados</span>
              </div>
              <div className="app-main">
                <div className="app-hi">
                  <span className="mono">MI ESPACIO</span>
                  <b>Hola, equipo.</b>
                  <span>Así avanza lo que estamos construyendo juntos.</span>
                </div>
                <div className="app-kpis">
                  <div>
                    <span>Objetivos</span>
                    <b>Definidos contigo</b>
                  </div>
                  <div>
                    <span>Proyecto</span>
                    <b>En construcción</b>
                  </div>
                  <div className="kpi-y">
                    <span>Próximo paso</span>
                    <b>Validar contigo</b>
                  </div>
                </div>
                <div className="app-proj">
                  <div className="app-proj-top">
                    <div>
                      <span className="mono">SOFTWARE A MEDIDA</span>
                      <b>Sistema de trazabilidad</b>
                    </div>
                    <span className="pill">
                      <i />
                      En curso
                    </span>
                  </div>
                  <div className="progress-track">
                    <div />
                  </div>
                  <div className="steps">
                    <span className="done">
                      <i>✓</i>Entender
                    </span>
                    <span className="done">
                      <i>✓</i>Diagnosticar
                    </span>
                    <span className="now">
                      <i />
                      Construir
                    </span>
                    <span className="next">
                      <i />
                      Evolucionar
                    </span>
                  </div>
                </div>
                <div className="app-note">
                  <span className="app-av">A</span>
                  <span className="app-note-t">El módulo de inventarios está listo para tu revisión.</span>
                  <span className="app-note-b">Ver avance</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="metodo" className="sec anchor">
          <div data-reveal="" className="sec-title sec-title-w">
            <Eyebrow>06 / CÓMO TRABAJAMOS</Eyebrow>
            <h2>
              De un problema operativo a una solución <Serif>que genera valor.</Serif>
            </h2>
          </div>
          <div className="grid grid-240">
            {METODO.map((m) => (
              <div key={m.n} data-reveal="" className={`card paso${m.oscuro ? " paso-d" : ""}`}>
                <div className="paso-top">
                  <span className="paso-n">{m.n}</span>
                  <span className="mono paso-tag">{m.tag}</span>
                </div>
                <h3>{m.t}</h3>
                <p>{m.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="nosotros" className="sec anchor">
          <div data-reveal="" className="sec-head">
            <div className="sec-title">
              <Eyebrow>07 / NOSOTROS</Eyebrow>
              <h2>
                Tu negocio merece más que <Serif>un proveedor de software.</Serif>
              </h2>
            </div>
            <div className="nos-aside">
              <p>En Antoky creemos que la tecnología debe resolver problemas reales, no añadir complejidad.</p>
              <p>
                Somos una empresa colombiana liderada por dos fundadores que se involucran directamente en cada proyecto, desde entender el problema
                hasta construir la solución.
              </p>
            </div>
          </div>
          <div className="grid grid-280">
            {FUNDADORES.map((f) => (
              <div key={f.name} data-reveal="" className="founder">
                <div className="founder-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.img} alt={f.name} loading="lazy" decoding="async" />
                </div>
                <div className="founder-body">
                  <div className="founder-top">
                    <b>{f.name}</b>
                    <span className="mono">{f.role}</span>
                  </div>
                  <p>{f.bio}</p>
                </div>
              </div>
            ))}
            <div data-reveal="" className="compromiso">
              <span className="mono eyebrow-plain">COMPROMISO DIRECTO</span>
              <p>
                Menos intermediarios. <Serif>Más compromiso con tu operación.</Serif>
              </p>
            </div>
          </div>
        </section>

        <section id="contacto" className="contacto">
          <div data-reveal="" className="contacto-l">
            <Eyebrow>EL SIGUIENTE PASO</Eyebrow>
            <h2>
              Tu próximo paso no es comprar software. <Serif>Es entender qué está frenando tu operación.</Serif>
            </h2>
            <p className="sec-lead">
              Conversemos sobre los desafíos de tu empresa y descubramos si existe una oportunidad real de mejorar tus procesos mediante tecnología.
            </p>
            <ol className="contacto-steps">
              <li>
                <span className="mono">01</span>Nos cuentas tu reto
              </li>
              <li>
                <span className="mono">02</span>Te contactamos para acordar la conversación
              </li>
              <li>
                <span className="mono">03</span>Evaluamos juntos las posibilidades
              </li>
            </ol>
          </div>
          <div data-reveal="" className="contacto-r">
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div aria-hidden="true" className="footer-notch">
          <span className="notch-l" />
          <span className="notch-m" />
          <span className="notch-r" />
        </div>
        <div className="footer-in">
          <div className="footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/antoky-logo-blanco.webp" alt="Antoky" height={24} />
            <h3>
              Procesos claros.
              <br />
              <Serif>Empresas que escalan.</Serif>
            </h3>
            <p>Software a medida, automatización e integración de sistemas para empresas en Colombia.</p>
            <a href="#contacto" className="footer-cta">
              Agendar diagnóstico →
            </a>
            <span className="footer-copy">© 2026 Antoky S.A.S · Todos los derechos reservados</span>
          </div>
          {FOOTER.map((col) => (
            <div key={col.titulo} className="footer-col">
              <span>{col.titulo}</span>
              <div>
                {col.links.map(([href, label]) => (
                  <a key={label} href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

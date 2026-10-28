import type { ReactNode } from "react";
import { ContactForm } from "@/components/ContactForm";
import { HeroOrb } from "@/components/HeroOrb";
import { PageEffects } from "@/components/PageEffects";
import { CursorDot } from "@/components/CursorDot";
import { SiteLoader } from "@/components/SiteLoader";

// Diseño: "Antoky Home v8.dc.html" (claude.ai/design).

const Serif = ({ children }: { children: ReactNode }) => <span className="serif">{children}</span>;
const Eyebrow = ({ children, y }: { children: ReactNode; y?: boolean }) => <span className={`eyebrow${y ? " eyebrow-y" : ""}`}>{children}</span>;
const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const pad = (n: number) => String(n).padStart(2, "0");

const NAV = [
  ["#problemas", "Qué solucionamos"],
  ["#demo", "Así funciona"],
  ["#demostraciones", "Demostraciones"],
  ["#metodo", "Cómo trabajamos"],
  ["#nosotros", "Nosotros"],
];

const PROBLEMAS = [
  { t: "Tu equipo registra la misma información varias veces.", d: "En el sistema, en Excel y en el chat. Cada copia es una oportunidad de error." },
  { t: "Cada semana pierdes horas preparando reportes.", d: "Juntar datos de varias fuentes antes de poder tomar una decisión." },
  { t: "La información está repartida entre Excel, WhatsApp y otros sistemas.", d: "Encontrar el dato correcto depende de a quién le preguntes." },
  { t: "Cuando alguien falta, ciertos procesos se detienen.", d: "El conocimiento vive en las personas, no en el proceso." },
  { t: "Tus herramientas no comparten información.", d: "Lo que se actualiza en un lugar hay que repetirlo en otro." },
  { t: "Los errores manuales generan retrasos y reprocesos.", d: "Corregir toma más tiempo que hacerlo bien desde el inicio." },
];

const BENEFICIOS = [
  { t: "Recupera tiempo de tu equipo", d: "Reduce las actividades repetitivas que consumen horas de trabajo, para que tu equipo se dedique a lo que sí requiere criterio." },
  { t: "Reduce errores y reprocesos", d: "Disminuye la dependencia de registros y transferencias manuales de información." },
  { t: "Conecta tu operación", d: "Haz que los sistemas y herramientas compartan la información necesaria." },
  { t: "Obtén mayor control", d: "Centraliza datos y mejora la visibilidad sobre lo que sucede en tu empresa." },
  { t: "Crece sin multiplicar el trabajo manual", d: "Prepara tus procesos para gestionar más actividad de una manera ordenada." },
];

const TECNOLOGIA = [
  { t: "Software a medida", d: "Herramientas que se adaptan a tu forma de trabajar." },
  { t: "Automatización", d: "Tareas repetitivas que ocurren sin intervención manual." },
  { t: "Integración de sistemas", d: "Tus herramientas actuales, conectadas entre sí." },
  { t: "Inteligencia artificial", d: "Cuando existe un caso de uso viable y medible." },
];

const BARRAS = [38, 62, 45, 80, 55, 92, 68, 74, 50, 86];

const FLUJO = [
  { icon: "1", t: "Solicitud recibida", tag: "08:02" },
  { icon: "2", t: "Datos validados", tag: "08:02" },
  { icon: "3", t: "Responsable asignado", tag: "08:03" },
  { icon: "✓", t: "Cliente notificado", tag: "LISTO", listo: true },
];

const ENLACES = [
  ["Ventas", "Inventario"],
  ["Inventario", "Facturación"],
  ["Facturación", "Contabilidad"],
];

const FUNDADORES = [
  { name: "Carlos Arias", role: "CoFounder", img: "/assets/carlos-arias-v2.webp", bio: "Escucha los desafíos de tu empresa y acompaña la definición de soluciones alineadas con tus necesidades y objetivos." },
  { name: "Sebastián Valle", role: "CoFounder", img: "/assets/sebastian-valle-v2.webp", bio: "Lidera el diseño técnico y desarrollo de soluciones que convierten procesos empresariales complejos en herramientas prácticas y escalables." },
];

const METODO = [
  { tag: "SIN COSTO", t: "Nos cuentas qué está pasando", d: "Conversamos para entender el problema y sus implicaciones." },
  { tag: "ANÁLISIS", t: "Analizamos las oportunidades", d: "Identificamos qué podría mejorarse y si tiene sentido intervenir." },
  { tag: "PROPUESTA", t: "Diseñamos una solución", d: "Proponemos un alcance acorde con las necesidades reales." },
  { tag: "ACOMPAÑAMIENTO", t: "Implementamos y acompañamos", d: "Construimos, probamos y facilitamos la adopción de la solución." },
];

const FOOTER = [
  { titulo: "Menú", links: [["#inicio", "Inicio"], ["#problemas", "Qué solucionamos"], ["#demo", "Así funciona"], ["#metodo", "Cómo trabajamos"]] },
  { titulo: "Empresa", links: [["#demostraciones", "Demostraciones"], ["#nosotros", "Nosotros"], ["#resultados", "Resultados"]] },
  { titulo: "Contacto", links: [["#contacto", "Solicitar conversación"], ["mailto:contacto@antoky.com", "contacto@antoky.com"], ["https://wa.me/573137264497", "WhatsApp +57 313 7264497"]] },
];

const DemoBody = ({ t, d }: { t: string; d: string }) => (
  <div className="dbody">
    <span className="dchip">DEMO · DATOS SIMULADOS</span>
    <h3>{t}</h3>
    <p>{d}</p>
  </div>
);

export default function Home() {
  return (
    <div data-lightgrid="" className="root">
      <noscript>
        <style>{".loader{display:none}"}</style>
      </noscript>
      <SiteLoader />
      <CursorDot />
      <PageEffects />

      <header data-hdr="" className="header">
        <div className="header-in">
          <a href="#inicio" aria-label="Inicio" className="header-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/antoky-logo-blanco.webp" alt="Antoky" height={21} />
          </a>
          <nav data-hnav="" className="hnav" aria-label="Principal">
            {NAV.map(([href, label]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>
          <a data-hcta="" href="#contacto" className="hcta">
            <span data-hcta-l="">Cuéntanos tu problema</span>
            <span data-hcta-s="">Contacto</span>
            <Arrow />
            <span data-hfill="" aria-hidden="true" className="hcta-fill">
              <span data-hcta-l="">Cuéntanos tu problema</span>
              <span data-hcta-s="">Contacto</span>
              <Arrow />
            </span>
          </a>
        </div>
      </header>

      <main className="main">
        <section id="inicio" className="hero">
          <div data-hero-inner="" className="hero-inner">
            <div data-herogrid="" className="hero-grid">
              <div className="hero-copy">
                <h1 data-letters="">
                  Menos tareas manuales. Menos errores. <Serif>Más control sobre tu empresa.</Serif>
                </h1>
                <p className="hero-p">
                  Si tu equipo pierde tiempo repitiendo tareas, buscando información o corrigiendo errores, te ayudamos a encontrar{" "}
                  <strong>una forma más eficiente de trabajar</strong>, con tecnología diseñada para tu negocio.
                </p>
                <div className="hero-ctas">
                  <a href="#contacto" data-pearl="">
                    <span>
                      <i>
                        <b>✧</b>
                        <b>✦</b>Cuéntanos tu problema
                      </i>
                    </span>
                    <span data-pflat="" aria-hidden="true" className="pflat">
                      <b>✧</b>Cuéntanos tu problema
                    </span>
                  </a>
                  <a href="#demo" className="btn-w">
                    Descubre cómo podemos ayudarte
                    <span data-cflat="" aria-hidden="true" className="cflat">
                      Descubre cómo podemos ayudarte
                    </span>
                  </a>
                </div>
                <span className="hero-note">Primera conversación sin costo y sin compromiso.</span>
              </div>
              <HeroOrb />
            </div>
          </div>
        </section>

        <section id="problemas" className="problemas">
          <div data-pin="" className="pin">
            <div data-pin-inner="" className="pin-inner">
              <div className="sec-head">
                <div className="sec-title">
                  <Eyebrow>01 / QUÉ SOLUCIONAMOS</Eyebrow>
                  <h2 className="h2">
                    ¿Te pasa esto <Serif>en tu empresa?</Serif>
                  </h2>
                </div>
                <span data-pcount="" aria-hidden="true" className="count">
                  01 / {pad(PROBLEMAS.length)}
                </span>
              </div>
              <div data-stage="" className="stage">
                {PROBLEMAS.map((p, i) => (
                  <article key={p.t} data-pcard="" className="pcard">
                    <span className="pcard-n">{pad(i + 1)}</span>
                    <h3>{p.t}</h3>
                    <p>{p.d}</p>
                  </article>
                ))}
              </div>
              <div aria-hidden="true" className="segs">
                {PROBLEMAS.map((p) => (
                  <span key={p.t}>
                    <span data-pseg="" />
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p data-reveal="" className="statement">
            El problema no siempre es la falta de personal. <span>A veces es la forma en que funciona tu operación.</span>
          </p>
        </section>

        <section id="demo" className="dark-sec demo">
          <div data-reveal="" className="sec-head">
            <div className="sec-title">
              <Eyebrow y>02 / ASÍ TRANSFORMAMOS LOS PROCESOS</Eyebrow>
              <h2 className="h2">
                El mismo trabajo, <Serif>con menos pasos manuales.</Serif>
              </h2>
            </div>
          </div>
          <div className="demo-grid">
            <div className="demo-col">
              <div className="demo-lbl">
                <Eyebrow>ANTES</Eyebrow>
                <b>Cómo funciona hoy</b>
              </div>
              <div data-tilt="" className="tilt">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/flujo/antes-flujo-manual.webp"
                  width={1536}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                  alt="Flujo manual: una solicitud llega por WhatsApp, alguien la copia a Excel, otra persona revisa, se actualiza el inventario y alguien responde al cliente por correo."
                />
              </div>
            </div>
            <div className="demo-col">
              <div className="demo-lbl">
                <Eyebrow y>DESPUÉS</Eyebrow>
                <b>Cómo puede funcionar</b>
              </div>
              <div data-tilt="" className="tilt tilt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/flujo/despues-flujo-automatizado.webp"
                  width={1536}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                  alt="Flujo automatizado: la solicitud de WhatsApp llega a Antoky, que actualiza la hoja de pedidos y el inventario, avisa al equipo y envía la respuesta al cliente por correo."
                />
              </div>
            </div>
          </div>
        </section>

        <section id="resultados" className="resultados">
          <div className="rgrid">
            <div className="rsticky">
              <Eyebrow>03 / LO QUE GANA TU EMPRESA</Eyebrow>
              <h2 className="h2">
                Mejoras que se notan <Serif>en el día a día.</Serif>
              </h2>
              <div aria-hidden="true" className="bcount-row">
                <span data-bcount="" className="bcount">
                  01
                </span>
                <span className="count">/ {pad(BENEFICIOS.length)}</span>
              </div>
              <p className="fine">El alcance de cada mejora depende del proceso y de su implementación.</p>
            </div>
            <ol className="bens">
              {BENEFICIOS.map((b, i) => (
                <li key={b.t} data-ben="" className="ben">
                  <span className="bnum">{pad(i + 1)}</span>
                  <div className="ben-body">
                    <h3>{b.t}</h3>
                    <p>{b.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div data-reveal="" className="tech-wrap">
            <Eyebrow>CÓMO LO HACEMOS POSIBLE</Eyebrow>
            <div className="tech">
              {TECNOLOGIA.map((t) => (
                <div key={t.t}>
                  <b>{t.t}</b>
                  <span>{t.d}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="demostraciones" className="dark-sec demos">
          <div data-hpin="" className="hpin">
            <div data-hpin-inner="" className="hpin-inner">
              <div className="sec-head">
                <div className="sec-title">
                  <Eyebrow y>04 / DEMOSTRAR ANTES DE PROMETER</Eyebrow>
                  <h2 className="h2">
                    Mira cómo funciona <Serif>antes de decidir.</Serif>
                  </h2>
                  <p data-hsub="" className="hsub">
                    Preferimos mostrarte herramientas funcionando antes que prometerte resultados. Estas demostraciones usan datos simulados.
                  </p>
                </div>
                <span data-hcount="" aria-hidden="true" className="count">
                  01 / 04
                </span>
              </div>
              <div data-htrack="" className="htrack">
                <article data-card="" data-pcard="" className="dcard">
                  <div className="dvis dvis-panel" aria-hidden="true">
                    <div className="vis-top">
                      <b>Panel de operación</b>
                      <span className="mono muted">HOY</span>
                    </div>
                    <div className="kpis">
                      <div>
                        <span>Solicitudes</span>
                        <b>128</b>
                      </div>
                      <div>
                        <span>Pendientes</span>
                        <b>12</b>
                      </div>
                      <div className="kpi-y">
                        <span>Datos</span>
                        <b>Al día</b>
                      </div>
                    </div>
                    <div className="bars">
                      {BARRAS.map((h, i) => (
                        <span key={i} style={{ height: `${h}%`, background: i === 5 ? "#FFD600" : "#3A3A40", animationDelay: `${(i * 0.12).toFixed(2)}s` }} />
                      ))}
                    </div>
                  </div>
                  <DemoBody t="Toda tu operación en una sola vista" d="Información actualizada para decidir sin esperar a que alguien consolide reportes." />
                </article>

                <article data-card="" data-pcard="" className="dcard">
                  <div className="dvis dvis-flow" aria-hidden="true">
                    <div className="vis-top">
                      <b>Flujo de una solicitud</b>
                      <span className="mono muted-2 live">
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
                  <DemoBody t="Una solicitud que avanza sola" d="Cada paso se registra y notifica sin que alguien tenga que copiar ni reenviar datos." />
                </article>

                <article data-card="" data-pcard="" className="dcard">
                  <div className="dvis dvis-links" aria-hidden="true">
                    <div className="vis-top">
                      <b>Herramientas conectadas</b>
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
                  </div>
                  <DemoBody t="Herramientas que comparten información" d="Lo que se actualiza en un lugar llega a los demás, sin volver a digitarlo." />
                </article>

                <article data-card="" data-pcard="" className="dcard">
                  <div className="dvis dvis-ia" aria-hidden="true">
                    <div className="vis-top">
                      <b className="ia-title">
                        <span className="ia-ic">✳</span>Asistente de operación
                      </b>
                      <span className="mono muted-2">IA</span>
                    </div>
                    <div className="chat">
                      <div className="msg msg-me">¿Qué solicitudes siguen pendientes esta semana?</div>
                      <div className="msg msg-dots">
                        <i />
                        <i />
                        <i />
                      </div>
                      <div className="msg msg-ai">Hay 6 pendientes. Te preparé el resumen por responsable y fecha.</div>
                    </div>
                  </div>
                  <DemoBody
                    t="Preguntar y obtener la respuesta"
                    d="Consultar la información de la empresa en lenguaje natural, cuando existe un caso de uso viable."
                  />
                </article>
              </div>
              <div aria-hidden="true" className="hbar">
                <span data-hbar="" />
              </div>
            </div>
          </div>

          <div id="nosotros" className="nosotros">
            <div data-reveal="" className="nos-head">
              <h3>
                Quién está detrás <Serif>de cada proyecto.</Serif>
              </h3>
              <p>
                Somos una empresa colombiana liderada por dos fundadores que se involucran directamente en cada proyecto, desde entender el problema
                hasta construir la solución.
              </p>
            </div>
            <div className="nos-grid">
              {FUNDADORES.map((f) => (
                <div key={f.name} data-reveal="" data-fcard="" className="fcard">
                  <div data-f3d="" className="f3d">
                    <span aria-hidden="true" className="f-layer f-layer-1" />
                    <span aria-hidden="true" className="f-layer f-layer-2" />
                    <div className="f-glass">
                      <span aria-hidden="true" className="f-shine" />
                      <div className="f-img">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img data-fimg="" src={f.img} alt={f.name} loading="lazy" decoding="async" />
                      </div>
                      <div className="f-body">
                        <div className="f-top">
                          <b>{f.name}</b>
                          <span className="mono">{f.role}</span>
                        </div>
                        <p>{f.bio}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div data-reveal="" className="evidencia">
                <span className="mono">EVIDENCIA, NO PROMESAS</span>
                <div>
                  <p className="evidencia-t">
                    Solo publicamos cifras <Serif>que un cliente haya medido y autorizado.</Serif>
                  </p>
                  <p className="evidencia-d">En la conversación inicial podemos mostrarte demostraciones funcionales y procesos que hemos resuelto.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="metodo" className="metodo">
          <div data-reveal="" className="sec-title">
            <Eyebrow>05 / CÓMO TRABAJAMOS</Eyebrow>
            <h2 className="h2">
              Trabajar con nosotros <Serif>es sencillo.</Serif>
            </h2>
          </div>
          <div data-mwrap="" className="mwrap">
            <div data-mtrack="" aria-hidden="true" className="mtrack">
              <span data-mline="" />
            </div>
            <ol className="mgrid">
              {METODO.map((m, i) => (
                <li key={m.t} data-mstep="" className="mstep">
                  <span className="mdot">{pad(i + 1)}</span>
                  <div className="mcard">
                    <span className="mchip">{m.tag}</span>
                    <h3>{m.t}</h3>
                    <p>{m.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div data-reveal="" className="costo">
            <span className="eyebrow">SOBRE EL COSTO</span>
            <p>
              La conversación inicial es gratuita y sirve para entender tu situación. Si tu caso requiere un diagnóstico operativo detallado, te
              presentamos su alcance y su costo antes de empezar.
            </p>
          </div>
        </section>

        <section id="contacto" data-ballfill="" className="contacto">
          <div data-reveal="" className="contacto-l">
            <Eyebrow y>06 / CONTACTO</Eyebrow>
            <h2 className="h2">
              Cuéntanos qué está <Serif>frenando tu empresa.</Serif>
            </h2>
            <p>No necesitas tener una solución definida. Cuéntanos qué está pasando y exploremos si podemos ayudarte.</p>
            <div className="despues">
              <b>Qué pasa después</b>
              {["Revisamos lo que nos cuentas.", "Te contactamos para acordar la conversación.", "Conversamos y te decimos con claridad si podemos ayudarte."].map(
                (t, i) => (
                  <div key={t}>
                    <span className="mono">{pad(i + 1)}</span>
                    {t}
                  </div>
                ),
              )}
            </div>
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
            <p>Ayudamos a empresas a resolver problemas operativos con software, automatización e inteligencia artificial.</p>
            <a href="#contacto" className="footer-cta">
              Cuéntanos tu problema →
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

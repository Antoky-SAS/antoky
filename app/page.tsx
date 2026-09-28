import Aura from "@/components/Aura";
import ContactForm from "@/components/ContactForm";
import FooterLogo from "@/components/FooterLogo";
import Header from "@/components/Header";
import Loader from "@/components/Loader";

const MARQUEE_WORDS = ["Innovación", "Estrategia", "Personas", "Resultados", "SaaS", "Desarrollo a la medida"];

const FOTOS = [
  "photo-1509062522246-3755977927d7",
  "photo-1503676260728-1c00da094a0b",
  "photo-1524178232363-1fb2b075b655",
  "photo-1427504494785-3a9ca7044f45",
  "photo-1580582932707-520aed937b7b",
  "photo-1498050108023-c5249f4df085",
];
const GALERIA_A = FOTOS.slice(0, 3).concat(FOTOS.slice(3, 4));
const GALERIA_B = FOTOS.slice(3).concat(FOTOS.slice(0, 1));

const PRODUCTOS = [
  {
    titulo: "Software a la medida",
    texto: "Aplicaciones web e integraciones diseñadas para sus procesos.",
    cta: "Obtener software a la medida",
    img: "photo-1522071820081-009f0129c71c",
    alt: "Equipo desarrollando software",
  },
  {
    titulo: "Aplicación móvil",
    texto: "Apps para iOS y Android que acercan su servicio a sus clientes.",
    cta: "Obtener aplicación móvil",
    img: "photo-1512941937669-90a1b58e7e9c",
    alt: "Aplicación móvil",
  },
];

const PASOS = [
  { titulo: "Diagnóstico", texto: "Entendemos su organización, sus procesos y lo que necesita resolver." },
  { titulo: "Estrategia", texto: "Definimos alcance, tiempos y costos por escrito." },
  { titulo: "Desarrollo", texto: "Construimos por etapas y le mostramos avances reales en cada una." },
  { titulo: "Resultados y soporte", texto: "Capacitamos a su equipo y seguimos acompañándolo después del lanzamiento." },
];

const FUNDADORES = [
  {
    nombre: "Carlos Arias",
    cargo: "CoFounder - CEO",
    foto: "/assets/carlos-arias-v2.png",
    bio: "Lidera la estrategia comercial y la relación con clientes. Se asegura de que cada solución responda a una necesidad real del negocio.",
  },
  {
    nombre: "Sebastián Valle",
    cargo: "CoFounder - CTO",
    foto: "/assets/sebastian-valle-v2.png",
    bio: "Dirige la arquitectura y el desarrollo de producto. Convierte procesos complejos en software claro, seguro y escalable.",
  },
];

function Galeria({ fotos, reverse }: { fotos: string[]; reverse?: boolean }) {
  return (
    <div className={`galeria-row${reverse ? " rev" : ""}`}>
      {[...fotos, ...fotos].map((id, i) => (
        <img key={i} src={`/assets/stock/${id}.jpg`} alt="" loading="lazy" />
      ))}
    </div>
  );
}

export default function Home() {
  const marquee = [...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS];

  return (
    <div className="page">
      <Loader />
      <Aura />
      <Header />

      <section id="inicio" className="hero">
        <div className="hero-dots" />
        <div className="wrap hero-in">
          <div className="hero-pill only-desktop">
            <span>SaaS</span>
            <span className="sep">|</span>
            <span>Desarrollo a la medida</span>
            <span className="sep">|</span>
            <span>Empresas · Microempresas · Colegios</span>
          </div>
          <div className="hero-pills only-mobile">
            {["SaaS", "Desarrollo a la medida", "Empresas", "Microempresas", "Colegios"].map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
          <h1 className="m">
            Soluciones tecnológicas
            <br />
            <span>para un futuro más humano</span>
            <br />
            desde Colombia
          </h1>
          <p className="hero-sub m">Tecnología con compromiso y visión de futuro</p>
          <div className="hero-ctas">
            <a href="#contacto" className="btn btn-y btn-hero m">
              Hablemos
            </a>
            <a href="#proyectos" className="btn btn-l btn-hero m">
              Ver soluciones
            </a>
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {marquee.map((w, i) => (
            <span key={i} className="marquee-item m">
              {w}
              <i />
            </span>
          ))}
        </div>
      </div>

      <section id="proyectos" className="productos">
        <div className="wrap productos-in">
          <div className="eyebrow m">01 — Productos</div>
          <article className="card-edu">
            <div className="card-edu-text">
              <div className="chips">
                {["Notas y boletines", "Matrículas", "Asistencia", "Comunicación con padres"].map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
              <h2 className="m">Software educativo</h2>
              <p>
                Una plataforma en la nube para gestionar la vida académica de su colegio: directivos, docentes y
                familias conectados en un solo lugar.
              </p>
              <div className="bullets">
                {["SaaS", "Web y móvil", "Soporte incluido"].map((t) => (
                  <span key={t}>
                    <i />
                    {t}
                  </span>
                ))}
              </div>
              <a href="#contacto" className="btn btn-y card-edu-cta m">
                Obtener software educativo
              </a>
            </div>
            <div className="galeria">
              <Galeria fotos={GALERIA_A} />
              <Galeria fotos={GALERIA_B} reverse />
              <div className="galeria-fade" />
            </div>
          </article>
          <div className="cards2">
            {PRODUCTOS.map((p) => (
              <article key={p.titulo} className="card-img">
                <img src={`/assets/stock/${p.img}.jpg`} alt={p.alt} loading="lazy" />
                <div className="card-img-shade" />
                <div className="card-img-body">
                  <h3 className="m">{p.titulo}</h3>
                  <p>{p.texto}</p>
                  <a href="#contacto" className="btn btn-l card-img-cta m">
                    {p.cta}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="proceso" className="proceso">
        <div className="wrap sec-in">
          <div className="eyebrow m">02 — Cómo trabajamos</div>
          <h2 className="h2-big m">
            De la primera reunión a la entrega, <span>sin sorpresas.</span>
          </h2>
          <div className="pasos">
            {PASOS.map((p, i) => (
              <div key={p.titulo} className={`paso${i === PASOS.length - 1 ? " y" : ""}`}>
                <span className="paso-num m">{"0" + (i + 1)}</span>
                <h3 className="m">{p.titulo}</h3>
                <p>{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="nosotros" className="nosotros">
        <div className="wrap sec-in nosotros-in">
          <div>
            <div className="eyebrow m">03 — Nosotros</div>
            <h2 className="h2-big m">Personas en el centro.</h2>
            <p className="nosotros-p">
              Antoky nace de dos fundadores colombianos convencidos de que la buena tecnología no debe ser exclusiva de
              las grandes empresas. Trabajamos directamente con cada cliente, sin intermediarios.
            </p>
            <div className="valores m">
              <span>Innovación</span>
              <span>Estrategia</span>
              <span>Personas</span>
              <span className="y">Resultados</span>
            </div>
          </div>
          <div className="founders">
            {FUNDADORES.map((f) => (
              <div key={f.nombre} className="founder">
                <div className="founder-photo">
                  <div className="founder-back" style={{ backgroundImage: `url(${f.foto})` }} />
                  <img src={f.foto} alt={f.nombre} loading="lazy" />
                  <div className="founder-deco" />
                  <div className="founder-over">
                    <i />
                    <p>{f.bio}</p>
                  </div>
                </div>
                <div>
                  <div className="founder-name m">{f.nombre}</div>
                  <div className="founder-role">{f.cargo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="contacto">
        <div className="wrap contacto-in">
          <div className="contacto-left">
            <div className="eyebrow m">04 — Contacto</div>
            <h2 className="m">Construyamos el futuro juntos.</h2>
            <p className="contacto-p">
              Cuéntenos qué necesita. Respondemos en menos de un día hábil y la primera reunión es sin costo.
            </p>
            <div className="datos">
              <div>
                <span>Correo</span>
                <a href="mailto:Ceau922@gmail.com">Ceau922@gmail.com</a>
              </div>
              <div>
                <span>WhatsApp</span>
                <a href="https://wa.me/573137264497" target="_blank" rel="noopener noreferrer">
                  +57 313 7264497
                </a>
              </div>
              <div>
                <span>Ubicación</span>
                <span className="v">Colombia</span>
              </div>
            </div>
          </div>
          <div className="form-card">
            <ContactForm />
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap footer-in">
          <FooterLogo />
          <div className="footer-bottom">
            <span className="footer-tag m">Tecnología con compromiso y visión de futuro</span>
            <span>© 2026 Antoky · Colombia</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

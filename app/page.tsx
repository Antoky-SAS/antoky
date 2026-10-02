import { assets, type AssetName } from "@/components/assets";
import { Aura } from "@/components/Aura";
import { AuroraBackground } from "@/components/AuroraBackground";
import { ContactForm } from "@/components/ContactForm";
import { ContactInfo } from "@/components/ContactInfo";
import { Eyebrow } from "@/components/Eyebrow";
import { FeatureCard } from "@/components/FeatureCard";
import { Footer } from "@/components/Footer";
import { Founders } from "@/components/Founders";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ImageCard } from "@/components/ImageCard";
import { Loader } from "@/components/Loader";
import { Marquee } from "@/components/Marquee";
import { Page } from "@/components/Page";
import { ProductCard } from "@/components/ProductCard";
import { ProcessSteps } from "@/components/ProcessSteps";
import { SectionHeading } from "@/components/SectionHeading";
import { Tilt } from "@/components/useTilt";
import { ValueList } from "@/components/ValueList";

const FOTOS = [
  "photo-1509062522246-3755977927d7",
  "photo-1503676260728-1c00da094a0b",
  "photo-1524178232363-1fb2b075b655",
  "photo-1427504494785-3a9ca7044f45",
  "photo-1580582932707-520aed937b7b",
  "photo-1498050108023-c5249f4df085",
].map((id) => `/assets/stock/${id}.webp`);
const GALERIA = [FOTOS.slice(0, 3).concat(FOTOS.slice(3, 4)), FOTOS.slice(3).concat(FOTOS.slice(0, 1))];

const PROPIOS: { titulo: string; etiqueta: string; texto: string; img: AssetName; url: string }[] = [
  {
    titulo: "MySlotfy",
    etiqueta: "Producto propio · Agendamiento",
    texto:
      "Agendamiento de citas en línea para pequeños negocios en Colombia. Sus clientes reservan solos y usted organiza su agenda desde un solo lugar.",
    img: "capturaMyslotfy",
    url: "https://www.myslotfy.com/",
  },
  {
    titulo: "TalentoYa",
    etiqueta: "Producto propio · Talento humano",
    texto:
      "Plataforma para gestionar el talento humano de su empresa: colaboradores, procesos y documentos organizados en un solo sistema.",
    img: "capturaTalentoya",
    url: "https://www.talentoya.com.co/",
  },
];

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

export default function Home() {
  return (
    <Page>
      <AuroraBackground />
      <Loader />
      <Aura />
      <Tilt />
      <Header />

      <Hero />

      <Marquee />

      <section id="proyectos" className="productos">
        <div className="wrap productos-in">
          <Eyebrow>01 — Productos</Eyebrow>
          <div className="cards2">
            {PROPIOS.map((p) => (
              <ProductCard
                key={p.titulo}
                image={assets[p.img]}
                alt={`Captura de ${p.titulo}`}
                tag={p.etiqueta}
                title={p.titulo}
                text={p.texto}
                url={p.url}
              />
            ))}
          </div>
          <FeatureCard
            chips={["Notas y boletines", "Matrículas", "Asistencia", "Comunicación con padres"]}
            title="Software educativo"
            text="Una plataforma en la nube para gestionar la vida académica de su colegio: directivos, docentes y familias conectados en un solo lugar."
            bullets={["SaaS", "Web y móvil", "Soporte incluido"]}
            cta={{ label: "Obtener software educativo", href: "#contacto" }}
            gallery={GALERIA}
          />
          <div className="cards2">
            {PRODUCTOS.map((p) => (
              <ImageCard
                key={p.titulo}
                image={`/assets/stock/${p.img}.webp`}
                alt={p.alt}
                title={p.titulo}
                text={p.texto}
                cta={{ label: p.cta, href: "#contacto" }}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="proceso" className="proceso">
        <div className="wrap sec-in">
          <Eyebrow>02 — Cómo trabajamos</Eyebrow>
          <SectionHeading highlight="sin sorpresas.">De la primera reunión a la entrega, </SectionHeading>
          <ProcessSteps />
        </div>
      </section>

      <section id="nosotros" className="nosotros">
        <div className="wrap sec-in nosotros-in">
          <div>
            <Eyebrow>03 — Nosotros</Eyebrow>
            <SectionHeading>Personas en el centro.</SectionHeading>
            <p className="nosotros-p">
              Antoky nace de dos fundadores colombianos convencidos de que la buena tecnología no debe ser exclusiva de
              las grandes empresas. Trabajamos directamente con cada cliente, sin intermediarios.
            </p>
            <ValueList />
          </div>
          <Founders />
        </div>
      </section>

      <section id="contacto" className="contacto">
        <div className="wrap contacto-in">
          <div className="contacto-left">
            <Eyebrow>04 — Contacto</Eyebrow>
            <h2 className="m">Construyamos el futuro juntos.</h2>
            <p className="contacto-p">
              Cuéntenos qué necesita. Respondemos en menos de un día hábil y la primera reunión es sin costo.
            </p>
            <ContactInfo />
          </div>
          <div className="form-card">
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </Page>
  );
}

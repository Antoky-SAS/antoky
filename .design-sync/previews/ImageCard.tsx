import { ImageCard } from 'antoky-web';

const foto = (id: string) => `https://images.unsplash.com/photo-${id}?w=900&q=70&auto=format`;

export const SoftwareALaMedida = () => (
  <div className="productos" style={{ padding: 24 }}>
    <div style={{ maxWidth: 520 }}>
    <ImageCard
      image={foto('1522071820081-009f0129c71c')}
      alt="Equipo desarrollando software"
      title="Software a la medida"
      text="Aplicaciones web e integraciones diseñadas para sus procesos."
      cta={{ label: 'Obtener software a la medida', href: '#contacto' }}
    />
    </div>
  </div>
);

export const AplicacionMovil = () => (
  <div className="productos" style={{ padding: 24 }}>
    <div style={{ maxWidth: 520 }}>
    <ImageCard
      image={foto('1512941937669-90a1b58e7e9c')}
      alt="Aplicación móvil"
      title="Aplicación móvil"
      text="Apps para iOS y Android que acercan su servicio a sus clientes."
      cta={{ label: 'Obtener aplicación móvil', href: '#contacto' }}
    />
    </div>
  </div>
);

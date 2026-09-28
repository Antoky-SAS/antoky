import { FeatureCard } from 'antoky-web';

const foto = (id: string) => `https://images.unsplash.com/photo-${id}?w=440&q=70&auto=format`;
const FOTOS = [
  '1509062522246-3755977927d7',
  '1503676260728-1c00da094a0b',
  '1524178232363-1fb2b075b655',
  '1427504494785-3a9ca7044f45',
  '1580582932707-520aed937b7b',
  '1498050108023-c5249f4df085',
].map(foto);

export const SoftwareEducativo = () => (
  <div className="productos" style={{ padding: 24 }}>
    <FeatureCard
      chips={['Notas y boletines', 'Matrículas', 'Asistencia', 'Comunicación con padres']}
      title="Software educativo"
      text="Una plataforma en la nube para gestionar la vida académica de su colegio: directivos, docentes y familias conectados en un solo lugar."
      bullets={['SaaS', 'Web y móvil', 'Soporte incluido']}
      cta={{ label: 'Obtener software educativo', href: '#contacto' }}
      gallery={[FOTOS.slice(0, 4), FOTOS.slice(3).concat(FOTOS.slice(0, 1))]}
    />
  </div>
);

export const SinGaleria = () => (
  <div className="productos" style={{ padding: 24 }}>
    <FeatureCard
      chips={['Inventario', 'Facturación electrónica']}
      title="Software a la medida"
      text="Aplicaciones web e integraciones diseñadas para los procesos de su empresa."
      bullets={['Web', 'Integraciones', 'Soporte incluido']}
      cta={{ label: 'Obtener software a la medida', href: '#contacto' }}
    />
  </div>
);

import { Hero } from 'antoky-web';

export const Portada = () => <Hero />;

export const Personalizado = () => (
  <Hero
    tags={['Colegios', 'Software educativo']}
    title={
      <>
        La vida académica de su colegio,
        <br />
        <span>en un solo lugar</span>
      </>
    }
    subtitle="Notas, matrículas, asistencia y comunicación con padres."
    primaryCta={{ label: 'Agendar demostración', href: '#contacto' }}
    secondaryCta={null}
  />
);

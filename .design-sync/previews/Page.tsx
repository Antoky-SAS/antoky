import { Page, Eyebrow, SectionHeading, Button } from 'antoky-web';

export const Raiz = () => (
  <Page fill={false}>
    <div className="wrap sec-in" style={{ padding: 32 }}>
      <Eyebrow>02 — Cómo trabajamos</Eyebrow>
      <SectionHeading highlight="sin sorpresas.">De la primera reunión a la entrega, </SectionHeading>
      <p style={{ color: '#D9DDE1', fontSize: 18, lineHeight: 1.7, maxWidth: 500 }}>
        Trabajamos directamente con cada cliente, sin intermediarios.
      </p>
      <Button size="hero" href="#contacto">Hablemos</Button>
    </div>
  </Page>
);

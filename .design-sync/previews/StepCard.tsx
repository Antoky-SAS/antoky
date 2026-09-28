import { StepCard } from 'antoky-web';

export const Normal = () => (
  <div style={{ padding: 24, maxWidth: 320 }}>
    <StepCard number="01" title="Diagnóstico" text="Entendemos su organización, sus procesos y lo que necesita resolver." />
  </div>
);

export const Destacado = () => (
  <div style={{ padding: 24, maxWidth: 320 }}>
    <StepCard number="04" title="Resultados y soporte" text="Capacitamos a su equipo y seguimos acompañándolo después del lanzamiento." highlight />
  </div>
);

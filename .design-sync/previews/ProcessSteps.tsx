import { ProcessSteps } from 'antoky-web';

export const CuatroPasos = () => (
  <div style={{ padding: 24 }}>
    <ProcessSteps />
  </div>
);

export const TresPasos = () => (
  <div style={{ padding: 24 }}>
    <ProcessSteps
      steps={[
        { title: 'Reunión inicial', text: 'Escuchamos su necesidad sin costo y sin compromiso.' },
        { title: 'Propuesta', text: 'Recibe alcance, tiempos y precio por escrito.' },
        { title: 'Entrega', text: 'Lanzamos, capacitamos y quedamos a su lado.' },
      ]}
    />
  </div>
);

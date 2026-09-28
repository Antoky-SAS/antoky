import { Button } from 'antoky-web';

export const Variantes = () => (
  <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', padding: 24 }}>
    <Button size="hero" href="#contacto">Hablemos</Button>
    <Button variant="light" size="hero" href="#proyectos">Ver soluciones</Button>
  </div>
);

export const Tamanos = () => (
  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', padding: 24 }}>
    <Button size="md" href="#contacto">Obtener software educativo</Button>
    <Button size="pill" href="#contacto">Hablemos →</Button>
    <Button size="lg" type="submit">Enviar mensaje →</Button>
  </div>
);

export const Deshabilitado = () => (
  <div style={{ padding: 24 }}>
    <Button size="lg" type="submit" disabled>Enviando…</Button>
  </div>
);

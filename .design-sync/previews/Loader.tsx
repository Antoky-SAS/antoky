import { Loader } from 'antoky-web';

// El loader es position:fixed a pantalla completa; el transform del contenedor lo encierra en la tarjeta.
// El delay negativo muestra el estado final de la animación (isotipo armado, logotipo y barra llena).
export const PantallaDeCarga = () => (
  <div className="ak-loader-demo" style={{ position: 'relative', height: 460, transform: 'translateZ(0)' }}>
    <style>{'.ak-loader-demo .loader *{animation-delay:-5s !important}'}</style>
    <Loader hold />
  </div>
);

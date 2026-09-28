import { useEffect } from 'react';
import { Aura } from 'antoky-web';

// El aura sigue al puntero: se simula un movimiento al centro para que se vea en la tarjeta.
export const HaloDelCursor = () => {
  useEffect(() => {
    const ev = new PointerEvent('pointermove', { clientX: 300, clientY: 220, bubbles: true });
    window.dispatchEvent(ev);
  }, []);
  return (
    <div style={{ height: 440, padding: 32, color: '#9AA0A6', fontSize: 14 }}>
      Mueva el cursor: el halo amarillo lo sigue; al hacer clic se expande un anillo.
      <Aura />
    </div>
  );
};

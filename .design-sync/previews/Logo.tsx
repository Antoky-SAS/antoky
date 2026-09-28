import { Logo } from 'antoky-web';

export const SobreNegro = () => (
  <div style={{ display: 'flex', gap: 40, alignItems: 'center', padding: 32 }}>
    <Logo height={32} />
    <Logo kind="isotipo" height={56} />
  </div>
);

export const SobreClaro = () => (
  <div className="productos" style={{ display: 'flex', gap: 40, alignItems: 'center', padding: 32 }}>
    <Logo tone="negro" height={32} />
    <Logo kind="isotipo" tone="negro" height={56} />
  </div>
);

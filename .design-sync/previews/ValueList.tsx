import { ValueList } from 'antoky-web';

export const ValoresDeMarca = () => (
  <div style={{ padding: 24 }}>
    <ValueList />
  </div>
);

export const Personalizada = () => (
  <div style={{ padding: 24 }}>
    <ValueList items={['Cercanía', 'Claridad', 'Compromiso']} highlightIndex={0} />
  </div>
);

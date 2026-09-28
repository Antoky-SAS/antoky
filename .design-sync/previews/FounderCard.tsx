import { FounderCard, founders } from 'antoky-web';

export const Fundador = () => {
  const [carlos] = founders();
  return (
    <div style={{ padding: 24, maxWidth: 300 }}>
      <FounderCard {...carlos} />
    </div>
  );
};

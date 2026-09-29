import { ProductCard, assets } from 'antoky-web';

export const MySlotfy = () => (
  <div className="productos" style={{ padding: 24 }}>
    <div style={{ maxWidth: 520 }}>
    <ProductCard
      image={assets.capturaMyslotfy}
      alt="Captura de MySlotfy"
      tag="Producto propio · Agendamiento"
      title="MySlotfy"
      text="Agendamiento de citas en línea para pequeños negocios en Colombia. Sus clientes reservan solos y usted organiza su agenda desde un solo lugar."
      url="https://www.myslotfy.com/"
    />
    </div>
  </div>
);

export const TalentoYa = () => (
  <div className="productos" style={{ padding: 24 }}>
    <div style={{ maxWidth: 520 }}>
    <ProductCard
      image={assets.capturaTalentoya}
      alt="Captura de TalentoYa"
      tag="Producto propio · Talento humano"
      title="TalentoYa"
      text="Plataforma para gestionar el talento humano de su empresa: colaboradores, procesos y documentos organizados en un solo sistema."
      url="https://www.talentoya.com.co/"
    />
    </div>
  </div>
);

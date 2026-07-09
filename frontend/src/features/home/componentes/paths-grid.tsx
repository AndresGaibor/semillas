import * as React from "react";
import { SendaCard } from "./senda-card";

export interface PathsGridProps {
  sendaPadreImg: string;
  sendaHijoImg: string;
  sendaEspirituImg: string;
}

export const PathsGrid: React.FC<PathsGridProps> = ({
  sendaPadreImg,
  sendaHijoImg,
  sendaEspirituImg,
}) => {
  return (
    <section>
      <div className="section-header">
        <h2 className="section-title">Elige tu senda</h2>
      </div>
      <div className="paths-grid">
        <SendaCard
          variante="padre"
          imagenUrl={sendaPadreImg}
          label="Senda del"
          titulo="Padre"
          descripcion="Dios es nuestro Padre amoroso."
          hash="padre"
        />
        <SendaCard
          variante="hijo"
          imagenUrl={sendaHijoImg}
          label="Senda del"
          titulo="Hijo"
          descripcion="Jesús es nuestro Salvador y amigo."
          hash="hijo"
        />
        <SendaCard
          variante="espiritu"
          imagenUrl={sendaEspirituImg}
          label="Senda del"
          titulo="Espíritu Santo"
          descripcion="El Espíritu Santo nos guía y fortalece."
          hash="espiritu"
        />
      </div>
    </section>
  );
};

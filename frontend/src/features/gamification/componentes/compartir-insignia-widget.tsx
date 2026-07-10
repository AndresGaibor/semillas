import * as React from "react";
import { Share2 } from "lucide-react";
import { Card, CardTitle } from "@/componentes/ui/card-base";
import { Boton } from "@/componentes/ui/boton";

export interface CompartirInsigniaWidgetProps {
  nombreInsignia: string;
  imagenInsignia: string;
  onCompartir: () => void;
  compartido: boolean;
}

export const CompartirInsigniaWidget: React.FC<CompartirInsigniaWidgetProps> = ({
  imagenInsignia,
  onCompartir,
  compartido,
}) => {
  return (
    <Card sombra="sm" hoverEffect="none" className="p-6 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <CardTitle>Compartir en Clubes</CardTitle>
        <Share2 size={16} className="text-violet-600" />
      </div>

      <div className="bg-slate-50 border border-dashed border-violet-200 p-4 rounded-2xl flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 shadow-sm mb-3">
          <img src={imagenInsignia} alt="Insignia a compartir" className="w-full h-full object-cover" />
        </div>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          ¡Muestra tus logros con tus amigos de los clubes!
        </p>
        <Boton
          variante={compartido ? "exito" : "secundario"}
          tamano="pequeno"
          anchoCompleto
          iconoIzquierdo={<Share2 size={14} />}
          onClick={onCompartir}
          deshabilitado={compartido}
        >
          {compartido ? "Compartido" : "Compartir insignia"}
        </Boton>
      </div>
    </Card>
  );
};

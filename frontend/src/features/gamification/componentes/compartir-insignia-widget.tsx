import * as React from "react";
import { Share2 } from "lucide-react";

export interface CompartirInsigniaWidgetProps {
  nombreInsignia: string;
  imagenInsignia: string;
  onCompartir: () => void;
  compartido: boolean;
}

export const CompartirInsigniaWidget: React.FC<CompartirInsigniaWidgetProps> = ({
  nombreInsignia,
  imagenInsignia,
  onCompartir,
  compartido,
}) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-black text-slate-800 text-left">Compartir en Clubes</h2>
        <Share2 size={16} className="text-[#7E57C2]" />
      </div>

      <div className="bg-slate-50 border border-dashed border-[#EDE7F6] p-4 rounded-2xl flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 shadow-sm mb-3">
          <img
            src={imagenInsignia}
            alt="Insignia a compartir"
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          ¡Muestra tus logros con tus amigos de los clubes!
        </p>
        <button
          onClick={onCompartir}
          disabled={compartido}
          className="w-full flex items-center justify-center gap-2 bg-[#7E57C2] hover:bg-[#4527A0] disabled:bg-green-600 text-white border-0 py-3 px-4 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm"
        >
          <Share2 size={14} />
          {compartido ? "Compartido" : "Compartir insignia"}
        </button>
      </div>
    </div>
  );
};

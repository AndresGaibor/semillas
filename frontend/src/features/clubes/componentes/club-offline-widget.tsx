import * as React from "react";
import { Download } from "lucide-react";

export interface ClubOfflineWidgetProps {
  temasDescargadosCount: number;
  covers: string[];
  onIrDescargas: () => void;
}

export const ClubOfflineWidget: React.FC<ClubOfflineWidgetProps> = ({
  temasDescargadosCount,
  covers,
  onIrDescargas,
}) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
      <div className="text-left mb-3">
        <h3 className="text-sm font-extrabold text-slate-800">Contenido disponible offline</h3>
        <p className="text-[10px] text-slate-400">{temasDescargadosCount} temas descargados</p>
      </div>

      {/* Fila de miniaturas */}
      <div className="flex gap-2.5 mb-4">
        {covers.map((cover, idx) => (
          <div key={idx} className="flex-1 aspect-square rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
            <img src={cover} alt={`Tema ${idx + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <button
        onClick={onIrDescargas}
        className="w-full flex items-center justify-center gap-2 bg-[#F8FAFC] hover:bg-slate-100 text-slate-600 border border-slate-200 py-3 px-4 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm"
      >
        <Download size={14} />
        Ir a mis descargas
      </button>
    </div>
  );
};

import * as React from "react";
import { Zap } from "lucide-react";

import { ProgresoCircular, BarraProgreso } from "@/componentes/ui/indicadores-progreso";

export interface ProgresoXpWidgetProps {
  xpTotal: number;
  numNivel: number;
  nombreNivel: string;
  xpRestantes: number;
  porcentaje: number;
  onVerDetalles?: () => void;
}

export const ProgresoXpWidget: React.FC<ProgresoXpWidgetProps> = ({
  xpTotal,
  numNivel,
  nombreNivel,
  xpRestantes,
  porcentaje,
  onVerDetalles,
}) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-base font-black text-slate-800 text-left">Tu progreso</h2>
        {onVerDetalles && (
          <button
            onClick={onVerDetalles}
            className="bg-transparent border-0 p-0 text-xs font-bold text-[#7E57C2] hover:underline cursor-pointer"
          >
            Ver detalles
          </button>
        )}
      </div>

      <div className="flex items-center gap-5">
        {/* Progreso Circular */}
        <ProgresoCircular 
          porcentaje={porcentaje} 
          etiqueta="" 
          color="verde" 
          tamano={80} 
          className="[&_span]:hidden" // Ocultar la etiqueta span inferior de la versión circular
        />

        {/* Información */}
        <div className="flex flex-col text-left flex-1 min-w-0">
          <span className="text-base font-extrabold text-indigo-950 truncate">
            Nivel {numNivel}
          </span>
          <span className="text-xs font-extrabold text-green-600 mb-2">
            {nombreNivel}
          </span>
          <div className="flex items-center gap-1.5 text-slate-700 mb-1">
            <Zap size={14} className="text-amber-500 fill-amber-500" />
            <span className="text-xs font-extrabold">{xpTotal} XP</span>
          </div>
          <p className="text-[10px] text-slate-400">
            {xpRestantes} XP para subir
          </p>
        </div>
      </div>

      {/* Barra de progreso lineal */}
      <div className="mt-4">
        <BarraProgreso valor={porcentaje} color="morado" mostrarEtiquetas={false} />
      </div>
    </div>
  );
};

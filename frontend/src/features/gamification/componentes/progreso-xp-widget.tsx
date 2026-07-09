import * as React from "react";
import { Zap } from "lucide-react";

import { CabeceraSeccion } from "@/componentes/ui/cabecera-seccion";
import { ProgresoCircular } from "@/componentes/ui/progreso-circular";
import { BarraProgreso } from "@/componentes/ui/barra-progreso";
import { Card } from "@/componentes/ui/card-base";

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
    <Card sombra="sm" className="p-6 flex flex-col">
      <CabeceraSeccion titulo="Tu progreso" textoBoton={onVerDetalles ? "Ver detalles" : undefined} onBotonClick={onVerDetalles} />

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
    </Card>
  );
};

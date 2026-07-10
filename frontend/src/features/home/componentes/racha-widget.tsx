import * as React from "react";
import { Flame } from "lucide-react";
import { Card } from "@/componentes/ui/card-base";
import { unirClases } from "@/lib/utilidades";

export interface RachaWidgetProps {
  diasRacha: number;
}

export const RachaWidget: React.FC<RachaWidgetProps> = ({ diasRacha }) => {
  const tieneRacha = diasRacha > 0;

  return (
    <Card sombra="sm" hoverEffect="none" className="p-5 flex flex-col justify-between gap-4">
      <div className="flex-1 text-left">
        <h2 className="text-base font-bold text-slate-800 mb-2">Racha actual</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          {tieneRacha
            ? `¡Increíble! Has estudiado ${diasRacha} días seguidos.`
            : "Completa una lección para iniciar tu racha."}
        </p>
      </div>
      <div className={unirClases(
        "mx-auto w-16 h-16 rounded-full flex items-center justify-center",
        tieneRacha ? "bg-amber-100 text-amber-500" : "bg-slate-100 text-slate-300",
      )}>
        <div className="flex items-center gap-1">
          <Flame size={28} />
          {tieneRacha && (
            <span className="text-lg font-bold">{diasRacha}</span>
          )}
        </div>
      </div>
    </Card>
  );
};

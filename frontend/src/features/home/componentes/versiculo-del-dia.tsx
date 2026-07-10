import * as React from "react";
import { BookOpen } from "lucide-react";
import versiculoImg from "@/assets/images/Ilustraciones/Versiculo del dia.png";
import { Card } from "@/componentes/ui/card-base";

export interface VersiculoDelDiaProps {
  texto: string;
  referencia: string;
}

export const VersiculoDelDia: React.FC<VersiculoDelDiaProps> = ({ texto, referencia }) => {
  return (
    <Card sombra="sm" hoverEffect="none" className="relative overflow-hidden p-6 flex items-center gap-6 border-2 border-amber-100">
      <div className="flex-1 z-10">
        <h2 className="mb-3 text-lg font-bold text-amber-900 flex items-center gap-2">
          <BookOpen size={20} className="text-amber-500" /> Versículo del día
        </h2>
        <p className="text-lg italic leading-relaxed text-slate-800 mb-2">
          "{texto}"
        </p>
        <p className="text-right text-sm font-medium text-amber-800">
          - {referencia}
        </p>
      </div>
      <div className="flex-shrink-0 w-[140px] z-10">
        <img
          src={versiculoImg}
          alt="Versículo del día"
          className="w-full rounded-xl shadow-md"
        />
      </div>
    </Card>
  );
};

import * as React from "react";
import { BookOpen, CheckCircle, Flame } from "lucide-react";
import { Card } from "@/componentes/ui/card-base";

export interface ResumenTemasCardProps {
  totales: number;
  completados: number;
  enProgreso: number;
}

export const ResumenTemasCard: React.FC<ResumenTemasCardProps> = ({
  totales,
  completados,
  enProgreso,
}) => {
  return (
    <Card sombra="sm" hoverEffect="none" clase="p-6 rounded-[24px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[17.5px] font-extrabold text-[#1e293b] text-left w-full">
          Resumen de temas
        </h3>
      </div>
      <div className="flex justify-between items-center gap-2">
        <div className="flex flex-col items-center text-center flex-1">
          <div className="w-14 h-14 rounded-full bg-[#f3e8ff] flex items-center justify-center mb-2.5">
            <BookOpen className="size-6 text-[#9333ea]" strokeWidth={2.2} />
          </div>
          <span className="font-bold text-2xl text-slate-800 leading-none">{totales}</span>
          <span className="text-[13px] font-medium text-slate-500 mt-1.5 leading-tight">Temas totales</span>
        </div>

        <div className="flex flex-col items-center text-center flex-1">
          <div className="w-14 h-14 rounded-full bg-[#dcfce7] flex items-center justify-center mb-2.5">
            <CheckCircle className="size-6 text-[#16a34a]" strokeWidth={2.2} />
          </div>
          <span className="font-bold text-2xl text-slate-800 leading-none">{completados}</span>
          <span className="text-[13px] font-medium text-slate-500 mt-1.5 leading-tight">Completados</span>
        </div>

        <div className="flex flex-col items-center text-center flex-1">
          <div className="w-14 h-14 rounded-full bg-[#eff6ff] flex items-center justify-center mb-2.5">
            <Flame className="size-6 text-[#2563eb]" strokeWidth={2.2} />
          </div>
          <span className="font-bold text-2xl text-slate-800 leading-none">{enProgreso}</span>
          <span className="text-[13px] font-medium text-slate-500 mt-1.5 leading-tight">En progreso</span>
        </div>
      </div>
    </Card>
  );
};

import * as React from "react";
import { BookOpen, CheckCircle, Flame } from "lucide-react";
import { TarjetaMetricaCompacta } from "@/componentes/ui/card-metrica";

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
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[17.5px] font-extrabold text-[#1e293b] text-left w-full">
          Resumen de temas
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-3">
        <TarjetaMetricaCompacta
          titulo="Temas totales"
          valor={totales}
          subtexto="Catálogo general"
          icono={<BookOpen className="size-6 text-[#9333ea]" strokeWidth={2.2} />}
          tono={{ fondoIcono: "#f3e8ff", colorSubtexto: "text-slate-500" }}
          alineacion="centrada"
        />

        <TarjetaMetricaCompacta
          titulo="Completados"
          valor={completados}
          subtexto="Ya recorridos"
          icono={<CheckCircle className="size-6 text-[#16a34a]" strokeWidth={2.2} />}
          tono={{ fondoIcono: "#dcfce7", colorSubtexto: "text-slate-500" }}
          alineacion="centrada"
        />

        <TarjetaMetricaCompacta
          titulo="En progreso"
          valor={enProgreso}
          subtexto="Siguiendo el recorrido"
          icono={<Flame className="size-6 text-[#2563eb]" strokeWidth={2.2} />}
          tono={{ fondoIcono: "#eff6ff", colorSubtexto: "text-slate-500" }}
          alineacion="centrada"
        />
      </div>
    </div>
  );
};

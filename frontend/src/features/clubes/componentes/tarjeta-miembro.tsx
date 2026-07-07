import { Zap } from "lucide-react";
import { MAPA_AVATARES } from "@/shared/constants/avatares";

type PropsTarjetaMiembro = {
  posicion: number;
  nombre: string;
  nivel: string;
  xpSemana: number;
  contribuciones: number;
  avatarIndex: string;
};

const COLORES_POSICION: Record<number, string> = {
  1: "bg-amber-100 text-amber-700",
  2: "bg-slate-100 text-slate-700",
  3: "bg-orange-100 text-orange-700",
};

function obtenerColorPosicion(posicion: number): string {
  return COLORES_POSICION[posicion] ?? "bg-slate-50 text-slate-500";
}

export function TarjetaMiembro({
  posicion,
  nombre,
  nivel,
  xpSemana,
  contribuciones,
  avatarIndex,
}: PropsTarjetaMiembro) {
  return (
    <div className="grid grid-cols-12 items-center py-1">
      <div className="col-span-2 flex justify-center">
        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${obtenerColorPosicion(posicion)}`}>
          {posicion}
        </span>
      </div>
      <div className="col-span-4 flex items-center gap-2.5 min-w-0 text-left">
        <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 bg-orange-100 flex-shrink-0">
          <img src={MAPA_AVATARES[avatarIndex]} alt={nombre} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-extrabold text-slate-800 truncate">{nombre}</span>
          <span className="text-[9px] font-semibold text-slate-400 truncate">{nivel}</span>
        </div>
      </div>
      <div className="col-span-3 flex items-center justify-center gap-1">
        <Zap size={11} className="text-amber-500 fill-amber-500" />
        <span className="text-xs font-black text-slate-700">{xpSemana} XP</span>
      </div>
      <span className="col-span-3 text-center text-xs font-semibold text-slate-500">
        {contribuciones} actividades
      </span>
    </div>
  );
}

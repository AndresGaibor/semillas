import { Zap } from "lucide-react";
import { AvatarTexto } from "@/componentes/ui/avatar-texto";
import { resolverAvatar } from "@/shared/constants/avatares";

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
  const avatarUrl = resolverAvatar(avatarIndex);

  return (
    <div className="grid grid-cols-12 items-center py-1">
      <div className="col-span-2 flex justify-center">
        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${obtenerColorPosicion(posicion)}`}>
          {posicion}
        </span>
      </div>
      <div className="col-span-4 min-w-0 text-left">
        <AvatarTexto
          src={avatarUrl}
          alt={nombre}
          titulo={nombre}
          subtitulo={nivel}
          className="gap-2.5"
          avatarClassName="h-8 w-8 rounded-full border border-slate-100 bg-orange-100"
          tituloClassName="text-xs font-extrabold truncate text-slate-800"
          subtituloClassName="text-[9px] font-semibold truncate text-slate-400"
        />
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

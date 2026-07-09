import * as React from "react";
import { BookOpen, Play, Route as RouteIcon, TrendingUp } from "lucide-react";
import { Card } from "@/componentes/ui/card-base";
import { Boton } from "@/componentes/ui/boton";

export type TemaUI = {
  id: string;
  titulo: string;
  descripcion: string;
  senda: string;
  duracion: string;
  xp: number;
  progreso: number;
  favorito: boolean;
  imagenUrl: string | null;
  estado: "porDefecto" | "enProgreso" | "completada";
};

export interface ContinuarAprendiendoCardProps {
  tema: TemaUI | null;
  onContinuar: () => void;
}

export const ContinuarAprendiendoCard: React.FC<ContinuarAprendiendoCardProps> = ({
  tema,
  onContinuar,
}) => {
  if (!tema) {
    return (
      <Card sombra="sm" hoverEffect="none" clase="p-6 rounded-[24px] flex flex-col items-center justify-center text-center gap-3">
        <RouteIcon className="size-8 text-slate-300" />
        <h4 className="text-sm font-bold text-slate-700">¡Al día con tus temas!</h4>
        <p className="text-xs text-slate-400 font-semibold max-w-[200px]">
          No tienes lecciones en progreso. Elige una nueva senda y comienza.
        </p>
      </Card>
    );
  }

  return (
    <Card sombra="sm" hoverEffect="none" clase="p-6 rounded-[24px] flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h3 className="text-[17.5px] font-extrabold text-[#1e293b]">
          Continuar aprendiendo
        </h3>
        <TrendingUp className="size-6 text-[#10b981]" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex gap-3.5 items-center">
          <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 relative overflow-hidden border border-slate-100">
            {tema.imagenUrl ? (
              <img
                src={tema.imagenUrl}
                alt={tema.titulo}
                className="w-full h-full object-cover"
              />
            ) : (
              <BookOpen className="size-6 text-primario" />
            )}
          </div>
          <div className="flex flex-col text-left justify-center">
            <h4 className="text-base font-bold text-slate-800 leading-tight">
              {tema.titulo}
            </h4>
            <p className="text-xs text-[#2563eb] font-bold mt-1">
              En progreso • {tema.progreso}%
            </p>
          </div>
        </div>

        <p className="text-[13px] text-slate-500 font-medium leading-normal text-left">
          Te falta poco para terminar este tema. ¡Sigue avanzando!
        </p>

        <Boton
          variante="contorno"
          className="w-full text-sm py-2.5 border-[#2E9E5B] text-[#2E9E5B] hover:bg-[#2E9E5B]/5 font-bold rounded-xl cursor-pointer bg-white transition-all"
          iconoIzquierdo={<Play className="size-4 fill-[#2E9E5B] text-[#2E9E5B]" />}
          onClick={onContinuar}
        >
          Continuar lección
        </Boton>
      </div>
    </Card>
  );
};

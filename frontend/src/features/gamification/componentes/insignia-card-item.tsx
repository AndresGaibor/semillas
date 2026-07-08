import * as React from "react";
import { Lock, CheckCircle } from "lucide-react";
import { Card } from "@/componentes/ui/card-base";

export interface InsigniaCardItemProps {
  codigo: string;
  nombre: string;
  descripcion: string;
  criterio: string;
  bono_xp: number;
  imagen: string;
  obtenido: boolean;
}

export const InsigniaCardItem: React.FC<InsigniaCardItemProps> = ({
  codigo,
  nombre,
  descripcion,
  criterio,
  bono_xp,
  imagen,
  obtenido,
}) => {
  return (
    <Card
      className={`p-0 overflow-hidden flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
        !obtenido ? "opacity-75 bg-slate-50/50" : "bg-white"
      }`}
    >
      {/* Contenedor de Imagen */}
      <div className="relative mt-6 flex h-[112px] w-[112px] flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-sm sm:h-[130px] sm:w-[130px]">
        {obtenido ? (
          <img
            src={imagen}
            alt={nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center">
            <Lock className="text-slate-400" size={36} />
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5 flex-1 flex flex-col items-center">
        <h3 className="mb-1 text-base font-extrabold leading-tight text-slate-800 sm:text-lg">
          {nombre}
        </h3>
        <p className="text-xs font-semibold text-[#7E57C2] mb-3">
          +{bono_xp} XP • {criterio}
        </p>
        <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1">
          {descripcion}
        </p>
        
        {obtenido ? (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-extrabold bg-green-50 text-green-700 uppercase tracking-wider border border-green-100">
            <CheckCircle size={10} />
            Obtenida
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-500 uppercase tracking-wider border border-slate-200">
            En progreso
          </span>
        )}
      </div>
    </Card>
  );
};

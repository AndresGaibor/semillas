import * as React from "react";
import { Shield, Flame, Heart } from "lucide-react";
import { Card } from "@/componentes/ui/card-base";

export interface ClubLogro {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  tipoIcono: "shield" | "flame" | "heart";
  completado: boolean;
  progresoActual?: number;
  progresoMeta?: number;
}

export interface ClubLogrosCardProps {
  logros: ClubLogro[];
  onVerTodos?: () => void;
}

export const ClubLogrosCard: React.FC<ClubLogrosCardProps> = ({ logros, onVerTodos }) => {
  const getIcon = (tipo: "shield" | "flame" | "heart") => {
    switch (tipo) {
      case "shield":
        return <Shield size={18} />;
      case "flame":
        return <Flame size={18} />;
      case "heart":
        return <Heart size={18} />;
      default:
        return <Shield size={18} />;
    }
  };

  const getIconClass = (tipo: "shield" | "flame" | "heart") => {
    switch (tipo) {
      case "shield":
        return "bg-[#EDE7F6] text-[#7E57C2]";
      case "flame":
        return "bg-orange-50 text-orange-500";
      case "heart":
        return "bg-blue-50 text-blue-500";
      default:
        return "bg-slate-100 text-slate-500";
    }
  };

  return (
    <Card className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-black text-slate-800">Logros del club</h3>
        {onVerTodos && (
          <button
            onClick={onVerTodos}
            className="bg-transparent border-0 p-0 text-xs font-bold text-[#7E57C2] hover:underline cursor-pointer"
          >
            Ver todos
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {logros.map((logro) => {
          const showBar = !logro.completado && logro.progresoActual !== undefined && logro.progresoMeta !== undefined;
          const porcentaje = showBar ? Math.round((logro.progresoActual! / logro.progresoMeta!) * 100) : 0;

          return (
            <div
              key={logro.id}
              className="bg-slate-50/50 border border-slate-100 rounded-2xl p-3.5 flex items-center gap-3 text-left"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getIconClass(logro.tipoIcono)}`}>
                {getIcon(logro.tipoIcono)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-extrabold text-slate-800 leading-tight mb-0.5">{logro.nombre}</h4>
                <p className="text-[10px] text-slate-400">{logro.descripcion}</p>
                {showBar && (
                  <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden mt-1.5">
                    <div 
                      className={`h-full ${logro.tipoIcono === "flame" ? "bg-orange-500" : "bg-blue-500"}`} 
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                )}
              </div>
              
              {logro.completado ? (
                <span className="bg-green-50 text-green-700 border border-green-100 rounded-md text-[9px] font-extrabold uppercase px-2 py-0.5 flex-shrink-0">
                  ✓ Completado
                </span>
              ) : (
                <span className="text-[10px] font-black text-slate-600 flex-shrink-0">
                  {logro.progresoActual} / {logro.progresoMeta}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

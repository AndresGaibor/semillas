import * as React from "react";
import { unirClases } from "@/lib/utilidades";

export interface OpcionBottomNav {
  id: string;
  etiqueta: string;
  icono: React.ReactNode;
}

export interface PropiedadesBottomNav {
  opciones: OpcionBottomNav[];
  activo: string;
  onCambiar: (id: string) => void;
  clase?: string;
}

export const BottomNav: React.FC<PropiedadesBottomNav> = ({
  opciones,
  activo,
  onCambiar,
  clase,
}) => {
  return (
    <div className={unirClases("flex items-center justify-around bg-white border-t border-gray-100 py-2.5 px-4 shadow-md w-full", clase)}>
      {opciones.map((op) => {
        const esActivo = op.id === activo;
        return (
          <button
            key={op.id}
            type="button"
            onClick={() => onCambiar(op.id)}
            className="flex flex-col items-center gap-1 focus:outline-none group relative"
          >
            <span
              className={unirClases(
                "transition-all duration-200",
                esActivo ? "text-[#6C3AED] scale-110" : "text-gray-400 group-hover:text-gray-600"
              )}
            >
              {op.icono}
            </span>
            <span
              className={unirClases(
                "text-[10px] font-bold transition-colors duration-200",
                esActivo ? "text-[#6C3AED]" : "text-gray-400 group-hover:text-gray-600"
              )}
            >
              {op.etiqueta}
            </span>
            {esActivo && (
              <span className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#6C3AED] rounded-t-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};

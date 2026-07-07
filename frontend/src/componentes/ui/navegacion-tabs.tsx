import * as React from "react";
import { unirClases } from "@/lib/utilidades";

// ── 01. Tabs con Línea ───────────────────────────────────────────────────────

export interface PropiedadesTabsLinea {
  tabs: string[];
  activo: string;
  onCambiar: (tab: string) => void;
  clase?: string;
}

export const TabsLinea: React.FC<PropiedadesTabsLinea> = ({
  tabs,
  activo,
  onCambiar,
  clase,
}) => {
  return (
    <div className={unirClases("flex border-b border-[#F1F5F9] w-full", clase)}>
      {tabs.map((tab) => {
        const esActivo = tab === activo;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onCambiar(tab)}
            className={unirClases(
              "px-4 py-2.5 text-[11px] font-bold transition-all border-b-2 -mb-[2px]",
              esActivo
                ? "border-[#6C3AED] text-[#6C3AED]"
                : "border-transparent text-gray-400 hover:text-gray-600"
            )}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};

// ── 02. Pills / Filtros ──────────────────────────────────────────────────────

export interface PropiedadesPillsFiltros {
  opciones: string[];
  activo: string;
  onCambiar: (opcion: string) => void;
  clase?: string;
}

export const PillsFiltros: React.FC<PropiedadesPillsFiltros> = ({
  opciones,
  activo,
  onCambiar,
  clase,
}) => {
  return (
    <div className={unirClases("flex flex-wrap gap-2", clase)}>
      {opciones.map((opcion) => {
        const esActivo = opcion === activo;
        return (
          <button
            key={opcion}
            type="button"
            onClick={() => onCambiar(opcion)}
            className={unirClases(
              "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border",
              esActivo
                ? "bg-[#6C3AED] border-[#6C3AED] text-white shadow-sm"
                : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
            )}
          >
            {opcion}
          </button>
        );
      })}
    </div>
  );
};

// ── 03. Tabs con Fondo (Segmentado) ──────────────────────────────────────────

export interface OpcionSegmentada {
  id: string;
  etiqueta: string;
  icono?: React.ReactNode;
}

export interface PropiedadesTabsSegmentado {
  opciones: OpcionSegmentada[];
  activo: string;
  onCambiar: (id: string) => void;
  clase?: string;
}

export const TabsSegmentado: React.FC<PropiedadesTabsSegmentado> = ({
  opciones,
  activo,
  onCambiar,
  clase,
}) => {
  return (
    <div className={unirClases("inline-flex p-1 bg-[#F1F5F9] rounded-xl", clase)}>
      {opciones.map((op) => {
        const esActivo = op.id === activo;
        return (
          <button
            key={op.id}
            type="button"
            onClick={() => onCambiar(op.id)}
            className={unirClases(
              "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all",
              esActivo
                ? "bg-[#6C3AED] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {op.icono && <span className="flex-shrink-0">{op.icono}</span>}
            <span>{op.etiqueta}</span>
          </button>
        );
      })}
    </div>
  );
};

// ── 04. Tabs con Icono (Bottom Nav Mobile) ───────────────────────────────────

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

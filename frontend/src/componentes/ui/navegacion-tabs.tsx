import * as React from "react";
import { Search } from "lucide-react";
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

export interface OpcionTab {
  id: string;
  label: string;
  count?: number;
  badgeClassName?: string;
}

export interface PropiedadesTabsOpciones {
  opciones: OpcionTab[];
  activo: string;
  onCambiar: (id: string) => void;
  clase?: string;
  variante?: "linea" | "pildora";
}

export const TabsOpciones: React.FC<PropiedadesTabsOpciones> = ({
  opciones,
  activo,
  onCambiar,
  clase,
  variante = "linea",
}) => {
  const esVariantePildora = variante === "pildora";

  return (
    <div
      className={unirClases(
        esVariantePildora
          ? "flex flex-wrap gap-2"
          : "flex gap-6 border-b border-slate-100 pb-px mb-6 text-left select-none overflow-x-auto whitespace-nowrap",
        clase,
      )}
    >
      {opciones.map((opcion) => {
        const esActivo = opcion.id === activo;

        return (
          <button
            key={opcion.id}
            type="button"
            onClick={() => onCambiar(opcion.id)}
            className={unirClases(
              esVariantePildora
                ? "px-4 py-2 rounded-xl text-sm font-bold border-0 cursor-pointer transition-all"
                : "flex items-center gap-2 pb-3 font-bold text-[13px] transition-all border-b-2 outline-none cursor-pointer",
              esActivo
                ? esVariantePildora
                  ? "bg-[#7E57C2] text-white shadow-sm"
                  : "border-[#2e9e5b] text-[#2e9e5b]"
                : esVariantePildora
                  ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  : "border-transparent text-slate-500 hover:text-slate-700",
            )}
          >
            <span>{opcion.label}</span>
            {opcion.count !== undefined && opcion.count > 0 && opcion.id !== "todos" && (
              <span
                className={unirClases(
                  "inline-flex px-2 py-0.5 rounded-full text-[10px]",
                  opcion.badgeClassName,
                )}
              >
                {opcion.count}
              </span>
            )}
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

export interface PropiedadesCampoBusqueda
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  valor: string;
  onChange: (valor: string) => void;
  contenedorClassName?: string;
  inputClassName?: string;
  icono?: React.ReactNode;
}

export const CampoBusqueda = React.forwardRef<HTMLInputElement, PropiedadesCampoBusqueda>(
  (
    {
      valor,
      onChange,
      contenedorClassName,
      inputClassName,
      icono = <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutro size-4" />,
      className,
      ...props
    },
    referencia,
  ) => {
    return (
      <div className={unirClases("relative flex items-center", contenedorClassName)}>
        {icono}
        <input
          ref={referencia}
          value={valor}
          onChange={(event) => onChange(event.target.value)}
          className={unirClases(
            "w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-neutro-oscuro-max outline-none transition-colors focus:border-primario focus:ring-1 focus:ring-primario",
            inputClassName,
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

CampoBusqueda.displayName = "CampoBusqueda";

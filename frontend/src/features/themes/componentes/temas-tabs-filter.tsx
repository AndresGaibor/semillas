import * as React from "react";

export type FiltroTab = "todos" | "completados" | "progreso" | "favoritos";

export interface TemasTabsFilterProps {
  activo: FiltroTab;
  onChange: (tab: FiltroTab) => void;
}

export const TemasTabsFilter: React.FC<TemasTabsFilterProps> = ({ activo, onChange }) => {
  const tabs = [
    { id: "todos" as FiltroTab, label: "Todos los temas" },
    { id: "completados" as FiltroTab, label: "Completados" },
    { id: "progreso" as FiltroTab, label: "En progreso" },
    { id: "favoritos" as FiltroTab, label: "Favoritos" }
  ];

  return (
    <div className="flex gap-8 border-b border-slate-100 mb-6 overflow-x-auto scrollbar-none">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`pb-3 text-sm font-semibold transition-all relative whitespace-nowrap cursor-pointer ${
            activo === tab.id
              ? "text-primario font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-primario after:rounded-t-lg"
              : "text-neutro hover:text-primario"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

import * as React from "react";

export type CategoriaLogro = "todas" | "padre" | "hijo" | "especial";

export interface LogrosTabsFilterProps {
  activo: CategoriaLogro;
  onChange: (tab: CategoriaLogro) => void;
}

export const LogrosTabsFilter: React.FC<LogrosTabsFilterProps> = ({ activo, onChange }) => {
  const tabs: CategoriaLogro[] = ["todas", "padre", "hijo", "especial"];

  return (
    <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-100 pb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-4 py-2 rounded-xl text-sm font-bold border-0 cursor-pointer transition-all capitalize ${
            activo === tab
              ? "bg-[#7E57C2] text-white shadow-sm"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          {tab === "todas" ? "Todas" : tab === "especial" ? "Especiales" : `Senda del ${tab}`}
        </button>
      ))}
    </div>
  );
};

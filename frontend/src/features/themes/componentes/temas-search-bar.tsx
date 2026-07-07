import * as React from "react";
import { Search, Filter } from "lucide-react";

export interface TemasSearchBarProps {
  valor: string;
  onChange: (v: string) => void;
  onFiltrarClick?: () => void;
}

export const TemasSearchBar: React.FC<TemasSearchBarProps> = ({
  valor,
  onChange,
  onFiltrarClick,
}) => {
  return (
    <div className="flex gap-4 mb-6 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutro size-4" />
        <input
          type="text"
          placeholder="Buscar temas..."
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-neutro-oscuro-max outline-none focus:border-primario focus:ring-1 focus:ring-primario transition-colors"
        />
      </div>
      <button
        onClick={onFiltrarClick}
        className="flex items-center gap-2 px-5 py-3 border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-sm font-extrabold text-neutro-oscuro rounded-xl cursor-pointer"
      >
        <Filter className="size-4" /> Filtrar
      </button>
    </div>
  );
};

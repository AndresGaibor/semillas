import * as React from "react";
import { Search } from "lucide-react";

export interface DescargasTabsFilterProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  ageFilter: string;
  onAgeChange: (age: string) => void;
  sortOrder: string;
  onSortChange: (sort: string) => void;
  searchQuery: string;
  onSearchChange: (search: string) => void;
}

export const DescargasTabsFilter: React.FC<DescargasTabsFilterProps> = ({
  activeTab,
  onTabChange,
  ageFilter,
  onAgeChange,
  sortOrder,
  onSortChange,
  searchQuery,
  onSearchChange,
}) => {
  const tabs = ["Todos", "Historias", "Actividades", "Imprimibles", "Canciones"];

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-6 max-sm:gap-4 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`py-3 px-1 border-0 border-b-2 font-extrabold text-sm cursor-pointer transition-all bg-transparent ${
                isActive
                  ? "border-[#7E57C2] text-[#7E57C2]"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Filtros y Búsqueda */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 w-full">
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Dropdown de Edad */}
          <select
            value={ageFilter}
            onChange={(e) => onAgeChange(e.target.value)}
            className="bg-white border border-[#e5e7eb] rounded-xl px-4 py-3 text-sm font-bold text-slate-600 outline-none cursor-pointer focus:border-[#7E57C2]"
          >
            <option>Todas las edades</option>
            <option>Párvulos (3-6)</option>
            <option>Semillas (5-8)</option>
            <option>Exploradores (9-12)</option>
            <option>Embajadores (13-17)</option>
          </select>

          {/* Dropdown de Orden */}
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-white border border-[#e5e7eb] rounded-xl px-4 py-3 text-sm font-bold text-slate-600 outline-none cursor-pointer focus:border-[#7E57C2]"
          >
            <option>Más recientes</option>
            <option>Mayor tamaño</option>
            <option>Menor tamaño</option>
          </select>
        </div>

        {/* Buscador */}
        <div className="relative w-full md:w-80 flex items-center">
          <Search className="absolute left-4 text-slate-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar descargas..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#e5e7eb] rounded-xl text-sm font-sans outline-none focus:border-[#7E57C2] transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

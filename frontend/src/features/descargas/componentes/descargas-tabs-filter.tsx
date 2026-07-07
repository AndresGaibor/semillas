import * as React from "react";
import { TabsOpciones, CampoBusqueda } from "@/componentes/ui/navegacion-tabs";

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
  return (
    <div>
      <TabsOpciones
        activo={activeTab}
        onCambiar={onTabChange}
        opciones={[
          { id: "Todos", label: "Todos" },
          { id: "Historias", label: "Historias" },
          { id: "Actividades", label: "Actividades" },
          { id: "Imprimibles", label: "Imprimibles" },
          { id: "Canciones", label: "Canciones" },
        ]}
        clase="mb-6"
      />

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
        <CampoBusqueda
          valor={searchQuery}
          onChange={onSearchChange}
          placeholder="Buscar descargas..."
          contenedorClassName="w-full md:w-80"
          inputClassName="font-sans focus:border-[#7E57C2] focus:ring-[#7E57C2]/20"
        />
      </div>
    </div>
  );
};

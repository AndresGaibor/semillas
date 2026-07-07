import { Button } from "@/componentes/ui/button";
import { CampoBusqueda } from "@/componentes/ui/navegacion-tabs";

type FilterItem = {
  id: string;
  nombre: string;
};

type AdminThemesFiltersProps = {
  searchValue: string;
  onSearchChange: (val: string) => void;
  selectedSendaId: string;
  onSendaChange: (val: string) => void;
  selectedAgeGroupId: string;
  onAgeGroupChange: (val: string) => void;
  sendas: FilterItem[];
  ageGroups: FilterItem[];
  onMasFiltros?: () => void;
};

export function AdminThemesFilters({
  searchValue,
  onSearchChange,
  selectedSendaId,
  onSendaChange,
  selectedAgeGroupId,
  onAgeGroupChange,
  sendas,
  ageGroups,
  onMasFiltros,
}: AdminThemesFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-3 w-full bg-white rounded-3xl border border-slate-100 p-5 shadow-sm select-none">
      {/* Search Input */}
      <CampoBusqueda
        valor={searchValue}
        onChange={onSearchChange}
        placeholder="Buscar por título o palabra clave..."
        contenedorClassName="flex-1"
        inputClassName="rounded-full pl-10 py-2.5 text-[13px] focus:ring-2 focus:ring-[#2E9E5B]/30 focus:border-[#2E9E5B] placeholder:text-slate-400 placeholder:font-normal"
      />

      {/* Senda Select */}
      <div className="w-full lg:w-48 relative">
        <select
          value={selectedSendaId}
          onChange={(e) => onSendaChange(e.target.value)}
          className="w-full px-4 pr-10 py-2.5 rounded-full border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2E9E5B]/30 focus:border-[#2E9E5B] transition-all appearance-none cursor-pointer"
        >
          <option value="">Todas las sendas</option>
          {sendas.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))}
        </select>
        <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
      </div>

      {/* Age Group Select */}
      <div className="w-full lg:w-48 relative">
        <select
          value={selectedAgeGroupId}
          onChange={(e) => onAgeGroupChange(e.target.value)}
          className="w-full px-4 pr-10 py-2.5 rounded-full border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2E9E5B]/30 focus:border-[#2E9E5B] transition-all appearance-none cursor-pointer"
        >
          <option value="">Todas las franjas</option>
          {ageGroups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.nombre}
            </option>
          ))}
        </select>
        <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
      </div>

      {/* Más filtros Button */}
      <button
        type="button"
        onClick={onMasFiltros}
        disabled={!onMasFiltros}
        className="rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-[13px] font-semibold text-slate-600 h-[42px] px-5 flex items-center justify-center gap-2 transition-colors outline-none cursor-pointer"
      >
        <i className="fa-solid fa-filter text-slate-400 text-xs" />
        Más filtros
      </button>
    </div>
  );
}

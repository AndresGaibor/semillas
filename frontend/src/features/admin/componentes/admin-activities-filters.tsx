import type { Tema } from "@/shared/api/api";

export type AdminActivitiesFiltersProps = {
  searchValue: string;
  onSearchChange: (val: string) => void;
  selectedTemaId: string;
  onTemaChange: (val: string) => void;
  temasBase: Tema[];
  selectedSendaId: string;
  onSendaChange: (val: string) => void;
  sendasBase: any[];
  selectedAgeGroupId: string;
  onAgeGroupChange: (val: string) => void;
  ageGroupsBase: any[];
  onClear: () => void;
  tieneFiltros: boolean;
};

export function AdminActivitiesFilters({
  searchValue,
  onSearchChange,
  selectedTemaId,
  onTemaChange,
  temasBase,
  selectedSendaId,
  onSendaChange,
  sendasBase,
  selectedAgeGroupId,
  onAgeGroupChange,
  ageGroupsBase,
  onClear,
  tieneFiltros,
}: AdminActivitiesFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        <input
          type="text"
          placeholder="Buscar actividades..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-full border border-slate-100 bg-slate-50/50 font-semibold text-[13px] text-slate-800 placeholder-slate-400 focus:border-[#2e9e5b] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2e9e5b]/10 transition-all"
        />
      </div>

      <div className="relative min-w-[150px]">
        <select
          value={selectedTemaId}
          onChange={(e) => onTemaChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-full border border-slate-100 bg-slate-50/50 font-semibold text-[13px] text-slate-700 appearance-none focus:border-[#2e9e5b] focus:bg-white focus:outline-hidden cursor-pointer"
        >
          <option value="">Todos los temas</option>
          {temasBase.map((t) => (
            <option key={t.id} value={t.id}>{t.titulo}</option>
          ))}
        </select>
        <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
      </div>

      <div className="relative min-w-[150px]">
        <select
          value={selectedSendaId}
          onChange={(e) => onSendaChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-full border border-slate-100 bg-slate-50/50 font-semibold text-[13px] text-slate-700 appearance-none focus:border-[#2e9e5b] focus:bg-white focus:outline-hidden cursor-pointer"
        >
          <option value="">Todas las sendas</option>
          {sendasBase.map((s) => (
            <option key={s.id} value={s.id}>{s.nombre}</option>
          ))}
        </select>
        <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
      </div>

      <div className="relative min-w-[150px]">
        <select
          value={selectedAgeGroupId}
          onChange={(e) => onAgeGroupChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-full border border-slate-100 bg-slate-50/50 font-semibold text-[13px] text-slate-700 appearance-none focus:border-[#2e9e5b] focus:bg-white focus:outline-hidden cursor-pointer"
        >
          <option value="">Todas las franjas</option>
          {ageGroupsBase.map((g) => (
            <option key={g.id} value={g.id}>{g.nombre}</option>
          ))}
        </select>
        <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
      </div>

      {tieneFiltros && (
        <button
          onClick={onClear}
          className="px-4 py-2 rounded-full border border-slate-200 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}

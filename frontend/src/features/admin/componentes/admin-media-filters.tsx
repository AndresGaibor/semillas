import { CampoBusqueda } from "@/componentes/ui/navegacion-tabs";
import type { TipoMedia } from "./admin-media-type-tabs";

type Props = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  activeTab: TipoMedia;
  onTabChange: (tab: TipoMedia) => void;
  selectedFolder: string;
  onFolderChange: (folder: string) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
};

export function AdminMediaFilters({
  searchValue,
  onSearchChange,
  activeTab,
  onTabChange,
  selectedFolder,
  onFolderChange,
  selectedSort,
  onSortChange,
}: Props) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm text-left flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <CampoBusqueda
          valor={searchValue}
          onChange={onSearchChange}
          placeholder="Buscar por nombre o etiqueta..."
          ariaLabel="Buscar recursos multimedia"
          contenedorClassName="flex-1 min-w-[220px]"
          inputClassName="rounded-full border-slate-100 bg-slate-50/50 text-[13px] text-slate-800 placeholder-slate-400 focus:border-[#2e9e5b] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2e9e5b]/10 py-2.5"
          icono={
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          }
        />

        <div className="relative min-w-[150px]">
          <select
            value={activeTab}
            onChange={(e) => onTabChange(e.target.value as TipoMedia)}
            className="w-full px-4 py-2.5 rounded-full border border-slate-100 bg-slate-50/50 font-semibold text-[13px] text-slate-700 appearance-none focus:border-[#2e9e5b] focus:bg-white focus:outline-hidden cursor-pointer"
          >
            <option value="">Todos los tipos</option>
            <option value="imagen">Imágenes</option>
            <option value="audio">Audios</option>
            <option value="video">Videos</option>
            <option value="documento">Documentos</option>
          </select>
          <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
        </div>

        <div className="relative min-w-[150px]">
          <select
            value={selectedFolder}
            onChange={(e) => onFolderChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-full border border-slate-100 bg-slate-50/50 font-semibold text-[13px] text-slate-700 appearance-none focus:border-[#2e9e5b] focus:bg-white focus:outline-hidden cursor-pointer"
          >
            <option value="">Todas las carpetas</option>
            <option value="Ilustraciones">Ilustraciones</option>
            <option value="Documentos">Documentos</option>
          </select>
          <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
        </div>

        <div className="relative min-w-[150px]">
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-full border border-slate-100 bg-slate-50/50 font-semibold text-[13px] text-slate-700 appearance-none focus:border-[#2e9e5b] focus:bg-white focus:outline-hidden cursor-pointer"
          >
            <option value="recientes">M&aacute;s recientes</option>
            <option value="antiguos">M&aacute;s antiguos</option>
          </select>
          <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
        </div>

        <button
          className="w-[42px] h-[42px] rounded-full border border-slate-100 bg-slate-50/50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-sliders text-sm" />
        </button>
      </div>
    </div>
  );
}

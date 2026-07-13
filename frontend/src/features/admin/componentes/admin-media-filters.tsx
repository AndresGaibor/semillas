import { CampoBusqueda } from "@/componentes/ui/navegacion-tabs";
import { SelectFiltro } from "@/componentes/ui/select-filtro";
import type { TipoMedia } from "./admin-media-type-tabs";

type CarpetaOpcion = { id: string; nombre: string };
type OrdenOpcion = { id: string; nombre: string };

const OPCIONES_TIPO: { id: string; nombre: string }[] = [
  { id: "imagen", nombre: "Imágenes" },
  { id: "audio", nombre: "Audios" },
  { id: "video", nombre: "Videos" },
  { id: "documento", nombre: "Documentos" },
];

const OPCIONES_CARPETA: CarpetaOpcion[] = [
  { id: "Ilustraciones", nombre: "Ilustraciones" },
  { id: "Audios", nombre: "Audios" },
  { id: "Videos", nombre: "Videos" },
  { id: "Documentos", nombre: "Documentos" },
];

const OPCIONES_ORDEN: OrdenOpcion[] = [
  { id: "recientes", nombre: "Más recientes" },
  { id: "antiguos", nombre: "Más antiguos" },
];

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
    <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm text-left flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <CampoBusqueda
          valor={searchValue}
          onChange={onSearchChange}
          placeholder="Buscar por nombre o etiqueta..."
          ariaLabel="Buscar recursos multimedia"
          contenedorClassName="flex-1 min-w-[220px]"
          inputClassName="rounded-full border-slate-200 bg-slate-50 text-[13px] text-slate-800 placeholder-emerald-400/50 focus:border-emerald-600 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600/10 py-2.5"
          icono={
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          }
        />

        <div className="w-full lg:w-48">
          <SelectFiltro
            opciones={OPCIONES_TIPO}
            placeholder="Todos los tipos"
            etiquetaAria="Filtrar por tipo de recurso"
            value={activeTab}
            onChange={(e) => onTabChange(e.target.value as TipoMedia)}
          />
        </div>

        <div className="w-full lg:w-48">
          <SelectFiltro
            opciones={OPCIONES_CARPETA}
            placeholder="Todas las carpetas"
            etiquetaAria="Filtrar por carpeta"
            value={selectedFolder}
            onChange={(e) => onFolderChange(e.target.value)}
          />
        </div>

        <div className="w-full lg:w-48">
          <SelectFiltro
            opciones={OPCIONES_ORDEN}
            placeholder="Más recientes"
            etiquetaAria="Ordenar por"
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
          />
        </div>

      </div>
    </div>
  );
}

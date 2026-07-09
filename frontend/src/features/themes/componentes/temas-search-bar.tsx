import { Filter } from "lucide-react";
import { CampoBusqueda } from "@/componentes/ui/navegacion-tabs";

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
      <CampoBusqueda
        valor={valor}
        onChange={onChange}
        placeholder="Buscar temas..."
        contenedorClassName="flex-1 min-w-[200px]"
      />
      {onFiltrarClick && (
        <button
          onClick={onFiltrarClick}
          className="flex items-center gap-2 px-5 py-3 border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-sm font-extrabold text-neutro-oscuro rounded-xl cursor-pointer"
        >
          <Filter className="size-4" /> Filtrar
        </button>
      )}
    </div>
  );
};

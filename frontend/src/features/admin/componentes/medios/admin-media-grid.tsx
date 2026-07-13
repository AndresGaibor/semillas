import { Paginacion } from "@/componentes/ui/paginacion";
import { Card } from "@/componentes/ui/card-base";
import { ImageWithFallback } from "@/componentes/ui/image-with-fallback";
import { MediaTypeBadge } from "./media-type-badge";
import type { MediaCardItem } from "../../admin-media.types";

type Props = {
  items: MediaCardItem[];
  totalItems: number;
  selectedId: string;
  onSelect: (id: string) => void;
  paginaActual: number;
  porPagina: number;
  onCambiarPagina: (pagina: number) => void;
  onCambiarPorPagina: (n: number) => void;
};

export function AdminMediaGrid({
  items,
  totalItems,
  selectedId,
  onSelect,
  paginaActual,
  porPagina,
  onCambiarPagina,
  onCambiarPorPagina,
}: Props) {
  const visibleCount = items.length;

  return (
    <>
      <div className="text-xs text-slate-400 font-bold select-none">
        {totalItems} recursos encontrados
      </div>

      {visibleCount === 0 ? (
        <Card sombra="sm" className="flex flex-col items-center justify-center py-20 text-center select-none">
          <i className="fa-regular fa-image text-slate-300 text-5xl mb-4" />
          <p className="text-sm text-slate-500 font-extrabold">
            No se encontraron recursos
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Intenta ajustar los filtros de b&uacute;squeda.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {items.map((item) => {
            const isSelected = item.id === selectedId;
            return (
              <Card
                key={item.id}
                onClick={() => onSelect(item.id)}
                sombra={isSelected ? "md" : "sm"}
                hoverEffect="none"
                className={`p-3 flex flex-col text-left transition-all relative cursor-pointer select-none group ${
                  isSelected
                    ? "border-2 border-green-600 shadow-md shadow-green-600/20"
                    : "border-slate-200 hover:border-emerald-600 hover:shadow-sm"
                }`}
              >
                <div className="w-full h-32 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/50 relative flex items-center justify-center shrink-0">
                  <ImageWithFallback src={item.imgUrl} alt={item.nombre} tipo={item.tipo} />

                  <div className="absolute left-2.5 bottom-2.5 w-6 h-6 rounded-lg bg-black/40 backdrop-blur-xs flex items-center justify-center text-white text-[11px]">
                    {item.tipo === "imagen" && <i className="fa-regular fa-image" />}
                    {item.tipo === "audio" && <i className="fa-solid fa-volume-high" />}
                    {item.tipo === "video" && <i className="fa-solid fa-circle-play" />}
                    {item.tipo === "documento" && <i className="fa-solid fa-file-pdf" />}
                  </div>

                  {isSelected && (
                    <div className="absolute left-2.5 top-2.5 w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-[10px] shadow-sm">
                      <i className="fa-solid fa-check" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col mt-3.5 min-w-0">
                  <span className="font-extrabold text-slate-800 text-xs truncate group-hover:text-green-600 transition-colors sm:text-sm">
                    {item.nombre}
                  </span>

                  <div className="flex items-center mt-1">
                    <MediaTypeBadge tipo={item.tipo} />
                  </div>

                  <div className="mt-3 text-xs text-slate-400 font-bold">
                    {item.usadoEnCount === null ? "Uso no calculado" : `Usado en ${item.usadoEnCount} contenidos`}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Paginacion
        total={totalItems}
        paginaActual={paginaActual}
        porPagina={porPagina}
        onCambiarPagina={onCambiarPagina}
        onCambiarPorPagina={onCambiarPorPagina}
      />
    </>
  );
}

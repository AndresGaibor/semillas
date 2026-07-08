import { Paginacion } from "@/componentes/ui/paginacion";
import type { MediaCardItem } from "../__mocks__/medios.mock";

type Props = {
  items: MediaCardItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  paginaActual: number;
  porPagina: number;
  onCambiarPagina: (pagina: number) => void;
  onCambiarPorPagina: (n: number) => void;
};

export function AdminMediaGrid({
  items,
  selectedId,
  onSelect,
  paginaActual,
  porPagina,
  onCambiarPagina,
  onCambiarPorPagina,
}: Props) {
  const total = items.length;

  return (
    <>
      <div className="text-[12px] text-slate-400 font-bold select-none">
        {total} recursos encontrados
      </div>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center select-none bg-white rounded-3xl border border-slate-100">
          <i className="fa-regular fa-image text-slate-300 text-5xl mb-4" />
          <p className="text-sm text-slate-500 font-extrabold">
            No se encontraron recursos
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Intenta ajustar los filtros de b&uacute;squeda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {items.map((item) => {
            const isSelected = item.id === selectedId;
            return (
              <div
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`bg-white rounded-3xl border p-3 flex flex-col text-left transition-all relative cursor-pointer select-none group ${
                  isSelected
                    ? "border-2 border-[#2e9e5b] shadow-md shadow-[#2e9e5b]/5"
                    : "border-slate-100 hover:border-[#2e9e5b]/40 hover:shadow-sm"
                }`}
              >
                <div className="w-full h-32 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100/50 relative flex items-center justify-center shrink-0">
                  <img
                    src={item.imgUrl}
                    alt={item.nombre}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute left-2.5 bottom-2.5 w-6 h-6 rounded-lg bg-black/40 backdrop-blur-xs flex items-center justify-center text-white text-[11px]">
                    {item.tipo === "imagen" && <i className="fa-regular fa-image" />}
                    {item.tipo === "audio" && <i className="fa-solid fa-volume-high" />}
                    {item.tipo === "video" && <i className="fa-solid fa-circle-play" />}
                    {item.tipo === "documento" && <i className="fa-solid fa-file-pdf" />}
                  </div>

                  {isSelected && (
                    <div className="absolute left-2.5 top-2.5 w-6 h-6 rounded-full bg-[#2e9e5b] flex items-center justify-center text-white text-[10px] shadow-sm">
                      <i className="fa-solid fa-check" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col mt-3.5 min-w-0">
                  <span className="font-extrabold text-slate-800 text-[12.5px] truncate group-hover:text-[#2e9e5b] transition-colors">
                    {item.nombre}
                  </span>

                  <div className="flex items-center mt-1">
                    {item.tipo === "imagen" ? (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-[#eefcf4] text-[#2e9e5b] uppercase tracking-wider">
                        Imagen
                      </span>
                    ) : item.tipo === "audio" ? (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-[#6c3aed]/10 text-[#6c3aed] uppercase tracking-wider">
                        Audio
                      </span>
                    ) : item.tipo === "video" ? (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-[#ee6c4d]/10 text-[#ee6c4d] uppercase tracking-wider">
                        Video
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-[#17a398]/10 text-[#17a398] uppercase tracking-wider">
                        Documento
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400 font-bold">
                    <span>Usado en {item.usadoEnCount} contenidos</span>

                    <button
                      title="Opciones"
                      className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <i className="fa-solid fa-ellipsis" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Paginacion
        total={total}
        paginaActual={paginaActual}
        porPagina={porPagina}
        onCambiarPagina={onCambiarPagina}
        onCambiarPorPagina={onCambiarPorPagina}
      />
    </>
  );
}

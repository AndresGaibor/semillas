import type { MediaCardItem } from "../__mocks__/medios.mock";

type Props = {
  selectedResource: MediaCardItem | null;
  onDelete: (id: string) => void;
};

export function AdminMediaDetailPanel({ selectedResource, onDelete }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex flex-col text-left">
      <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
        <h3 className="font-extrabold text-slate-800 text-sm">
          Detalles del recurso
        </h3>
        <button
          title="Cerrar detalles"
          className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-xs" />
        </button>
      </div>

      {!selectedResource ? (
        <div className="flex flex-col items-center justify-center py-16 text-center select-none">
          <i className="fa-regular fa-image text-slate-350 text-4xl mb-3.5" />
          <p className="text-[12px] text-slate-500 font-extrabold">
            Ning&uacute;n recurso seleccionado
          </p>
          <p className="text-[11px] text-slate-400 mt-1 leading-normal max-w-[200px]">
            Selecciona un elemento de la galer&iacute;a para ver sus detalles y
            metadatos.
          </p>
        </div>
      ) : (
        <>
          <div className="w-full h-44 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <img
              src={selectedResource.imgUrl}
              alt={selectedResource.nombre}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col mt-4">
            <h4 className="font-black text-slate-800 text-[14px] break-all">
              {selectedResource.nombre}
            </h4>

            <div className="flex mt-1">
              {selectedResource.tipo === "imagen" ? (
                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-[#eefcf4] text-[#2e9e5b] uppercase tracking-wider">
                  Imagen
                </span>
              ) : selectedResource.tipo === "audio" ? (
                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-[#6c3aed]/10 text-[#6c3aed] uppercase tracking-wider">
                  Audio
                </span>
              ) : selectedResource.tipo === "video" ? (
                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-[#ee6c4d]/10 text-[#ee6c4d] uppercase tracking-wider">
                  Video
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-[#17a398]/10 text-[#17a398] uppercase tracking-wider">
                  Documento
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] font-semibold border-b border-slate-50 py-3 mt-2 select-none">
              <span className="text-slate-400">Usado en:</span>
              <span className="font-extrabold text-slate-800">
                {selectedResource.usadoEnCount} contenidos
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-semibold border-b border-slate-50 py-3 select-none">
              <span className="text-slate-400">Carpeta:</span>
              <span className="font-extrabold text-slate-800">
                {selectedResource.carpeta}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-semibold border-b border-slate-50 py-3 select-none">
              <span className="text-slate-400">Subido por:</span>
              <span className="font-extrabold text-slate-800">
                {selectedResource.subidoPor}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-semibold border-b border-slate-50 py-3 select-none">
              <span className="text-slate-400">Fecha de subida:</span>
              <span className="font-extrabold text-slate-800">
                {selectedResource.fechaSubido}
              </span>
            </div>

            <h4 className="font-extrabold text-slate-800 text-xs mt-5 mb-2 select-none">
              Informaci&oacute;n t&eacute;cnica
            </h4>
            <div className="flex flex-col gap-2.5 text-[11px] font-semibold text-slate-650">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Tama&ntilde;o del archivo:</span>
                <span className="font-extrabold text-slate-800">
                  {selectedResource.tamano}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Formato:</span>
                <span className="font-extrabold text-slate-800">
                  {selectedResource.formato}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Resoluci&oacute;n:</span>
                <span className="font-extrabold text-slate-800">
                  {selectedResource.resolucion}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Dimensiones:</span>
                <span className="font-extrabold text-slate-800">
                  {selectedResource.dimensiones}
                </span>
              </div>
            </div>

            <h4 className="font-extrabold text-slate-800 text-xs mt-5 mb-2 select-none">
              Texto alternativo (Alt)
            </h4>
            <p className="text-[11px] font-semibold text-slate-500 bg-slate-50 rounded-xl p-3 border border-slate-100 leading-relaxed text-left">
              {selectedResource.altText}
            </p>

            <h4 className="font-extrabold text-slate-800 text-xs mt-5 mb-3 select-none">
              Etiquetas
            </h4>
            <div className="flex flex-wrap gap-1.5 select-none">
              {selectedResource.etiquetas.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10.5px] font-extrabold text-slate-600"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-2.5 mt-6 pt-5 border-t border-slate-50 select-none">
              <button
                type="button"
                className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-pen text-[10px]" />
                Editar informaci&oacute;n
              </button>

              <button
                onClick={() => onDelete(selectedResource.id)}
                className="w-full bg-white hover:bg-red-50/50 border border-red-200 text-red-650 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-trash text-[10px]" />
                Eliminar recurso
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

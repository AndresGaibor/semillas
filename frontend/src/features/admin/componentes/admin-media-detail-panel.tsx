import type { MediaCardItem } from "../admin-media.types";
import { Boton } from "@/componentes/ui/boton";
import { Card } from "@/componentes/ui/card-base";
import { EmptyState } from "@/componentes/ui/empty-state";
import { ImageWithFallback } from "@/componentes/ui/image-with-fallback";
import { DetailRow } from "@/componentes/ui/detail-row";
import { MediaTypeBadge } from "./media-type-badge";

type Props = {
  selectedResource: MediaCardItem | null;
  onDelete: (id: string) => void;
};

export function AdminMediaDetailPanel({ selectedResource, onDelete }: Props) {
  return (
    <Card sombra="sm" className="p-5 flex flex-col text-left">
      <div className="flex items-center justify-between mb-4 border-b border-[#1a3a2a] pb-3">
        <h3 className="font-extrabold text-emerald-50 text-sm">
          Detalles del recurso
        </h3>

      </div>

      {!selectedResource ? (
        <div className="flex flex-col items-center justify-center py-16 text-center select-none">
          <i className="fa-regular fa-image text-emerald-400/30 text-4xl mb-3.5" />
          <EmptyState
            mensaje="Ning&uacute;n recurso seleccionado"
            className="py-0 text-xs text-emerald-300/60 font-extrabold"
          />
          <p className="text-xs text-emerald-400/50 mt-1 leading-normal max-w-[200px]">
            Selecciona un elemento de la galer&iacute;a para ver sus detalles y
            metadatos.
          </p>
        </div>
      ) : (
        <>
          <div className="w-full h-44 rounded-2xl overflow-hidden bg-[#0d1f17] border border-[#1a3a2a] flex items-center justify-center shrink-0">
            <ImageWithFallback src={selectedResource.imgUrl} alt={selectedResource.nombre} tipo={selectedResource.tipo} />
          </div>

          <div className="flex flex-col mt-4">
            <h4 className="font-black text-emerald-50 text-sm md:text-base break-all">
              {selectedResource.nombre}
            </h4>

            <div className="flex mt-1">
              <MediaTypeBadge tipo={selectedResource.tipo} />
            </div>

            <DetailRow label="Usado en" value={selectedResource.usadoEnCount === null ? "No calculado" : `${selectedResource.usadoEnCount} contenidos`} className="mt-2" />
            <DetailRow label="Carpeta" value={selectedResource.carpeta} />
            <DetailRow label="Subido por" value={selectedResource.subidoPor} />
            <DetailRow label="Fecha de subida" value={selectedResource.fechaSubido} />

            <h4 className="font-extrabold text-emerald-50 text-xs mt-5 mb-2 select-none">
              Informaci&oacute;n t&eacute;cnica
            </h4>
            <div className="flex flex-col gap-2.5 text-xs font-semibold text-emerald-200/70">
              <DetailRow label="Tama&ntilde;o del archivo" value={selectedResource.tamano} noBorder />
              <DetailRow label="Formato" value={selectedResource.formato} noBorder />
              <DetailRow label="Resoluci&oacute;n" value={selectedResource.resolucion} noBorder />
              <DetailRow label="Dimensiones" value={selectedResource.dimensiones} noBorder />
            </div>

            <h4 className="font-extrabold text-emerald-50 text-xs mt-5 mb-2 select-none">
              Texto alternativo (Alt)
            </h4>
            <p className="text-xs font-semibold text-emerald-300/60 bg-[#0d1f17] rounded-xl p-3 border border-[#1a3a2a] leading-relaxed text-left">
              {selectedResource.altText}
            </p>

            <h4 className="font-extrabold text-emerald-50 text-xs mt-5 mb-3 select-none">
              Etiquetas
            </h4>
            <div className="flex flex-wrap gap-1.5 select-none">
              {selectedResource.etiquetas.length === 0 ? (
                <span className="text-xs font-semibold text-emerald-400/50">Sin etiquetas</span>
              ) : selectedResource.etiquetas.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-full bg-[#0d1f17] border border-[#1a3a2a] text-xs font-extrabold text-emerald-200/70"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-2.5 mt-6 pt-5 border-t border-[#1a3a2a] select-none">
              <Boton
                variante="peligroContorno"
                tamano="mediano"
                onClick={() => onDelete(selectedResource.id)}
                clase="w-full text-xs"
              >
                <i className="fa-solid fa-trash text-[10px]" />
                Eliminar recurso
              </Boton>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}



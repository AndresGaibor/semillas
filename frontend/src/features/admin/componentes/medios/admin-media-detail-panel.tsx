import type { ReactNode } from "react";
import {
  AlertTriangle,
  Copy,
  ExternalLink,
  FileAudio,
  FileText,
  Info,
  Trash2,
  X,
} from "lucide-react";

import { Boton } from "@/componentes/ui/boton";
import type { MediaCardItem } from "../../admin-media.types";
import { MediaTypeBadge } from "./media-type-badge";

type Props = {
  selectedResource: MediaCardItem;
  onClose: () => void;
  onDelete: (id: string) => void;
};

export function AdminMediaDetailPanel({
  selectedResource,
  onClose,
  onDelete,
}: Props) {
  const copyUrl = async () => {
    if (!globalThis.navigator?.clipboard) return;
    await globalThis.navigator.clipboard.writeText(selectedResource.imgUrl);
  };

  return (
    <aside className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm xl:sticky xl:top-6 xl:max-h-[calc(100dvh-9rem)]">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
            Inspector de medios
          </p>
          <h2 className="mt-1 text-lg font-black text-slate-900">
            Detalles del recurso
          </h2>
        </div>
        <button
          type="button"
          aria-label="Cerrar inspector"
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        >
          <X size={17} />
        </button>
      </div>

      <div className="space-y-5 overflow-y-auto p-5 xl:max-h-[calc(100dvh-14rem)]">
        <ResourcePreview resource={selectedResource} />

        <section>
          <div className="flex flex-wrap items-center gap-2">
            <MediaTypeBadge tipo={selectedResource.tipo} />
            {selectedResource.tipo === "imagen" && !selectedResource.altText ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-extrabold text-amber-700">
                <AlertTriangle size={12} /> Accesibilidad pendiente
              </span>
            ) : null}
          </div>
          <h3 className="mt-3 break-words text-base font-black leading-snug text-slate-900">
            {selectedResource.nombre}
          </h3>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            {selectedResource.tipoMime ?? "Formato no disponible"}
          </p>
        </section>

        <div className="grid grid-cols-2 gap-2">
          <ActionButton
            icon={<Copy size={15} />}
            label="Copiar URL"
            onClick={() => void copyUrl()}
          />
          <ActionLink
            icon={<ExternalLink size={15} />}
            label="Abrir archivo"
            href={selectedResource.imgUrl}
          />
        </div>

        <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <h4 className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
            Información técnica
          </h4>
          <dl className="mt-3 space-y-3">
            <MetadataRow label="Tamaño" value={selectedResource.tamano} />
            <MetadataRow label="Formato" value={selectedResource.formato} />
            <MetadataRow
              label="Dimensiones"
              value={selectedResource.dimensiones}
            />
            {selectedResource.duracionSeg !== null ? (
              <MetadataRow
                label="Duración"
                value={formatDuration(selectedResource.duracionSeg)}
              />
            ) : null}
            <MetadataRow
              label="Fecha de carga"
              value={selectedResource.fechaSubido}
            />
            <MetadataRow
              label="Subido por"
              value={selectedResource.subidoPor ?? "Usuario no disponible"}
            />
          </dl>
        </section>

        <section className="rounded-2xl border border-slate-200 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
              Uso del recurso
            </h4>
            <Info size={15} className="text-slate-400" aria-hidden="true" />
          </div>
          <p className="mt-2 text-sm font-bold text-slate-800">
            {selectedResource.usadoEnCount === null
              ? "Referencias no disponibles"
              : selectedResource.usadoEnCount === 0
                ? "No está vinculado a contenido"
                : `Usado en ${selectedResource.usadoEnCount} contenidos`}
          </p>
          {selectedResource.usadoEnCount === null ? (
            <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
              El backend todavía no entrega el detalle de dónde se utiliza este
              archivo.
            </p>
          ) : null}
        </section>

        <section className="rounded-2xl border border-slate-200 p-4">
          <h4 className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
            {selectedResource.tipo === "imagen"
              ? "Texto alternativo"
              : "Descripción"}
          </h4>
          <p
            className={`mt-2 text-sm font-medium leading-relaxed ${
              selectedResource.altText ? "text-slate-700" : "text-amber-700"
            }`}
          >
            {selectedResource.altText ??
              (selectedResource.tipo === "imagen"
                ? "Esta imagen necesita una descripción accesible."
                : "Este recurso no tiene descripción.")}
          </p>
        </section>

        <div className="border-t border-slate-200 pt-5">
          <Boton
            variante="peligroContorno"
            tamano="mediano"
            onClick={() => onDelete(selectedResource.id)}
            clase="w-full text-xs"
          >
            <Trash2 size={14} />
            Eliminar recurso
          </Boton>
        </div>
      </div>
    </aside>
  );
}

function ResourcePreview({ resource }: { resource: MediaCardItem }) {
  if (resource.tipo === "imagen") {
    return (
      <div className="flex min-h-52 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        <img
          src={resource.imgUrl}
          alt={resource.altText ?? resource.nombre}
          className="max-h-72 w-full object-contain"
        />
      </div>
    );
  }

  if (resource.tipo === "video") {
    return (
      <video
        src={resource.imgUrl}
        controls
        preload="metadata"
        className="max-h-72 w-full rounded-2xl border border-slate-200 bg-slate-950"
      />
    );
  }

  if (resource.tipo === "audio") {
    return (
      <div className="flex min-h-44 flex-col items-center justify-center gap-5 rounded-2xl border border-violet-100 bg-violet-50 px-5 text-violet-700">
        <FileAudio size={42} aria-hidden="true" />
        <audio src={resource.imgUrl} controls preload="metadata" className="w-full" />
      </div>
    );
  }

  return (
    <a
      href={resource.imgUrl}
      target="_blank"
      rel="noreferrer"
      className="flex min-h-44 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
    >
      <FileText size={42} aria-hidden="true" />
      <span className="text-sm font-extrabold">Abrir documento</span>
    </a>
  );
}

function MetadataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-xs">
      <dt className="font-semibold text-slate-500">{label}</dt>
      <dd className="max-w-[60%] break-words text-right font-extrabold text-slate-700">
        {value}
      </dd>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-extrabold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

function ActionLink({
  icon,
  label,
  href,
}: {
  icon: ReactNode;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-extrabold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
    >
      {icon}
      {label}
    </a>
  );
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

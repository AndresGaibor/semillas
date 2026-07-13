import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Expand, FileAudio, FileVideo, Search, Upload, X } from "lucide-react";

import type { RecursoMultimedia } from "../../media/media.api";

type TipoSeleccionable = "imagen" | "audio" | "video";

type MediaGalleryDialogProps = {
  open: boolean;
  title: string;
  acceptedTypes: TipoSeleccionable[];
  resources: RecursoMultimedia[];
  selectedResourceId: string | null;
  isUploading?: boolean;
  onClose: () => void;
  onRemove: () => void;
  onSelect: (resourceId: string) => void;
  onUpload: (file: File, metadata: { titulo: string; textoAlternativo: string }) => void | Promise<void>;
};

const etiquetasTipo: Record<TipoSeleccionable, string> = {
  imagen: "Imágenes",
  video: "Videos",
  audio: "Audios",
};

const acceptByType: Record<TipoSeleccionable, string> = {
  imagen: "image/jpeg,image/png,image/webp",
  audio: "audio/mpeg,audio/aac,audio/ogg,audio/webm",
  video: "video/mp4,video/webm",
};

export function MediaGalleryDialog({
  open,
  title,
  acceptedTypes,
  resources,
  selectedResourceId,
  isUploading = false,
  onClose,
  onRemove,
  onSelect,
  onUpload,
}: MediaGalleryDialogProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<TipoSeleccionable>(acceptedTypes[0] ?? "imagen");
  const [file, setFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [textoAlternativo, setTextoAlternativo] = useState("");
  const [previewedResource, setPreviewedResource] = useState<RecursoMultimedia | null>(null);
  const [expandedImageUrl, setExpandedImageUrl] = useState<string | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setLocalPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setLocalPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => dialogRef.current?.focus(), 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (expandedImageUrl) setExpandedImageUrl(null);
        else onClose();
      }
      if (event.key !== "Tab") return;
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [expandedImageUrl, onClose, open]);

  useEffect(() => {
    if (open && !acceptedTypes.includes(selectedType)) setSelectedType(acceptedTypes[0] ?? "imagen");
  }, [acceptedTypes, open, selectedType]);

  const visibleResources = useMemo(() => resources.filter((resource) => {
    const matchesType = resource.tipo === selectedType;
    const normalizedSearch = search.trim().toLocaleLowerCase();
    const matchesSearch = !normalizedSearch
      || resource.titulo.toLocaleLowerCase().includes(normalizedSearch)
      || resource.texto_alternativo?.toLocaleLowerCase().includes(normalizedSearch);
    return matchesType && matchesSearch;
  }), [resources, search, selectedType]);

  if (!open) return null;

  const accept = acceptedTypes.map((type) => acceptByType[type]).join(",");
  const handleFileChange = (selectedFile: File | undefined) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setUploadTitle((current) => current || selectedFile.name.replace(/\.[^.]+$/, ""));
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      await onUpload(file, { titulo: uploadTitle.trim(), textoAlternativo: textoAlternativo.trim() });
      setFile(null);
      setUploadTitle("");
      setTextoAlternativo("");
      setPreviewedResource(null);
      onClose();
    } catch {
      // La mutación informa el error y conserva los datos para reintentar.
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-6" role="presentation">
      <button type="button" aria-label="Cerrar diálogo" className="absolute inset-0 bg-slate-950/55" onClick={onClose} />
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="media-gallery-title" aria-describedby="media-gallery-description" tabIndex={-1} className="relative flex max-h-[min(760px,calc(100vh-1.5rem))] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl outline-none">
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
          <div>
            <span className="admin-eyebrow">Biblioteca multimedia</span>
            <h2 id="media-gallery-title" className="mt-1 text-xl font-black text-slate-900">{title}</h2>
            <p id="media-gallery-description" className="mt-1 text-sm leading-6 text-slate-500">Busca un recurso existente o sube uno nuevo para este paso.</p>
          </div>
          <button type="button" className="admin-icon-button" aria-label="Cerrar diálogo" onClick={onClose}><X size={18} /></button>
        </header>

        <div className="grid min-h-0 flex-1 gap-5 overflow-y-auto p-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] sm:p-6">
          <div className="min-w-0">
            <label className="relative block" htmlFor="media-gallery-search">
              <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <span className="sr-only">Buscar en Medios</span>
              <input id="media-gallery-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar en Medios" className="w-full !pl-10" />
            </label>
            <div className="mt-4 flex flex-wrap gap-2" aria-label="Filtrar por tipo de recurso">
              {acceptedTypes.map((type) => <button key={type} type="button" onClick={() => setSelectedType(type)} aria-pressed={selectedType === type} className={`rounded-full px-3 py-2 text-xs font-black ${selectedType === type ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}`}>{etiquetasTipo[type]}</button>)}
            </div>
            {previewedResource ? <ResourcePreview resource={previewedResource} onClear={() => setPreviewedResource(null)} onExpand={setExpandedImageUrl} action={<button type="button" onClick={() => onSelect(previewedResource.id)} className="admin-primary-button w-full justify-center">Usar este recurso</button>} /> : null}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {visibleResources.map((resource) => <article key={resource.id} className={`flex min-h-28 gap-3 rounded-2xl border p-3 transition ${selectedResourceId === resource.id ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100" : "border-slate-200 hover:border-slate-300"}`}>
                <MediaThumbnail resource={resource} />
                <div className="min-w-0 flex-1"><strong className="block text-sm leading-5 text-slate-800" title={resource.titulo}>{resource.titulo}</strong><small className="mt-1 block capitalize leading-5 text-slate-500">{resource.tipo} · {formatBytes(resource.tamano_bytes)}</small><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => setPreviewedResource(resource)} className="text-xs font-bold text-violet-700 hover:text-violet-900">Ver vista previa de {resource.titulo}</button><button type="button" onClick={() => onSelect(resource.id)} className="text-xs font-bold text-emerald-700 hover:text-emerald-900">Seleccionar</button></div></div>
                {selectedResourceId === resource.id ? <Check size={18} className="shrink-0 text-emerald-600" aria-label="Recurso seleccionado" /> : null}
              </article>)}
            </div>
            {visibleResources.length === 0 ? <p className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">No hay recursos que coincidan. Cambia el filtro o sube uno nuevo.</p> : null}
            {selectedResourceId ? <button type="button" onClick={onRemove} className="mt-4 text-sm font-bold text-red-600 hover:text-red-700">Quitar recurso</button> : null}
          </div>

          <aside className="self-start rounded-2xl bg-slate-50 p-4 sm:p-5">
            <h3 className="font-black text-slate-800">Subir nuevo recurso</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">Primero elige un archivo para comprobarlo antes de completar sus datos.</p>
            <input ref={fileInputRef} type="file" accept={accept} className="hidden" onChange={(event) => handleFileChange(event.target.files?.[0])} />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="admin-secondary-button mt-4 w-full justify-center"><Upload size={16} /> {file ? file.name : "Elegir archivo"}</button>
            {file && localPreviewUrl ? <><LocalFilePreview file={file} url={localPreviewUrl} onExpand={setExpandedImageUrl} /><label className="admin-field mt-4" htmlFor="media-gallery-upload-title"><span>Título</span><input id="media-gallery-upload-title" value={uploadTitle} maxLength={120} onChange={(event) => setUploadTitle(event.target.value)} placeholder="Nombre del recurso" /></label><label className="admin-field mt-3" htmlFor="media-gallery-upload-alt"><span>Texto alternativo</span><input id="media-gallery-upload-alt" value={textoAlternativo} maxLength={300} onChange={(event) => setTextoAlternativo(event.target.value)} placeholder="Describe lo que se ve o se escucha" /></label><button type="button" disabled={isUploading} onClick={() => void handleUpload()} className="admin-primary-button mt-4 w-full justify-center"><Upload size={16} /> {isUploading ? "Subiendo..." : "Subir y seleccionar"}</button></> : null}
          </aside>
        </div>
      </section>
      {expandedImageUrl ? <ImageViewer url={expandedImageUrl} onClose={() => setExpandedImageUrl(null)} /> : null}
    </div>
  );
}

function ResourcePreview({ resource, onClear, onExpand, action }: { resource: RecursoMultimedia; onClear: () => void; onExpand: (url: string) => void; action: React.ReactNode }) {
  return <section className="mt-4 rounded-2xl border border-violet-200 bg-violet-50 p-4"><div className="mb-3 flex items-start justify-between gap-3"><div><h3 className="font-black text-slate-800">Vista previa</h3><p className="mt-1 text-sm leading-6 text-slate-600">{resource.titulo}</p></div><button type="button" onClick={onClear} className="admin-icon-button" aria-label="Cerrar vista previa"><X size={16} /></button></div><MediaPreview tipo={resource.tipo} url={resource.url_publica} alt={resource.texto_alternativo || resource.titulo} onExpand={onExpand} />{action ? <div className="mt-4">{action}</div> : null}</section>;
}

function LocalFilePreview({ file, url, onExpand }: { file: File; url: string; onExpand: (url: string) => void }) {
  const tipo = file.type.startsWith("image/") ? "imagen" : file.type.startsWith("video/") ? "video" : "audio";
  return <section className="mt-4"><h4 className="text-sm font-black text-slate-800">Previsualización del archivo</h4><p className="mt-1 text-xs leading-5 text-slate-500">Confirma el recurso antes de completar el título y el texto alternativo.</p><div className="mt-3"><MediaPreview tipo={tipo} url={url} alt={file.name} onExpand={onExpand} /></div></section>;
}

function MediaPreview({ tipo, url, alt, onExpand }: { tipo: RecursoMultimedia["tipo"]; url: string; alt: string; onExpand: (url: string) => void }) {
  if (tipo === "imagen") return <div className="relative"><img src={url} alt={alt} className="max-h-72 w-full rounded-xl object-contain bg-slate-950" /><button type="button" onClick={() => onExpand(url)} className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-lg bg-slate-950/85 px-3 py-2 text-xs font-bold text-white hover:bg-slate-950"><Expand size={15} /> Ampliar imagen</button></div>;
  if (tipo === "video") return <video src={url} controls className="max-h-72 w-full rounded-xl bg-slate-950" />;
  return <audio src={url} controls className="w-full" />;
}

function ImageViewer({ url, onClose }: { url: string; onClose: () => void }) {
  return <section role="dialog" aria-modal="true" aria-label="Imagen ampliada" className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/90 p-4"><button type="button" aria-label="Cerrar imagen ampliada" className="absolute inset-0" onClick={onClose} /><div className="relative max-h-full max-w-6xl"><img src={url} alt="Imagen ampliada" className="max-h-[85vh] max-w-full rounded-xl object-contain" /><button type="button" autoFocus aria-label="Cerrar imagen ampliada" onClick={onClose} className="admin-icon-button absolute right-3 top-3 bg-white text-slate-800"><X size={18} /></button></div></section>;
}

function MediaThumbnail({ resource }: { resource: RecursoMultimedia }) {
  if (resource.tipo === "imagen") return <img src={resource.url_publica} alt="" className="h-16 w-20 rounded-xl object-cover" />;
  if (resource.tipo === "audio") return <span className="grid h-16 w-20 place-items-center rounded-xl bg-sky-100 text-sky-700"><FileAudio size={24} /></span>;
  return <span className="grid h-16 w-20 place-items-center rounded-xl bg-violet-100 text-violet-700"><FileVideo size={24} /></span>;
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

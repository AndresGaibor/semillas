import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type RefObject,
} from "react";
import { toast } from "sonner";

import {
  eliminarRecursoMultimedia,
  obtenerRecursosMultimedia,
  subirArchivo,
} from "../../media/media.api";
import type { MediaCardItem, MediaViewMode } from "../admin-media.types";
import type { TipoMedia } from "../componentes/medios/admin-media-type-tabs";

type UploadProgress = {
  actual: number;
  total: number;
  nombre: string;
};

interface UseAdminMediaPageReturn {
  selectedId: string;
  setSelectedId: (id: string) => void;
  activeTab: TipoMedia;
  searchValue: string;
  selectedSort: string;
  viewMode: MediaViewMode;
  paginaActual: number;
  porPagina: number;
  isUploading: boolean;
  uploadProgress: UploadProgress | null;
  mediaQuery: ReturnType<typeof useQuery>;
  totalResources: number;
  mappedMedia: MediaCardItem[];
  filteredMedia: MediaCardItem[];
  paginatedItems: MediaCardItem[];
  selectedResource: MediaCardItem | null;
  countsByType: Record<Exclude<TipoMedia, "">, number>;
  handleTabChange: (tab: TipoMedia) => void;
  handleSearchChange: (value: string) => void;
  handleSortChange: (sort: string) => void;
  handleViewModeChange: (mode: MediaViewMode) => void;
  handleDelete: (id: string) => Promise<void>;
  handleFilesChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  inputArchivoRef: RefObject<HTMLInputElement | null>;
  setPaginaActual: (page: number) => void;
  setPorPagina: (perPage: number) => void;
}

const TYPE_LABELS: Record<MediaCardItem["tipo"], string> = {
  imagen: "Imagen",
  audio: "Audio",
  video: "Video",
  documento: "Documento",
};

function formatBytes(bytes: number | null): string {
  if (!bytes || bytes <= 0) return "Tamaño no disponible";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function inferMediaType(file: File): Exclude<TipoMedia, ""> {
  if (file.type.startsWith("image/")) return "imagen";
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type.startsWith("video/")) return "video";
  return "documento";
}

export function useAdminMediaPage(): UseAdminMediaPageReturn {
  const queryClient = useQueryClient();
  const inputArchivoRef = useRef<HTMLInputElement>(null);

  const [selectedId, setSelectedId] = useState("");
  const [activeTab, setActiveTab] = useState<TipoMedia>("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedSort, setSelectedSort] = useState("recientes");
  const [viewMode, setViewMode] = useState<MediaViewMode>("grid");
  const [paginaActual, setPaginaActual] = useState(1);
  const [porPagina, setPorPagina] = useState(12);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);

  const mediaQuery = useQuery({
    queryKey: ["admin", "media"],
    queryFn: () => obtenerRecursosMultimedia(),
  });

  const mappedMedia = useMemo<MediaCardItem[]>(() => {
    return (mediaQuery.data ?? []).map((asset) => {
      const fechaDate = new Date(asset.creado_en);
      const fechaTimestamp = Number.isNaN(fechaDate.getTime())
        ? 0
        : fechaDate.getTime();
      const fechaSubido = fechaTimestamp
        ? fechaDate.toLocaleString("es-EC", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Fecha no disponible";
      const formato =
        asset.tipo_mime?.split("/")[1]?.replace("jpeg", "jpg").toUpperCase() ??
        "DESCONOCIDO";
      const dimensiones =
        asset.ancho_px && asset.alto_px
          ? `${asset.ancho_px} × ${asset.alto_px} px`
          : "No disponibles";

      return {
        id: asset.id,
        nombre: asset.titulo?.trim() || `recurso-${asset.id.slice(0, 8)}`,
        tipo: asset.tipo,
        tipoLabel: TYPE_LABELS[asset.tipo],
        imgUrl: asset.url_publica,
        usadoEnCount: asset.uso_total ?? null,
        subidoPor: asset.creado_por,
        fechaSubido,
        fechaTimestamp,
        tamano: formatBytes(asset.tamano_bytes),
        tamanoBytes: asset.tamano_bytes,
        formato,
        tipoMime: asset.tipo_mime,
        resolucion: dimensiones,
        dimensiones,
        anchoPx: asset.ancho_px,
        altoPx: asset.alto_px,
        duracionSeg: asset.duracion_seg,
        altText: asset.texto_alternativo?.trim() || null,
      } satisfies MediaCardItem;
    });
  }, [mediaQuery.data]);

  const countsByType = useMemo(
    () => ({
      imagen: mappedMedia.filter((item) => item.tipo === "imagen").length,
      audio: mappedMedia.filter((item) => item.tipo === "audio").length,
      video: mappedMedia.filter((item) => item.tipo === "video").length,
      documento: mappedMedia.filter((item) => item.tipo === "documento").length,
    }),
    [mappedMedia],
  );

  const filteredMedia = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLocaleLowerCase("es");
    const filtered = mappedMedia.filter((item) => {
      if (activeTab && item.tipo !== activeTab) return false;
      if (!normalizedSearch) return true;

      return [item.nombre, item.altText, item.formato, item.tipoLabel]
        .filter(Boolean)
        .some((value) =>
          String(value).toLocaleLowerCase("es").includes(normalizedSearch),
        );
    });

    return [...filtered].sort((a, b) => {
      if (selectedSort === "antiguos") return a.fechaTimestamp - b.fechaTimestamp;
      if (selectedSort === "nombre") return a.nombre.localeCompare(b.nombre, "es");
      return b.fechaTimestamp - a.fechaTimestamp;
    });
  }, [activeTab, mappedMedia, searchValue, selectedSort]);

  const paginatedItems = useMemo(() => {
    const inicio = (paginaActual - 1) * porPagina;
    return filteredMedia.slice(inicio, inicio + porPagina);
  }, [filteredMedia, paginaActual, porPagina]);

  const selectedResource = useMemo(
    () => mappedMedia.find((item) => item.id === selectedId) ?? null,
    [mappedMedia, selectedId],
  );

  const handleTabChange = (tab: TipoMedia) => {
    setActiveTab(tab);
    setPaginaActual(1);
    if (selectedResource && tab && selectedResource.tipo !== tab) setSelectedId("");
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setPaginaActual(1);
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    setPaginaActual(1);
  };

  const handleViewModeChange = (mode: MediaViewMode) => setViewMode(mode);

  const handleDelete = async (id: string) => {
    if (!globalThis.confirm("¿Eliminar este recurso multimedia? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      await eliminarRecursoMultimedia(id);
      await queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
      setSelectedId("");
      toast.success("Recurso eliminado");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo eliminar el recurso",
      );
    }
  };

  const handleFilesChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;

    let uploaded = 0;
    let lastResourceId = "";

    for (const [index, file] of files.entries()) {
      setUploadProgress({ actual: index + 1, total: files.length, nombre: file.name });

      try {
        const title = file.name.replace(/\.[^.]+$/, "").trim();
        const resource = await subirArchivo(
          file,
          inferMediaType(file),
          undefined,
          title.length >= 2 ? title : undefined,
        );
        uploaded += 1;
        lastResourceId = resource.id;
      } catch (error) {
        toast.error(
          `${file.name}: ${error instanceof Error ? error.message : "no se pudo subir"}`,
        );
      }
    }

    setUploadProgress(null);
    await queryClient.invalidateQueries({ queryKey: ["admin", "media"] });

    if (lastResourceId) {
      setActiveTab("");
      setSelectedId(lastResourceId);
      setPaginaActual(1);
    }

    if (uploaded > 0) {
      toast.success(
        uploaded === 1
          ? "Recurso subido correctamente"
          : `${uploaded} recursos subidos correctamente`,
      );
    }
  };

  return {
    selectedId,
    setSelectedId,
    activeTab,
    searchValue,
    selectedSort,
    viewMode,
    paginaActual,
    porPagina,
    isUploading: uploadProgress !== null,
    uploadProgress,
    mediaQuery,
    totalResources: mappedMedia.length,
    mappedMedia,
    filteredMedia,
    paginatedItems,
    selectedResource,
    countsByType,
    handleTabChange,
    handleSearchChange,
    handleSortChange,
    handleViewModeChange,
    handleDelete,
    handleFilesChange,
    inputArchivoRef,
    setPaginaActual,
    setPorPagina,
  };
}

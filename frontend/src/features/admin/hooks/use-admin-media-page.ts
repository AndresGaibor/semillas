import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, useRef, type ChangeEvent } from "react";
import { obtenerRecursosMultimedia, eliminarRecursoMultimedia, subirArchivo } from "../../media/media.api";
import { toast } from "sonner";
import type { TipoMedia } from "../componentes/medios/admin-media-type-tabs";
import type { MediaCardItem } from "../admin-media.types";

interface UseAdminMediaPageReturn {
  selectedId: string;
  setSelectedId: (id: string) => void;
  activeTab: TipoMedia;
  setActiveTab: (tab: TipoMedia) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  selectedFolder: string;
  setSelectedFolder: (folder: string) => void;
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
  paginaActual: number;
  setPaginaActual: (page: number) => void;
  porPagina: number;
  setPorPagina: (perPage: number) => void;
  isUploading: boolean;
  mediaQuery: ReturnType<typeof useQuery>;
  mappedMedia: MediaCardItem[];
  filteredMedia: MediaCardItem[];
  paginatedItems: MediaCardItem[];
  selectedResource: MediaCardItem | null;
  handleTabChange: (tab: TipoMedia) => void;
  handleDelete: (id: string) => Promise<void>;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  inputArchivoRef: React.RefObject<HTMLInputElement | null>;
}

export function useAdminMediaPage(): UseAdminMediaPageReturn {
  const queryClient = useQueryClient();
  const inputArchivoRef = useRef<HTMLInputElement>(null);

  const [selectedId, setSelectedId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TipoMedia>("imagen");
  const [searchValue, setSearchValue] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [selectedSort, setSelectedSort] = useState("recientes");
  const [paginaActual, setPaginaActual] = useState(1);
  const [porPagina, setPorPagina] = useState(10);
  const [isUploading, setIsUploading] = useState(false);

  const mediaQuery = useQuery({
    queryKey: ["admin", "media"],
    queryFn: () => obtenerRecursosMultimedia(),
  });

  const mappedMedia = useMemo(() => {
    return (mediaQuery.data ?? []).map((asset) => {
      const formato = asset.tipo_mime?.split("/")[1]?.toUpperCase() ?? "DESCONOCIDO";
      const tamano = asset.tamano_bytes >= 1024 * 1024
        ? `${(asset.tamano_bytes / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.max(1, Math.round(asset.tamano_bytes / 1024))} KB`;
      const fechaDate = new Date(asset.creado_en);
      const fechaTimestamp = Number.isNaN(fechaDate.getTime()) ? 0 : fechaDate.getTime();
      const fechaSubido = fechaTimestamp
        ? fechaDate.toLocaleString("es-EC", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Fecha no disponible";

      return {
        id: asset.id,
        nombre: asset.titulo || `recurso-${asset.id}`,
        tipo: asset.tipo,
        tipoLabel: asset.tipo.charAt(0).toUpperCase() + asset.tipo.slice(1),
        imgUrl: asset.url_publica,
        usadoEnCount: null,
        carpeta: asset.tipo === "imagen" ? "Ilustraciones" : asset.tipo === "audio" ? "Audios" : asset.tipo === "video" ? "Videos" : "Documentos",
        subidoPor: asset.creado_por,
        fechaSubido,
        fechaTimestamp,
        tamano,
        formato,
        resolucion: "No disponible",
        dimensiones: "No disponible",
        altText: asset.texto_alternativo || "Sin texto alternativo definido.",
        etiquetas: [] as string[],
      } satisfies MediaCardItem;
    });
  }, [mediaQuery.data]);

  const filteredMedia = useMemo(() => {
    const filtrados = mappedMedia.filter((item) => {
      if (activeTab && item.tipo !== activeTab) return false;
      if (
        searchValue &&
        !item.nombre.toLowerCase().includes(searchValue.toLowerCase()) &&
        !item.etiquetas.some((t) => t.toLowerCase().includes(searchValue.toLowerCase()))
      ) {
        return false;
      }
      if (selectedFolder && item.carpeta !== selectedFolder) return false;
      return true;
    });

    return [...filtrados].sort((a, b) => selectedSort === "antiguos"
      ? a.fechaTimestamp - b.fechaTimestamp
      : b.fechaTimestamp - a.fechaTimestamp);
  }, [mappedMedia, activeTab, searchValue, selectedFolder, selectedSort]);

  const paginatedItems = useMemo(() => {
    const inicio = (paginaActual - 1) * porPagina;
    return filteredMedia.slice(inicio, inicio + porPagina);
  }, [filteredMedia, paginaActual, porPagina]);

  const selectedResource = useMemo(() => {
    return mappedMedia.find((m) => m.id === selectedId) ?? null;
  }, [mappedMedia, selectedId]);

  const handleTabChange = (tab: TipoMedia) => {
    setActiveTab(tab);
    setPaginaActual(1);
    setSelectedId(tab ? mappedMedia.find((m) => m.tipo === tab)?.id ?? "" : mappedMedia[0]?.id ?? "");
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este recurso?")) {
      try {
        await eliminarRecursoMultimedia(id);
        await queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
        setSelectedId("");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "No se pudo eliminar el recurso");
      }
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0];
    event.target.value = "";
    if (!archivo) return;

    const tipo = archivo.type.startsWith("image/") ? "imagen"
      : archivo.type.startsWith("audio/") ? "audio"
      : archivo.type.startsWith("video/") ? "video" : "documento";

    setIsUploading(true);
    try {
      const recurso = await subirArchivo(archivo, tipo);
      queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
      setActiveTab(recurso.tipo as TipoMedia);
      setSelectedId(recurso.id);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    selectedId,
    setSelectedId,
    activeTab,
    setActiveTab,
    searchValue,
    setSearchValue,
    selectedFolder,
    setSelectedFolder,
    selectedSort,
    setSelectedSort,
    paginaActual,
    setPaginaActual,
    porPagina,
    setPorPagina,
    isUploading,
    mediaQuery,
    mappedMedia,
    filteredMedia,
    paginatedItems,
    selectedResource,
    handleTabChange,
    handleDelete,
    handleFileChange,
    inputArchivoRef,
  };
}

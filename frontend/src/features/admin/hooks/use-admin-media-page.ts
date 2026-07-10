import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, useRef, type ChangeEvent } from "react";
import { obtenerRecursosMultimedia, eliminarRecursoMultimedia, subirArchivo } from "../../media/media.api";
import type { TipoMedia } from "../componentes/admin-media-type-tabs";
import type { MediaCardItem } from "../__mocks__/medios.mock";

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
    const dbAssets = mediaQuery.data ?? [];

    if (!dbAssets.length) {
      return [];
    }

    return dbAssets.map((asset, index) => {
      const format = asset.tipo_mime?.split("/")[1]?.toUpperCase() ?? "JPG";
      const sizeMB = (asset.tamano_bytes / (1024 * 1024)).toFixed(1) + " MB";
      const imgUrl = asset.url_publica || "";
      const fecha = new Date(asset.creado_en).toLocaleDateString("es-EC", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      return {
        id: asset.id,
        nombre: asset.titulo || `recurso_multimedia_${index + 1}.${format.toLowerCase()}`,
        tipo: asset.tipo as "imagen" | "audio" | "video" | "documento",
        tipoLabel: asset.tipo.charAt(0).toUpperCase() + asset.tipo.slice(1),
        imgUrl,
        usadoEnCount: 2 + (index % 4),
        carpeta: asset.tipo === "documento" ? "Documentos" : "Ilustraciones",
        subidoPor: "Ana Torres",
        fechaSubido: fecha,
        tamano: sizeMB,
        formato: format,
        resolucion: "1920 x 1080",
        dimensiones: "16:9",
        altText: asset.texto_alternativo || "Recurso multimedia de Semillas.",
        etiquetas: ["creación", "aprendizaje", "multimedia"],
      } satisfies MediaCardItem;
    });
  }, [mediaQuery.data]);

  const filteredMedia = useMemo(() => {
    return mappedMedia.filter((item) => {
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
  }, [mappedMedia, activeTab, searchValue, selectedFolder]);

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
      await eliminarRecursoMultimedia(id);
      queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
      setSelectedId("");
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
      const recurso = await subirArchivo(archivo, tipo, archivo.name);
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

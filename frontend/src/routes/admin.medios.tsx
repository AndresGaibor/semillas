import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { obtenerRecursosMultimedia, eliminarRecursoMultimedia } from "../features/media/media.api";
import { Loader } from "lucide-react";

import { AdminMediaHeader } from "../features/admin/componentes/admin-media-header";
import { AdminMediaTypeTabs } from "../features/admin/componentes/admin-media-type-tabs";
import { AdminMediaFilters } from "../features/admin/componentes/admin-media-filters";
import { AdminMediaGrid } from "../features/admin/componentes/admin-media-grid";
import { AdminMediaDetailPanel } from "../features/admin/componentes/admin-media-detail-panel";
import type { MediaCardItem } from "../features/admin/__mocks__/medios.mock";
import type { TipoMedia } from "../features/admin/componentes/admin-media-type-tabs";

import imgSemilla from "@/assets/images/Ilustraciones/Semilla.png";
import imgIn1 from "@/assets/images/Ilustraciones/in1.png";
import imgVersiculo from "@/assets/images/Ilustraciones/Versiculo del dia.png";
import imgIn2 from "@/assets/images/Ilustraciones/in2.png";
import imgTema2 from "@/assets/images/Ilustraciones/Tema2.png";
import imgTema3 from "@/assets/images/Ilustraciones/Tema3.png";
import imgExploradores from "@/assets/images/Ilustraciones/Exploradores.png";
import imgEmbajadores from "@/assets/images/Ilustraciones/Embajadores.png";

export const Route = createFileRoute("/admin/medios")({
  component: AdminMediosPage,
});

function AdminMediosPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedId, setSelectedId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TipoMedia>("imagen");
  const [searchValue, setSearchValue] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [selectedSort, setSelectedSort] = useState("recientes");
  const [paginaActual, setPaginaActual] = useState(1);
  const [porPagina, setPorPagina] = useState(10);

  const mediaQuery = useQuery({
    queryKey: ["admin", "media"],
    queryFn: () => obtenerRecursosMultimedia(),
  });

  const mappedMedia = useMemo(() => {
    const dbAssets = mediaQuery.data ?? [];
    const poolImgs = [imgSemilla, imgIn1, imgVersiculo, imgIn2, imgTema2, imgTema3, imgExploradores, imgEmbajadores];

    return dbAssets.map((asset, index) => {
      const format = asset.tipo_mime?.split("/")[1]?.toUpperCase() ?? "JPG";
      const sizeMB = (asset.tamano_bytes / (1024 * 1024)).toFixed(1) + " MB";
      const imgUrl = asset.url_publica || poolImgs[index % poolImgs.length]!;
      const fecha = new Date(asset.creado_en).toLocaleDateString("es-EC", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      return {
        id: asset.id,
        nombre: asset.titulo || `recurso_multimedia_${index + 1}.${format.toLowerCase()}`,
        tipo: asset.tipo as TipoMedia,
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
      if (item.tipo !== activeTab) return false;
      if (
        searchValue &&
        !item.nombre.toLowerCase().includes(searchValue.toLowerCase()) &&
        !item.etiquetas.some((t) =>
          t.toLowerCase().includes(searchValue.toLowerCase()),
        )
      ) {
        return false;
      }
      if (selectedFolder && item.carpeta !== selectedFolder) {
        return false;
      }
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
    const first = mappedMedia.find((m) => m.tipo === tab);
    setSelectedId(first?.id ?? "");
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este recurso?")) {
      await eliminarRecursoMultimedia(id);
      queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
      setSelectedId("");
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      {mediaQuery.isLoading && (
        <div className="flex items-center justify-center py-6">
          <Loader className="animate-spin text-primario" size={24} />
          <span className="text-sm text-neutro ml-2">
            Cargando recursos multimedia...
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="flex flex-col gap-6 lg:col-span-3 min-w-0">
          <AdminMediaHeader />
          <AdminMediaTypeTabs activeTab={activeTab} onTabChange={handleTabChange} />
          <AdminMediaFilters
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            selectedFolder={selectedFolder}
            onFolderChange={setSelectedFolder}
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
          />
          <AdminMediaGrid
            items={paginatedItems}
            selectedId={selectedId}
            onSelect={setSelectedId}
            paginaActual={paginaActual}
            porPagina={porPagina}
            onCambiarPagina={setPaginaActual}
            onCambiarPorPagina={setPorPagina}
          />
        </div>
        <AdminMediaDetailPanel
          selectedResource={selectedResource}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

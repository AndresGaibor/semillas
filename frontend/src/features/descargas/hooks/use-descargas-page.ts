import { useState, useMemo, useCallback } from "react";
import { RECURSOS_CATALOGO, type Recurso } from "@/features/descargas/componentes/descargas.data";

export function useDescargasPage() {
  const [showBanner, setShowBanner] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("Todos");
  const [ageFilter, setAgeFilter] = useState<string>("Todas las edades");
  const [sortOrder, setSortOrder] = useState<string>("Más recientes");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [downloadedIds, setDownloadedIds] = useState<string[]>(["noe", "laberinto"]);
  const [downloadingStates, setDownloadingStates] = useState<Record<string, number>>({});

  const handleDownload = useCallback((id: string) => {
    if (downloadingStates[id] !== undefined || downloadedIds.includes(id)) return;

    setDownloadingStates(prev => ({ ...prev, [id]: 0 }));

    const interval = setInterval(() => {
      setDownloadingStates(prev => {
        const current = prev[id] ?? 0;
        if (current >= 100) {
          clearInterval(interval);
          setDownloadedIds(dIds => [...dIds, id]);
          const newStates = { ...prev };
          delete newStates[id];
          return newStates;
        }
        return { ...prev, [id]: current + 20 };
      });
    }, 200);
  }, [downloadingStates, downloadedIds]);

  const handleDelete = useCallback((id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este recurso descargado?")) {
      setDownloadedIds(prev => prev.filter(dId => dId !== id));
    }
  }, []);

  const totalStorageMB = 2000;
  const storageInfo = useMemo(() => {
    const baseUsed = 65.4;
    const downloadedFilesUsed = RECURSOS_CATALOGO.filter(r => downloadedIds.includes(r.id))
      .reduce((sum, r) => sum + r.sizeMB, 0);
    const totalUsed = Math.round((baseUsed + downloadedFilesUsed) * 10) / 10;
    const percentage = Math.min(100, Math.round((totalUsed / totalStorageMB) * 100));

    return { used: totalUsed, percentage };
  }, [downloadedIds]);

  const filteredRecursos = useMemo(() => {
    return RECURSOS_CATALOGO.filter(recurso => {
      const matchesTab = activeTab === "Todos" ||
        (activeTab === "Historias" && recurso.tipo === "Historia") ||
        (activeTab === "Actividades" && recurso.tipo === "Actividad") ||
        (activeTab === "Imprimibles" && recurso.tipo === "Imprimible") ||
        (activeTab === "Canciones" && recurso.tipo === "Canción");

      let matchesAge = true;
      if (ageFilter === "Semillas (5-8)") matchesAge = recurso.edad === "5-8";
      else if (ageFilter === "Exploradores (9-12)") matchesAge = recurso.edad === "9-12";
      else if (ageFilter === "Embajadores (13-17)") matchesAge = recurso.edad === "13-17";
      else if (ageFilter === "Párvulos (3-6)") matchesAge = recurso.edad === "3-6";

      const matchesSearch = recurso.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recurso.descripcion.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesAge && matchesSearch;
    }).sort((a, b) => {
      if (sortOrder === "Más recientes") {
        return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      }
      if (sortOrder === "Mayor tamaño") {
        return b.sizeMB - a.sizeMB;
      }
      if (sortOrder === "Menor tamaño") {
        return a.sizeMB - b.sizeMB;
      }
      return 0;
    });
  }, [activeTab, ageFilter, sortOrder, searchQuery]);

  return {
    showBanner,
    setShowBanner,
    activeTab,
    setActiveTab,
    ageFilter,
    setAgeFilter,
    sortOrder,
    setSortOrder,
    searchQuery,
    setSearchQuery,
    downloadedIds,
    downloadingStates,
    handleDownload,
    handleDelete,
    storageInfo,
    totalStorageMB,
    filteredRecursos,
  };
}

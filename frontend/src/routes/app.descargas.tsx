import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";

// Componentes descompuestos
import { DescargasBanner } from "@/features/descargas/componentes/descargas-banner";
import { DescargasTabsFilter } from "@/features/descargas/componentes/descargas-tabs-filter";
import { RecursoCard } from "@/features/descargas/componentes/recurso-card";
import { StorageWidget } from "@/features/descargas/componentes/storage-widget";

// Ilustraciones
import arkImg from "@/assets/images/Ilustraciones/Tema1.png";
import prayerImg from "@/assets/images/Ilustraciones/Versiculo del dia.png";
import davidImg from "@/assets/images/Ilustraciones/Exploradores.png";
import mazeImg from "@/assets/images/Ilustraciones/Tema3.png";
import jesusKidsImg from "@/assets/images/Ilustraciones/Ninños 2.png";
import versesImg from "@/assets/images/Ilustraciones/Tema4.png";

export const Route = createFileRoute("/app/descargas")({
  component: DownloadsPage,
});

type Recurso = {
  id: string;
  titulo: string;
  tipo: "Historia" | "Actividad" | "Imprimible" | "Canción";
  edad: "5-8" | "9-12" | "13-17" | "3-6";
  sizeMB: number;
  descripcion: string;
  imagen: string;
  fecha: string; // ISO date
};

const RECURSOS_CATALOGO: Recurso[] = [
  {
    id: "noe",
    titulo: "La historia de Noé",
    tipo: "Historia",
    edad: "5-8",
    sizeMB: 15.2,
    descripcion: "Conoce cómo Dios protegió a Noé y a los animales del gran diluvio.",
    imagen: arkImg,
    fecha: "2026-07-01",
  },
  {
    id: "oracion",
    titulo: "Oración de la noche",
    tipo: "Canción",
    edad: "3-6",
    sizeMB: 3.4,
    descripcion: "Canción suave para agradecer a Dios antes de dormir.",
    imagen: prayerImg,
    fecha: "2026-07-05",
  },
  {
    id: "david",
    titulo: "David y Goliat",
    tipo: "Historia",
    edad: "5-8",
    sizeMB: 18.7,
    descripcion: "Aprende cómo David confió en Dios y derrotó al gigante Goliat.",
    imagen: davidImg,
    fecha: "2026-06-25",
  },
  {
    id: "laberinto",
    titulo: "Laberinto: El buen pastor",
    tipo: "Actividad",
    edad: "5-8",
    sizeMB: 2.1,
    descripcion: "Encuentra el camino para ayudar al pastor a cuidar sus ovejas.",
    imagen: mazeImg,
    fecha: "2026-07-06",
  },
  {
    id: "jesus_ninos",
    titulo: "Jesús ama a los niños",
    tipo: "Imprimible",
    edad: "3-6",
    sizeMB: 1.8,
    descripcion: "Dibujo para colorear e imprimir sobre el amor de Jesús.",
    imagen: jesusKidsImg,
    fecha: "2026-06-20",
  },
  {
    id: "versiculos_animo",
    titulo: "Versículos de ánimo",
    tipo: "Historia",
    edad: "5-8",
    sizeMB: 12.6,
    descripcion: "Versículos bíblicos para recordar cada día y fortalecer tu fe.",
    imagen: versesImg,
    fecha: "2026-06-28",
  }
];

function DownloadsPage() {
  const [showBanner, setShowBanner] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("Todos");
  const [ageFilter, setAgeFilter] = useState<string>("Todas las edades");
  const [sortOrder, setSortOrder] = useState<string>("Más recientes");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Estado de descargas
  const [downloadedIds, setDownloadedIds] = useState<string[]>(["noe", "laberinto"]);
  const [downloadingStates, setDownloadingStates] = useState<Record<string, number>>({}); // id -> progress percentage

  // Simulación de descarga
  const handleDownload = (id: string) => {
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
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este recurso descargado?")) {
      setDownloadedIds(prev => prev.filter(dId => dId !== id));
    }
  };

  // Cálculo dinámico de almacenamiento
  const totalStorageMB = 2000; // 2 GB
  const storageInfo = useMemo(() => {
    const baseUsed = 65.4; // Otras descargas del sistema
    const downloadedFilesUsed = RECURSOS_CATALOGO.filter(r => downloadedIds.includes(r.id))
      .reduce((sum, r) => sum + r.sizeMB, 0);
    const totalUsed = Math.round((baseUsed + downloadedFilesUsed) * 10) / 10;
    const percentage = Math.min(100, Math.round((totalUsed / totalStorageMB) * 100));

    return {
      used: totalUsed,
      percentage,
    };
  }, [downloadedIds]);

  // Filtrado y ordenación
  const filteredRecursos = useMemo(() => {
    return RECURSOS_CATALOGO.filter(recurso => {
      // Filtro de Pestaña
      const matchesTab = activeTab === "Todos" ||
        (activeTab === "Historias" && recurso.tipo === "Historia") ||
        (activeTab === "Actividades" && recurso.tipo === "Actividad") ||
        (activeTab === "Imprimibles" && recurso.tipo === "Imprimible") ||
        (activeTab === "Canciones" && recurso.tipo === "Canción");

      // Filtro de Edad
      let matchesAge = true;
      if (ageFilter === "Semillas (5-8)") matchesAge = recurso.edad === "5-8";
      else if (ageFilter === "Exploradores (9-12)") matchesAge = recurso.edad === "9-12";
      else if (ageFilter === "Embajadores (13-17)") matchesAge = recurso.edad === "13-17";
      else if (ageFilter === "Párvulos (3-6)") matchesAge = recurso.edad === "3-6";

      // Filtro de Búsqueda
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

  return (
    <div className="w-full flex flex-col font-sans text-slate-800 text-left">
      <DescargasBanner visible={showBanner} onCerrar={() => setShowBanner(false)} />
      
      <DescargasTabsFilter
        activeTab={activeTab}
        onTabChange={setActiveTab}
        ageFilter={ageFilter}
        onAgeChange={setAgeFilter}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
        {filteredRecursos.map(recurso => (
          <RecursoCard
            key={recurso.id}
            id={recurso.id}
            titulo={recurso.titulo}
            tipo={recurso.tipo}
            edad={recurso.edad}
            sizeMB={recurso.sizeMB}
            descripcion={recurso.descripcion}
            imagen={recurso.imagen}
            isDownloaded={downloadedIds.includes(recurso.id)}
            progress={downloadingStates[recurso.id]}
            onDownload={() => handleDownload(recurso.id)}
            onDelete={() => handleDelete(recurso.id)}
          />
        ))}

        {filteredRecursos.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400">
            No se encontraron descargas que coincidan con los filtros.
          </div>
        )}
      </div>

      <StorageWidget
        usedMB={storageInfo.used}
        totalMB={totalStorageMB}
        percentage={storageInfo.percentage}
        onGestionarClick={() => alert("Abriendo panel de configuración de almacenamiento offline.")}
      />
    </div>
  );
}

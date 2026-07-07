import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Search, Download, Trash2, X, HardDrive, Settings, HelpCircle, Loader2 } from "lucide-react";
import { Card } from "@/componentes/ui/card-base";

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
      
      {/* Banner de Bienvenida */}
      {showBanner && (
        <div className="bg-[#EDE7F6] border border-[#D1C4E9] rounded-2xl p-5 mb-6 flex items-center justify-between shadow-sm relative">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#7E57C2]/10 flex items-center justify-center text-[#7E57C2] flex-shrink-0">
              <Download size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-base font-black text-[#512DA8] mb-0.5">
                Aprende donde estés
              </h3>
              <p className="text-sm text-[#7E57C2] leading-normal font-semibold">
                Descarga historias, actividades y materiales para disfrutarlos sin internet.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="bg-transparent border-0 text-[#7E57C2] hover:text-[#512DA8] p-1.5 cursor-pointer rounded-full hover:bg-[#D1C4E9]/30 transition-colors"
            aria-label="Cerrar banner"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-6 max-sm:gap-4 overflow-x-auto">
        {["Todos", "Historias", "Actividades", "Imprimibles", "Canciones"].map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 border-0 border-b-2 font-extrabold text-sm cursor-pointer transition-all bg-transparent ${
                isActive 
                  ? "border-[#7E57C2] text-[#7E57C2]" 
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Filtros y Búsqueda */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 w-full">
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Dropdown de Edad */}
          <select
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
            className="bg-white border border-[#e5e7eb] rounded-xl px-4 py-3 text-sm font-bold text-slate-600 outline-none cursor-pointer focus:border-[#7E57C2]"
          >
            <option>Todas las edades</option>
            <option>Párvulos (3-6)</option>
            <option>Semillas (5-8)</option>
            <option>Exploradores (9-12)</option>
            <option>Embajadores (13-17)</option>
          </select>

          {/* Dropdown de Orden */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-white border border-[#e5e7eb] rounded-xl px-4 py-3 text-sm font-bold text-slate-600 outline-none cursor-pointer focus:border-[#7E57C2]"
          >
            <option>Más recientes</option>
            <option>Mayor tamaño</option>
            <option>Menor tamaño</option>
          </select>
        </div>

        {/* Buscador */}
        <div className="relative w-full md:w-80 flex items-center">
          <Search className="absolute left-4 text-slate-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar descargas..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#e5e7eb] rounded-xl text-sm font-sans outline-none focus:border-[#7E57C2] transition-colors"
          />
        </div>
      </div>

      {/* Grid de Recursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
        {filteredRecursos.map(recurso => {
          const isDownloaded = downloadedIds.includes(recurso.id);
          const progress = downloadingStates[recurso.id];
          const isDownloading = progress !== undefined;

          // Etiqueta de tipo color
          let tagBg = "bg-purple-50 text-purple-700 border-purple-100";
          if (recurso.tipo === "Actividad") tagBg = "bg-blue-50 text-blue-700 border-blue-100";
          else if (recurso.tipo === "Imprimible") tagBg = "bg-pink-50 text-pink-700 border-pink-100";
          else if (recurso.tipo === "Canción") tagBg = "bg-indigo-50 text-indigo-700 border-indigo-100";

          return (
            <Card
              key={recurso.id}
              className="p-4 flex flex-row items-center gap-4 bg-white border border-slate-100 shadow-sm rounded-2xl hover:shadow-md transition-shadow relative"
            >
              {/* Imagen Portada */}
              <div className="w-[120px] h-[120px] rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 shadow-sm relative">
                <img
                  src={recurso.imagen}
                  alt={recurso.titulo}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Contenido / Info */}
              <div className="flex-1 flex flex-col justify-center text-left min-w-0 pr-12">
                <h3 className="text-base font-black text-slate-800 leading-tight mb-1 truncate">
                  {recurso.titulo}
                </h3>
                
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${tagBg}`}>
                    {recurso.tipo}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    Para {recurso.edad} años • {recurso.sizeMB} MB
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed truncate-2-lines">
                  {recurso.descripcion}
                </p>
              </div>

              {/* Botón de Acción (Flotante a la Derecha) */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {isDownloading ? (
                  <div className="w-11 h-11 bg-slate-50 border border-slate-200 rounded-full flex flex-col items-center justify-center relative">
                    <Loader2 size={20} className="text-[#7E57C2] animate-spin" />
                    <span className="text-[8px] font-bold text-[#7E57C2] mt-0.5">{progress}%</span>
                  </div>
                ) : isDownloaded ? (
                  <button
                    onClick={() => handleDelete(recurso.id)}
                    className="w-11 h-11 border-0 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center cursor-pointer transition-colors shadow-sm"
                    title="Eliminar descarga"
                  >
                    <Trash2 size={18} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleDownload(recurso.id)}
                    className="w-11 h-11 border border-slate-200 hover:border-[#7E57C2] bg-white text-[#7E57C2] hover:bg-[#EDE7F6] rounded-xl flex items-center justify-center cursor-pointer transition-all shadow-sm"
                    title="Descargar"
                  >
                    <Download size={18} />
                  </button>
                )}
              </div>
            </Card>
          );
        })}

        {filteredRecursos.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400">
            No se encontraron descargas que coincidan con los filtros.
          </div>
        )}
      </div>

      {/* Widget Barra de Almacenamiento (Footer) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between w-full">
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-full bg-[#EDE7F6] text-[#7E57C2] flex items-center justify-center flex-shrink-0">
            <HardDrive size={18} />
          </div>
          <div className="text-left flex-1 min-w-0">
            <span className="text-sm font-bold text-slate-800 block mb-0.5">
              Almacenamiento usado: {storageInfo.used} MB de {totalStorageMB} MB
            </span>
            {/* Barra de progreso */}
            <div className="w-full sm:w-80 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#7E57C2] rounded-full transition-all duration-300"
                style={{ width: `${storageInfo.percentage}%` }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => alert("Abriendo panel de configuración de almacenamiento offline.")}
          className="flex items-center gap-2 bg-white border border-slate-200 hover:border-[#7E57C2] hover:bg-[#EDE7F6] text-slate-700 hover:text-[#7E57C2] py-2.5 px-4 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm flex-shrink-0"
        >
          <Settings size={14} />
          Gestionar descargas
        </button>
      </div>

    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { obtenerRecursosMultimedia, eliminarRecursoMultimedia } from "../features/media/media.api";
import { Loader } from "lucide-react";

import imgSemilla from "@/assets/images/Ilustraciones/Semilla.png";
import imgIn1 from "@/assets/images/Ilustraciones/in1.png";
import imgVersiculo from "@/assets/images/Ilustraciones/Versiculo del dia.png";
import imgIn2 from "@/assets/images/Ilustraciones/in2.png";
import imgTema2 from "@/assets/images/Ilustraciones/Tema2.png";
import imgTema3 from "@/assets/images/Ilustraciones/Tema3.png";
import imgExploradores from "@/assets/images/Ilustraciones/Exploradores.png";
import imgEmbajadores from "@/assets/images/Ilustraciones/Embajadores.png";

export const Route = createFileRoute("/admin/medios")({
  component: AdminMediosPage
});

type MediaCardItem = {
  id: string;
  nombre: string;
  tipo: "imagen" | "audio" | "video" | "documento";
  tipoLabel: string;
  imgUrl: string;
  usadoEnCount: number;
  carpeta: string;
  subidoPor: string;
  fechaSubido: string;
  tamano: string;
  formato: string;
  resolucion: string;
  dimensiones: string;
  altText: string;
  etiquetas: string[];
};

function AdminMediosPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Selected Card state
  const [selectedId, setSelectedId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"imagen" | "audio" | "video" | "documento">("imagen");

  // Filters State
  const [searchValue, setSearchValue] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [selectedSort, setSelectedSort] = useState("recientes");

  // Fetch from DB
  const mediaQuery = useQuery({
    queryKey: ["admin", "media"],
    queryFn: () => obtenerRecursosMultimedia()
  });

  // Mock items matching exactly the mockup rows and details
  const mockupMedias: MediaCardItem[] = [
    {
      id: "mock-med-1",
      nombre: "semilla_crece.jpg",
      tipo: "imagen",
      tipoLabel: "Imagen",
      imgUrl: imgSemilla,
      usadoEnCount: 5,
      carpeta: "Ilustraciones",
      subidoPor: "Ana Torres",
      fechaSubido: "12 may, 2024 09:20",
      tamano: "1.2 MB",
      formato: "JPG",
      resolucion: "1920 x 1080",
      dimensiones: "16:9",
      altText: "Semilla brotando en la tierra con luz natural.",
      etiquetas: ["creación", "crecimiento", "naturaleza", "fe"]
    },
    {
      id: "mock-med-2",
      nombre: "oracion_nino.jpg",
      tipo: "imagen",
      tipoLabel: "Imagen",
      imgUrl: imgIn1,
      usadoEnCount: 3,
      carpeta: "Ilustraciones",
      subidoPor: "Luis García",
      fechaSubido: "11 may, 2024 14:15",
      tamano: "850 KB",
      formato: "JPG",
      resolucion: "1200 x 800",
      dimensiones: "3:2",
      altText: "Niño orando por la mañana en su habitación.",
      etiquetas: ["oración", "niño", "fe", "devocional"]
    },
    {
      id: "mock-med-3",
      nombre: "biblia_abierta.jpg",
      tipo: "imagen",
      tipoLabel: "Imagen",
      imgUrl: imgVersiculo,
      usadoEnCount: 7,
      carpeta: "Ilustraciones",
      subidoPor: "Ana Torres",
      fechaSubido: "10 may, 2024 16:30",
      tamano: "1.5 MB",
      formato: "JPG",
      resolucion: "1920 x 1280",
      dimensiones: "3:2",
      altText: "Biblia abierta con luz de fondo cálida.",
      etiquetas: ["versículo", "palabra", "estudio", "enseñanza"]
    },
    {
      id: "mock-med-4",
      nombre: "alegria_en_dios.jpg",
      tipo: "imagen",
      tipoLabel: "Imagen",
      imgUrl: imgIn2,
      usadoEnCount: 2,
      carpeta: "Ilustraciones",
      subidoPor: "Juan Pérez",
      fechaSubido: "09 may, 2024 11:10",
      tamano: "2.1 MB",
      formato: "JPG",
      resolucion: "2000 x 2000",
      dimensiones: "1:1",
      altText: "Niño feliz saltando en el campo bajo el sol.",
      etiquetas: ["alegría", "gozo", "niños", "naturaleza"]
    },
    {
      id: "mock-med-5",
      nombre: "camino_verdad.jpg",
      tipo: "imagen",
      tipoLabel: "Imagen",
      imgUrl: imgTema2,
      usadoEnCount: 4,
      carpeta: "Ilustraciones",
      subidoPor: "María López",
      fechaSubido: "08 may, 2024 08:45",
      tamano: "950 KB",
      formato: "JPG",
      resolucion: "1920 x 1080",
      dimensiones: "16:9",
      altText: "Camino de tierra rodeado de árboles y sol.",
      etiquetas: ["senda", "camino", "verdad", "sabiduría"]
    },
    {
      id: "mock-med-6",
      nombre: "amor_projimo.jpg",
      tipo: "imagen",
      tipoLabel: "Imagen",
      imgUrl: imgTema3,
      usadoEnCount: 6,
      carpeta: "Ilustraciones",
      subidoPor: "Luis García",
      fechaSubido: "07 may, 2024 10:20",
      tamano: "1.1 MB",
      formato: "JPG",
      resolucion: "1280 x 720",
      dimensiones: "16:9",
      altText: "Manos sosteniendo un corazón rojo de lana.",
      etiquetas: ["amor", "prójimo", "compartir", "relaciones"]
    },
    {
      id: "mock-med-7",
      nombre: "ninos_aprendiendo.jpg",
      tipo: "imagen",
      tipoLabel: "Imagen",
      imgUrl: imgExploradores,
      usadoEnCount: 3,
      carpeta: "Ilustraciones",
      subidoPor: "Ana Torres",
      fechaSubido: "06 may, 2024 15:05",
      tamano: "1.8 MB",
      formato: "PNG",
      resolucion: "1500 x 1000",
      dimensiones: "3:2",
      altText: "Grupo de niños sentados aprendiendo en círculo.",
      etiquetas: ["compañerismo", "clubes", "enseñanza", "crecer"]
    },
    {
      id: "mock-med-8",
      nombre: "creacion_dios.jpg",
      tipo: "imagen",
      tipoLabel: "Imagen",
      imgUrl: imgEmbajadores,
      usadoEnCount: 2,
      carpeta: "Ilustraciones",
      subidoPor: "Juan Pérez",
      fechaSubido: "05 may, 2024 17:50",
      tamano: "2.4 MB",
      formato: "PNG",
      resolucion: "1920 x 1080",
      dimensiones: "16:9",
      altText: "Montañas verdes con el cielo al atardecer.",
      etiquetas: ["creación", "paisaje", "naturaleza", "grandiosidad"]
    }
  ];

  // Map Database media assets
  const mappedMedia = useMemo(() => {
    const dbAssets = mediaQuery.data ?? [];

    return dbAssets.map((asset, index) => {
      let format = asset.tipo_mime?.split("/")[1]?.toUpperCase() ?? "JPG";
      let sizeMB = (asset.tamano_bytes / (1024 * 1024)).toFixed(1) + " MB";
      
      const poolImgs = [imgSemilla, imgIn1, imgVersiculo, imgIn2, imgTema2, imgTema3, imgExploradores, imgEmbajadores];
      const imgUrl = asset.url_publica || poolImgs[index % poolImgs.length]!;

      return {
        id: asset.id,
        nombre: asset.titulo || `recurso_multimedia_${index + 1}.${format.toLowerCase()}`,
        tipo: asset.tipo as any,
        tipoLabel: asset.tipo.charAt(0).toUpperCase() + asset.tipo.slice(1),
        imgUrl,
        usadoEnCount: 2 + (index % 4),
        carpeta: asset.tipo === "documento" ? "Documentos" : "Ilustraciones",
        subidoPor: "Ana Torres",
        fechaSubido: new Date(asset.creado_en).toLocaleDateString("es-EC", { day: "numeric", month: "short", year: "numeric" }),
        tamano: sizeMB,
        formato: format,
        resolucion: "1920 x 1080",
        dimensiones: "16:9",
        altText: asset.texto_alternativo || "Recurso multimedia de Semillas.",
        etiquetas: ["creación", "aprendizaje", "multimedia"]
      };
    });
  }, [mediaQuery.data]);

  // Apply filters
  const filteredMedia = useMemo(() => {
    return mappedMedia.filter((item) => {
      // Tab selection
      if (item.tipo !== activeTab) return false;

      // Search query
      if (searchValue && !item.nombre.toLowerCase().includes(searchValue.toLowerCase()) && !item.etiquetas.some(t => t.toLowerCase().includes(searchValue.toLowerCase()))) {
        return false;
      }

      // Folder selection
      if (selectedFolder && item.carpeta !== selectedFolder) {
        return false;
      }

      return true;
    });
  }, [mappedMedia, activeTab, searchValue, selectedFolder]);

  // Selected item reference
  const selectedResource = useMemo(() => {
    return mappedMedia.find(m => m.id === selectedId) || mappedMedia[0]!;
  }, [mappedMedia, selectedId]);

  return (
    <div className="flex flex-col gap-6 text-left">
      {mediaQuery.isLoading && (
        <div className="flex items-center justify-center py-6">
          <Loader className="animate-spin text-primario" size={24} />
          <span className="text-sm text-neutro ml-2">Cargando recursos multimedia...</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Left block (3/4 width) */}
        <div className="flex flex-col gap-6 lg:col-span-3 min-w-0">
          
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm text-left">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eefcf4] text-[#2e9e5b]">
                <i className="fa-solid fa-photo-film text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Medios</h2>
                <p className="text-[13px] text-slate-500 mt-1">Gestiona los recursos multimedia de la plataforma.</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex rounded-xl overflow-hidden shadow-xs h-[42px]">
                <button
                  onClick={() => console.log("Subir recurso clicked")}
                  className="!bg-verde-brote hover:opacity-90 !text-white px-5 font-bold text-sm flex items-center gap-2 transition-colors h-full outline-none cursor-pointer"
                >
                  <i className="fa-solid fa-plus text-[10px]" />
                  Subir recurso
                </button>
                <div className="w-[1px] bg-white/20 h-full"></div>
                <button
                  className="!bg-verde-brote hover:opacity-90 !text-white px-3 flex items-center justify-center transition-colors h-full outline-none cursor-pointer"
                >
                  <i className="fa-solid fa-chevron-down text-[10px]" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white rounded-2xl border border-slate-100 p-1.5 shadow-sm max-w-max select-none">
            <button
              onClick={() => { setActiveTab("imagen"); const first = mappedMedia.find(m => m.tipo === "imagen"); setSelectedId(first ? first.id : ""); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "imagen"
                  ? "bg-[#eefcf4] text-[#2e9e5b]"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <i className="fa-solid fa-image" />
              Imágenes
            </button>
            <button
              onClick={() => { setActiveTab("audio"); const first = mappedMedia.find(m => m.tipo === "audio"); setSelectedId(first ? first.id : ""); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "audio"
                  ? "bg-[#6c3aed]/10 text-[#6c3aed]"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <i className="fa-solid fa-volume-high" />
              Audio
            </button>
            <button
              onClick={() => { setActiveTab("video"); const first = mappedMedia.find(m => m.tipo === "video"); setSelectedId(first ? first.id : ""); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "video"
                  ? "bg-[#ee6c4d]/10 text-[#ee6c4d]"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <i className="fa-solid fa-circle-play" />
              Video
            </button>
            <button
              onClick={() => { setActiveTab("documento"); const first = mappedMedia.find(m => m.tipo === "documento"); setSelectedId(first ? first.id : ""); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "documento"
                  ? "bg-[#17a398]/10 text-[#17a398]"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <i className="fa-solid fa-file-lines" />
              Documentos
            </button>
          </div>

          {/* Filters Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm text-left flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[220px]">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o etiqueta..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full border border-slate-100 bg-slate-50/50 font-semibold text-[13px] text-slate-800 placeholder-slate-400 focus:border-[#2e9e5b] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2e9e5b]/10 transition-all"
                />
              </div>

              {/* Tipo select */}
              <div className="relative min-w-[150px]">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-100 bg-slate-50/50 font-semibold text-[13px] text-slate-700 appearance-none focus:border-[#2e9e5b] focus:bg-white focus:outline-hidden cursor-pointer"
                >
                  <option value="imagen">Todos los tipos</option>
                  <option value="imagen">Imágenes</option>
                  <option value="audio">Audios</option>
                  <option value="video">Videos</option>
                  <option value="documento">Documentos</option>
                </select>
                <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
              </div>

              {/* Carpetas select */}
              <div className="relative min-w-[150px]">
                <select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-100 bg-slate-50/50 font-semibold text-[13px] text-slate-700 appearance-none focus:border-[#2e9e5b] focus:bg-white focus:outline-hidden cursor-pointer"
                >
                  <option value="">Todas las carpetas</option>
                  <option value="Ilustraciones">Ilustraciones</option>
                  <option value="Documentos">Documentos</option>
                </select>
                <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
              </div>

              {/* Sort select */}
              <div className="relative min-w-[150px]">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-100 bg-slate-50/50 font-semibold text-[13px] text-slate-700 appearance-none focus:border-[#2e9e5b] focus:bg-white focus:outline-hidden cursor-pointer"
                >
                  <option value="recientes">Más recientes</option>
                  <option value="antiguos">Más antiguos</option>
                </select>
                <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
              </div>

              {/* Filter funnel icon button */}
              <button
                className="w-[42px] h-[42px] rounded-full border border-slate-100 bg-slate-50/50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-sliders text-sm" />
              </button>
            </div>
          </div>

          {/* Grid Count Text */}
          <div className="text-[12px] text-slate-400 font-bold select-none">
            {filteredMedia.length} recursos encontrados
          </div>

          {/* Media grid block */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {filteredMedia.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`bg-white rounded-3xl border p-3 flex flex-col text-left transition-all relative cursor-pointer select-none group ${
                    isSelected
                      ? "border-2 border-[#2e9e5b] shadow-md shadow-[#2e9e5b]/5"
                      : "border-slate-100 hover:border-[#2e9e5b]/40 hover:shadow-sm"
                  }`}
                >
                  {/* Thumbnail Image Container */}
                  <div className="w-full h-32 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100/50 relative flex items-center justify-center shrink-0">
                    <img src={item.imgUrl} alt={item.nombre} className="w-full h-full object-cover" />
                    
                    {/* Media Type Icon Overlay bottom-left */}
                    <div className="absolute left-2.5 bottom-2.5 w-6 h-6 rounded-lg bg-black/40 backdrop-blur-xs flex items-center justify-center text-white text-[11px]">
                      {item.tipo === "imagen" && <i className="fa-regular fa-image" />}
                      {item.tipo === "audio" && <i className="fa-solid fa-volume-high" />}
                      {item.tipo === "video" && <i className="fa-solid fa-circle-play" />}
                      {item.tipo === "documento" && <i className="fa-solid fa-file-pdf" />}
                    </div>

                    {/* Selected Checkmark top-left overlay */}
                    {isSelected && (
                      <div className="absolute left-2.5 top-2.5 w-6 h-6 rounded-full bg-[#2e9e5b] flex items-center justify-center text-white text-[10px] shadow-sm">
                        <i className="fa-solid fa-check" />
                      </div>
                    )}
                  </div>

                  {/* Metadata fields */}
                  <div className="flex flex-col mt-3.5 min-w-0">
                    <span className="font-extrabold text-slate-800 text-[12.5px] truncate group-hover:text-[#2e9e5b] transition-colors">{item.nombre}</span>
                    
                    {/* Badge */}
                    <div className="flex items-center mt-1">
                      {item.tipo === "imagen" ? (
                        <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-[#eefcf4] text-[#2e9e5b] uppercase tracking-wider">Imagen</span>
                      ) : item.tipo === "audio" ? (
                        <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-[#6c3aed]/10 text-[#6c3aed] uppercase tracking-wider">Audio</span>
                      ) : item.tipo === "video" ? (
                        <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-[#ee6c4d]/10 text-[#ee6c4d] uppercase tracking-wider">Video</span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-[#17a398]/10 text-[#17a398] uppercase tracking-wider">Documento</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400 font-bold">
                      <span>Usado en {item.usadoEnCount} contenidos</span>
                      
                      <button
                        title="Opciones"
                        className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <i className="fa-solid fa-ellipsis" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table Footer / Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-slate-100 gap-4 text-xs font-semibold text-[#5c5c5c] select-none">
            <span>
              Mostrando 1 a 8 de {filteredMedia.length} recursos
            </span>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer" disabled>
                <i className="fa-solid fa-chevron-left text-[10px]" />
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#2e9e5b] text-white transition-colors font-bold cursor-pointer">
                1
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 transition-colors font-bold cursor-pointer">
                2
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 transition-colors font-bold cursor-pointer">
                3
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 transition-colors font-bold cursor-pointer">
                4
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 transition-colors font-bold cursor-pointer">
                5
              </button>
              <span className="px-1 text-slate-400">...</span>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 transition-colors font-bold cursor-pointer">
                13
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer">
                <i className="fa-solid fa-chevron-right text-[10px]" />
              </button>
            </div>
            <select className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-600 focus:outline-none cursor-pointer">
              <option>10 por página</option>
              <option>20 por página</option>
            </select>
          </div>
        </div>

        {/* Right side block (1/4 width) - Details sidebar card */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex flex-col text-left">
            <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm">Detalles del recurso</h3>
              <button
                title="Cerrar detalles"
                className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-xs" />
              </button>
            </div>

            {!selectedResource ? (
              <div className="flex flex-col items-center justify-center py-16 text-center select-none">
                <i className="fa-regular fa-image text-slate-350 text-4xl mb-3.5" />
                <p className="text-[12px] text-slate-500 font-extrabold">Ningún recurso seleccionado</p>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal max-w-[200px]">Selecciona un elemento de la galería para ver sus detalles y metadatos.</p>
              </div>
            ) : (
              <>
                {/* Selected Resource Preview Card */}
                <div className="w-full h-44 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <img src={selectedResource.imgUrl} alt={selectedResource.nombre} className="w-full h-full object-cover" />
                </div>

                {/* File info metadata */}
                <div className="flex flex-col mt-4">
                  <h4 className="font-black text-slate-800 text-[14px] break-all">{selectedResource.nombre}</h4>
                  <div className="flex mt-1">
                    {selectedResource.tipo === "imagen" ? (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-[#eefcf4] text-[#2e9e5b] uppercase tracking-wider">Imagen</span>
                    ) : selectedResource.tipo === "audio" ? (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-[#6c3aed]/10 text-[#6c3aed] uppercase tracking-wider">Audio</span>
                    ) : selectedResource.tipo === "video" ? (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-[#ee6c4d]/10 text-[#ee6c4d] uppercase tracking-wider">Video</span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-[#17a398]/10 text-[#17a398] uppercase tracking-wider">Documento</span>
                    )}
                  </div>

                  {/* Usages count */}
                  <div className="flex items-center justify-between text-[11px] font-semibold border-b border-slate-50 py-3 mt-2 select-none">
                    <span className="text-slate-400">Usado en:</span>
                    <span className="font-extrabold text-slate-800">{selectedResource.usadoEnCount} contenidos</span>
                  </div>

                  {/* Folder */}
                  <div className="flex items-center justify-between text-[11px] font-semibold border-b border-slate-50 py-3 select-none">
                    <span className="text-slate-400">Carpeta:</span>
                    <span className="font-extrabold text-slate-800">{selectedResource.carpeta}</span>
                  </div>

                  {/* Subido por */}
                  <div className="flex items-center justify-between text-[11px] font-semibold border-b border-slate-50 py-3 select-none">
                    <span className="text-slate-400">Subido por:</span>
                    <span className="font-extrabold text-slate-800">{selectedResource.subidoPor}</span>
                  </div>

                  {/* Fecha de subida */}
                  <div className="flex items-center justify-between text-[11px] font-semibold border-b border-slate-50 py-3 select-none">
                    <span className="text-slate-400">Fecha de subida:</span>
                    <span className="font-extrabold text-slate-800">{selectedResource.fechaSubido}</span>
                  </div>

                  {/* Technical Information Details */}
                  <h4 className="font-extrabold text-slate-800 text-xs mt-5 mb-2 select-none">Información técnica</h4>
                  <div className="flex flex-col gap-2.5 text-[11px] font-semibold text-slate-650">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Tamaño del archivo:</span>
                      <span className="font-extrabold text-slate-800">{selectedResource.tamano}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Formato:</span>
                      <span className="font-extrabold text-slate-800">{selectedResource.formato}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Resolución:</span>
                      <span className="font-extrabold text-slate-800">{selectedResource.resolucion}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Dimensiones:</span>
                      <span className="font-extrabold text-slate-800">{selectedResource.dimensiones}</span>
                    </div>
                  </div>

                  {/* Alternativo text */}
                  <h4 className="font-extrabold text-slate-800 text-xs mt-5 mb-2 select-none">Texto alternativo (Alt)</h4>
                  <p className="text-[11px] font-semibold text-slate-500 bg-slate-50 rounded-xl p-3 border border-slate-100 leading-relaxed text-left">
                    {selectedResource.altText}
                  </p>

                  {/* Tags */}
                  <h4 className="font-extrabold text-slate-800 text-xs mt-5 mb-3 select-none">Etiquetas</h4>
                  <div className="flex flex-wrap gap-1.5 select-none">
                    {selectedResource.etiquetas.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10.5px] font-extrabold text-slate-600">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2.5 mt-6 pt-5 border-t border-slate-50 select-none">
                    <button
                      type="button"
                      className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <i className="fa-solid fa-pen text-[10px]" />
                      Editar información
                    </button>
                    
                    <button
                      onClick={async () => {
                        if (confirm("¿Estás seguro de que deseas eliminar este recurso?")) {
                          await eliminarRecursoMultimedia(selectedResource.id);
                          queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
                          setSelectedId("");
                        }
                      }}
                      className="w-full bg-white hover:bg-red-50/50 border border-red-200 text-red-650 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <i className="fa-solid fa-trash text-[10px]" />
                      Eliminar recurso
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

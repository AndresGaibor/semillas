import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { obtenerActividades } from "../features/activities/activities.api";
import { eliminarActividad } from "../features/admin/admin.api";
import { obtenerTemas } from "../features/themes/themes.api";
import { obtenerSendas } from "../features/sendas/sendas.api";
import { obtenerGruposEdad } from "../features/catalog/catalog.api";
import { Loader } from "lucide-react";
import type { Actividad, Tema } from "../shared/api/api";

export const Route = createFileRoute("/admin/actividades")({
  component: AdminActivitiesPage
});

type ActivityTableRow = {
  id: string;
  titulo: string;
  consigna: string;
  tipoIcon: string;
  tipoIconColor: string;
  tipoBadgeBg: string;
  tipoNombre: string; // Theme name in mockup (shifted)
  sendaNombre: string; // Senda name in mockup
  sendaIconColor: string;
  franjaEdad: string; // Age group
  xpText: string;
  estado: string;
  fechaCreacion: string;
};

function AdminActivitiesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Filters State
  const [searchValue, setSearchValue] = useState("");
  const [selectedTemaId, setSelectedTemaId] = useState("");
  const [selectedSendaId, setSelectedSendaId] = useState("");
  const [selectedAgeGroupId, setSelectedAgeGroupId] = useState("");
  const [activeTab, setActiveTab] = useState("todos");

  // Fetch API data
  const activitiesQuery = useQuery({
    queryKey: ["admin", "activities"],
    queryFn: () => obtenerActividades()
  });

  const temasQuery = useQuery({
    queryKey: ["admin", "themes"],
    queryFn: () => obtenerTemas()
  });

  const sendasQuery = useQuery({
    queryKey: ["sendas"],
    queryFn: () => obtenerSendas()
  });

  const ageGroupsQuery = useQuery({
    queryKey: ["catalog", "age-groups"],
    queryFn: () => obtenerGruposEdad()
  });

  // Safe typed arrays
  const dbActivities = (activitiesQuery.data ?? []) as Actividad[];
  const temasBase = (temasQuery.data ?? []) as Tema[];
  const sendasBase = (sendasQuery.data ?? []) as any[];
  const ageGroupsBase = (ageGroupsQuery.data ?? []) as any[];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: eliminarActividad,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "activities"] });
    }
  });

  // Mock Senda helper for coloring
  const getSendaColorClasses = (sendaName: string) => {
    const name = sendaName.toLowerCase();
    if (name.includes("padre") || name.includes("amor") || name.includes("confío")) {
      return { bg: "bg-[#3d8bd4]/10", text: "text-[#3d8bd4]", icon: "fa-heart" };
    }
    if (name.includes("hijo") || name.includes("jesús") || name.includes("salvador")) {
      return { bg: "bg-[#e9a23b]/10", text: "text-[#e9a23b]", icon: "fa-cross" };
    }
    if (name.includes("espíritu") || name.includes("sanas") || name.includes("prójimo")) {
      return { bg: "bg-[#17a398]/10", text: "text-[#17a398]", icon: "fa-leaf" };
    }
    return { bg: "bg-slate-100", text: "text-slate-500", icon: "fa-star" };
  };

  // 1. Initial Mock Rows matching the mockup table exactly
  const mockupActivities: ActivityTableRow[] = [
    {
      id: "mock-1",
      titulo: "¿Quién dijo esto?",
      consigna: "Selecciona la respuesta correcta",
      tipoIcon: "fa-circle-question",
      tipoIconColor: "text-purple-600",
      tipoBadgeBg: "bg-purple-100",
      tipoNombre: "La creación de Dios",
      sendaNombre: "Dios y su amor",
      sendaIconColor: "text-[#3d8bd4]",
      franjaEdad: "Pequeños (6-8)",
      xpText: "+20 XP",
      estado: "publicada",
      fechaCreacion: "15 may. 2024"
    },
    {
      id: "mock-2",
      titulo: "Cartas: Frutos del Espíritu",
      consigna: "Conoce y memoriza",
      tipoIcon: "fa-book-open",
      tipoIconColor: "text-amber-500",
      tipoBadgeBg: "bg-amber-100",
      tipoNombre: "El perdón",
      sendaNombre: "Relaciones sanas",
      sendaIconColor: "text-[#17a398]",
      franjaEdad: "Medianos (9-11)",
      xpText: "+15 XP",
      estado: "publicada",
      fechaCreacion: "14 may. 2024"
    },
    {
      id: "mock-3",
      titulo: "Completa el versículo",
      consigna: "Filipenses 4:13",
      tipoIcon: "fa-pen-clip",
      tipoIconColor: "text-blue-500",
      tipoBadgeBg: "bg-blue-100",
      tipoNombre: "El Buen Samaritano",
      sendaNombre: "Amor al prójimo",
      sendaIconColor: "text-[#17a398]",
      franjaEdad: "Grandes (12-14)",
      xpText: "+25 XP",
      estado: "revision",
      fechaCreacion: "13 may. 2024"
    },
    {
      id: "mock-4",
      titulo: "¿Verdadero o falso?",
      consigna: "Pon a prueba tu conocimiento",
      tipoIcon: "fa-circle-check",
      tipoIconColor: "text-emerald-500",
      tipoBadgeBg: "bg-emerald-100",
      tipoNombre: "Daniel en el foso de los leones",
      sendaNombre: "Fe y valentía",
      sendaIconColor: "text-[#3d8bd4]",
      franjaEdad: "Medianos (9-11)",
      xpText: "+15 XP",
      estado: "publicada",
      fechaCreacion: "12 may. 2024"
    },
    {
      id: "mock-5",
      titulo: "Sopa de letras",
      consigna: "Encuentra las palabras",
      tipoIcon: "fa-border-all",
      tipoIconColor: "text-violet-600",
      tipoBadgeBg: "bg-violet-100",
      tipoNombre: "La oración",
      sendaNombre: "Vida con Jesús",
      sendaIconColor: "text-[#e9a23b]",
      franjaEdad: "Grandes (12-14)",
      xpText: "+20 XP",
      estado: "publicada",
      fechaCreacion: "11 may. 2024"
    },
    {
      id: "mock-6",
      titulo: "Ordena el versículo",
      consigna: "Pon en el orden correcto",
      tipoIcon: "fa-puzzle-piece",
      tipoIconColor: "text-orange-500",
      tipoBadgeBg: "bg-orange-100",
      tipoNombre: "El perdón",
      sendaNombre: "Relaciones sanas",
      sendaIconColor: "text-[#17a398]",
      franjaEdad: "Pequeños (6-8)",
      xpText: "+20 XP",
      estado: "borrador",
      fechaCreacion: "10 may. 2024"
    },
    {
      id: "mock-7",
      titulo: "Memoria: Pasajes clave",
      consigna: "Encuentra los pares",
      tipoIcon: "fa-image",
      tipoIconColor: "text-sky-500",
      tipoBadgeBg: "bg-sky-100",
      tipoNombre: "Dios cuida de mí",
      sendaNombre: "Confío en Dios",
      sendaIconColor: "text-[#3d8bd4]",
      franjaEdad: "Pequeños (6-8)",
      xpText: "+15 XP",
      estado: "publicada",
      fechaCreacion: "9 may. 2024"
    },
    {
      id: "mock-8",
      titulo: "Desafío express",
      consigna: "Responde rápido",
      tipoIcon: "fa-star",
      tipoIconColor: "text-pink-500",
      tipoBadgeBg: "bg-pink-100",
      tipoNombre: "La creación de Dios",
      sendaNombre: "Dios y su amor",
      sendaIconColor: "text-[#3d8bd4]",
      franjaEdad: "Medianos (9-11)",
      xpText: "+10 XP",
      estado: "revision",
      fechaCreacion: "8 may. 2024"
    }
  ];

  // Helper for DB activities types mapping to icon classes
  const getActivityTypeInfo = (codigo: string) => {
    switch (codigo.toLowerCase()) {
      case "quiz":
      case "cuestionario":
        return { icon: "fa-circle-question", color: "text-purple-600", bg: "bg-purple-100" };
      case "flashcard":
      case "tarjetas":
        return { icon: "fa-book-open", color: "text-amber-500", bg: "bg-amber-100" };
      case "completar":
      case "completar-versiculo":
        return { icon: "fa-pen-clip", color: "text-blue-500", bg: "bg-blue-100" };
      case "verdadero-falso":
        return { icon: "fa-circle-check", color: "text-emerald-500", bg: "bg-emerald-100" };
      case "sopa":
      case "sopa-letras":
        return { icon: "fa-border-all", color: "text-violet-600", bg: "bg-violet-100" };
      case "ordenar":
      case "ordenar-versiculo":
        return { icon: "fa-puzzle-piece", color: "text-orange-500", bg: "bg-orange-100" };
      case "memoria":
        return { icon: "fa-image", color: "text-sky-500", bg: "bg-sky-100" };
      default:
        return { icon: "fa-star", color: "text-pink-500", bg: "bg-pink-100" };
    }
  };

  // Helper for DB activities age range formatting
  const getAgeGroupLabel = (ageGroupUuid: string) => {
    const ageGroup = ageGroupsBase.find(g => g.id === ageGroupUuid);
    if (!ageGroup) return "Pequeños (6-8)";
    const name = ageGroup.nombre.toLowerCase();
    if (name.includes("semilla")) return "Pequeños (6-8)";
    if (name.includes("explora")) return "Medianos (9-11)";
    if (name.includes("embaja")) return "Grandes (12-14)";
    return "Pequeños (6-8)";
  };

  // Map DB activities
  const mappedActivities = useMemo(() => {
    return dbActivities.map((act) => {
      const typeInfo = getActivityTypeInfo(act.tipo_actividad?.codigo ?? "quiz");
      const franja = getAgeGroupLabel(act.grupo_edad_id);
      const matchingTema = temasBase.find(t => t.id === act.tema_id);
      const temaNombre = matchingTema?.titulo ?? "La creación de Dios";
      const sendaNombre = matchingTema?.senda?.nombre ?? "Dios y su amor";
      const dateObj = act.creado_en ? new Date(act.creado_en) : new Date();
      const dateStr = dateObj.toLocaleDateString("es-EC", { day: "numeric", month: "short", year: "numeric" });

      return {
        id: act.id,
        titulo: act.titulo ?? "Actividad de la Senda",
        consigna: act.consigna ?? "Completa el ejercicio",
        tipoIcon: typeInfo.icon,
        tipoIconColor: typeInfo.color,
        tipoBadgeBg: typeInfo.bg,
        tipoNombre: temaNombre,
        sendaNombre,
        sendaIconColor: getSendaColorClasses(sendaNombre).text,
        franjaEdad: franja,
        xpText: `+${act.xp_recompensa || 10} XP`,
        estado: act.obligatorio ? "publicada" : "borrador",
        fechaCreacion: dateStr
      };
    });
  }, [dbActivities, temasBase, sendasBase, ageGroupsBase]);

  // Apply filters
  const filteredActivities = useMemo(() => {
    return mappedActivities.filter((act) => {
      // Tab Filter
      if (activeTab === "borrador" && act.estado !== "borrador") return false;
      if (activeTab === "revision" && act.estado !== "revision") return false;
      if (activeTab === "publicada" && act.estado !== "publicada") return false;
      
      // Icon filters based on tab click (Quiz, Flashcard, etc.)
      if (activeTab === "quiz" && act.tipoIcon !== "fa-circle-question") return false;
      if (activeTab === "flashcard" && act.tipoIcon !== "fa-book-open") return false;
      if (activeTab === "completar" && act.tipoIcon !== "fa-pen-clip") return false;
      if (activeTab === "verdadero-falso" && act.tipoIcon !== "fa-circle-check") return false;
      if (activeTab === "sopa" && act.tipoIcon !== "fa-border-all") return false;

      // Search text filter
      if (searchValue && !act.titulo.toLowerCase().includes(searchValue.toLowerCase()) && !act.consigna.toLowerCase().includes(searchValue.toLowerCase())) {
        return false;
      }

      // Senda filter
      if (selectedSendaId) {
        const matchingSenda = sendasBase.find((s) => s.id === selectedSendaId);
        if (matchingSenda && act.sendaNombre !== matchingSenda.nombre) {
          return false;
        }
      }

      // Topic/Theme filter
      if (selectedTemaId) {
        const matchingTema = temasBase.find((t) => t.id === selectedTemaId);
        if (matchingTema && act.tipoNombre !== matchingTema.titulo) {
          return false;
        }
      }

      // Age Group filter
      if (selectedAgeGroupId) {
        const matchingAgeGroup = ageGroupsBase.find((g) => g.id === selectedAgeGroupId);
        if (matchingAgeGroup) {
          const cleanName = matchingAgeGroup.nombre.toLowerCase();
          if (cleanName.includes("semilla") && !act.franjaEdad.includes("Pequeños")) return false;
          if (cleanName.includes("explora") && !act.franjaEdad.includes("Medianos")) return false;
          if (cleanName.includes("embaja") && !act.franjaEdad.includes("Grandes")) return false;
        }
      }

      return true;
    });
  }, [mappedActivities, activeTab, searchValue, selectedTemaId, selectedSendaId, selectedAgeGroupId, sendasBase, temasBase, ageGroupsBase]);

  // Tab count stats
  const tabCounts = useMemo(() => {
    const stats = { todos: mappedActivities.length, quiz: 0, flashcards: 0, completar: 0, verdaderoFalso: 0, sopa: 0 };
    mappedActivities.forEach((a) => {
      if (a.tipoIcon === "fa-circle-question") stats.quiz++;
      else if (a.tipoIcon === "fa-book-open") stats.flashcards++;
      else if (a.tipoIcon === "fa-pen-clip") stats.completar++;
      else if (a.tipoIcon === "fa-circle-check") stats.verdaderoFalso++;
      else if (a.tipoIcon === "fa-border-all") stats.sopa++;
    });
    return stats;
  }, [mappedActivities]);

  const summaryStats = useMemo(() => {
    let publicadas = 0;
    let revision = 0;
    let borradores = 0;
    let archivadas = 0;
    
    mappedActivities.forEach((a) => {
      if (a.estado === "publicada") publicadas++;
      else if (a.estado === "revision") revision++;
      else if (a.estado === "borrador") borradores++;
      else if (a.estado === "archivada") archivadas++;
    });

    const total = mappedActivities.length || 1;
    return {
      total: mappedActivities.length,
      publicadas,
      revision,
      borradores,
      archivadas,
      pubPct: Math.round((publicadas / total) * 100),
      revPct: Math.round((revision / total) * 100),
      borPct: Math.round((borradores / total) * 100),
      arcPct: Math.round((archivadas / total) * 100),
    };
  }, [mappedActivities]);

  const clearFilters = () => {
    setSearchValue("");
    setSelectedTemaId("");
    setSelectedSendaId("");
    setSelectedAgeGroupId("");
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      {activitiesQuery.isLoading && (
        <div className="flex items-center justify-center py-6">
          <Loader className="animate-spin text-primario" size={24} />
          <span className="text-sm text-neutro ml-2">Cargando actividades del panel...</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Left block (3/4 width) */}
        <div className="flex flex-col gap-6 lg:col-span-3 min-w-0">
          
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm text-left">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
                <i className="fa-solid fa-pen-to-square text-2xl text-orange-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Actividades</h2>
                <p className="text-[13px] text-slate-500 mt-1">Crea, administra y organiza actividades para fortalecer el aprendizaje en cada senda.</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex rounded-xl overflow-hidden shadow-xs h-[42px]">
                <button
                  onClick={() => navigate({ to: "/admin/temas" })}
                  className="!bg-verde-brote hover:opacity-90 !text-white px-5 font-bold text-sm flex items-center gap-2 transition-colors h-full outline-none cursor-pointer"
                >
                  <i className="fa-solid fa-plus text-[10px]" />
                  Nueva actividad
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

          {/* Filters card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm text-left flex flex-col gap-4">
            {/* Custom Tabs with Icons */}
            <div className="flex gap-4 border-b border-slate-100 pb-px mb-2 text-left select-none overflow-x-auto whitespace-nowrap scrollbar-none">
              <button
                onClick={() => setActiveTab("todos")}
                className={`flex items-center gap-2 pb-3 font-bold text-[13px] border-b-2 transition-colors cursor-pointer outline-none ${
                  activeTab === "todos" ? "border-[#2e9e5b] text-[#2e9e5b]" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <i className="fa-solid fa-square-check text-[#2e9e5b]" />
                Todas
              </button>
              <button
                onClick={() => setActiveTab("quiz")}
                className={`flex items-center gap-2 pb-3 font-bold text-[13px] border-b-2 transition-colors cursor-pointer outline-none ${
                  activeTab === "quiz" ? "border-[#2e9e5b] text-[#2e9e5b]" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <i className="fa-solid fa-circle-question text-purple-600" />
                Quiz
                {tabCounts.quiz > 0 && <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-700 font-bold">{tabCounts.quiz}</span>}
              </button>
              <button
                onClick={() => setActiveTab("flashcard")}
                className={`flex items-center gap-2 pb-3 font-bold text-[13px] border-b-2 transition-colors cursor-pointer outline-none ${
                  activeTab === "flashcard" ? "border-[#2e9e5b] text-[#2e9e5b]" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <i className="fa-solid fa-book-open text-amber-500" />
                Flashcards
                {tabCounts.flashcards > 0 && <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-700 font-bold">{tabCounts.flashcards}</span>}
              </button>
              <button
                onClick={() => setActiveTab("completar")}
                className={`flex items-center gap-2 pb-3 font-bold text-[13px] border-b-2 transition-colors cursor-pointer outline-none ${
                  activeTab === "completar" ? "border-[#2e9e5b] text-[#2e9e5b]" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <i className="fa-solid fa-pen-clip text-blue-500" />
                Completar versículo
              </button>
              <button
                onClick={() => setActiveTab("verdadero-falso")}
                className={`flex items-center gap-2 pb-3 font-bold text-[13px] border-b-2 transition-colors cursor-pointer outline-none ${
                  activeTab === "verdadero-falso" ? "border-[#2e9e5b] text-[#2e9e5b]" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <i className="fa-solid fa-circle-check text-emerald-500" />
                Verdadero/Falso
              </button>
              <button
                onClick={() => setActiveTab("sopa")}
                className={`flex items-center gap-2 pb-3 font-bold text-[13px] border-b-2 transition-colors cursor-pointer outline-none ${
                  activeTab === "sopa" ? "border-[#2e9e5b] text-[#2e9e5b]" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <i className="fa-solid fa-border-all text-violet-600" />
                Sopa de letras
              </button>
              <button className="flex items-center gap-2 pb-3 font-bold text-[13px] border-b-2 border-transparent text-slate-500 hover:text-slate-700 cursor-pointer outline-none">
                Más
                <i className="fa-solid fa-chevron-down text-[10px] text-slate-400" />
              </button>
            </div>

            {/* Inputs & Selects Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[200px]">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Buscar actividades..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full border border-slate-100 bg-slate-50/50 font-semibold text-[13px] text-slate-800 placeholder-slate-400 focus:border-[#2e9e5b] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2e9e5b]/10 transition-all"
                />
              </div>

              {/* Tema select */}
              <div className="relative min-w-[150px]">
                <select
                  value={selectedTemaId}
                  onChange={(e) => setSelectedTemaId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-100 bg-slate-50/50 font-semibold text-[13px] text-slate-700 appearance-none focus:border-[#2e9e5b] focus:bg-white focus:outline-hidden cursor-pointer"
                >
                  <option value="">Todos los temas</option>
                  {temasBase.map((t) => (
                    <option key={t.id} value={t.id}>{t.titulo}</option>
                  ))}
                </select>
                <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
              </div>

              {/* Senda select */}
              <div className="relative min-w-[150px]">
                <select
                  value={selectedSendaId}
                  onChange={(e) => setSelectedSendaId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-100 bg-slate-50/50 font-semibold text-[13px] text-slate-700 appearance-none focus:border-[#2e9e5b] focus:bg-white focus:outline-hidden cursor-pointer"
                >
                  <option value="">Todas las sendas</option>
                  {sendasBase.map((s) => (
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                  ))}
                </select>
                <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
              </div>

              {/* Franja select */}
              <div className="relative min-w-[150px]">
                <select
                  value={selectedAgeGroupId}
                  onChange={(e) => setSelectedAgeGroupId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-100 bg-slate-50/50 font-semibold text-[13px] text-slate-700 appearance-none focus:border-[#2e9e5b] focus:bg-white focus:outline-hidden cursor-pointer"
                >
                  <option value="">Todas las franjas</option>
                  {ageGroupsBase.map((g) => (
                    <option key={g.id} value={g.id}>{g.nombre}</option>
                  ))}
                </select>
                <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
              </div>

              {/* Estado select */}
              <div className="relative min-w-[150px]">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-100 bg-slate-50/50 font-semibold text-[13px] text-slate-700 appearance-none focus:border-[#2e9e5b] focus:bg-white focus:outline-hidden cursor-pointer"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="publicada">Publicadas</option>
                  <option value="revision">En revisión</option>
                  <option value="borrador">Borradores</option>
                </select>
                <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
              </div>

              {/* Limpiar filters */}
              {(searchValue || selectedTemaId || selectedSendaId || selectedAgeGroupId) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-full border border-slate-200 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>

          {/* Table Container Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col text-left">
            
            {/* Counter and sort row */}
            <div className="flex items-center justify-between mb-4 select-none">
              <span className="text-[13px] font-black text-slate-700">
                {filteredActivities.length} actividades encontradas
              </span>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span>Ordenar por:</span>
                <select className="border border-slate-100 rounded-lg px-2.5 py-1 bg-slate-50 font-bold text-slate-600 focus:outline-none cursor-pointer">
                  <option>Más recientes</option>
                  <option>Mayor XP</option>
                  <option>Por orden de lección</option>
                </select>
              </div>
            </div>

            {/* Table wrapper for scroll */}
            <div className="w-full overflow-x-auto select-none">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-50 text-[10px] font-black tracking-wider text-slate-400 uppercase select-none">
                    <th className="py-4 px-2 w-[40px] text-center">
                      <input type="checkbox" className="rounded border-slate-300 text-[#2e9e5b] focus:ring-[#2e9e5b] cursor-pointer" />
                    </th>
                    <th className="py-4 px-4 w-[25%]">Actividad</th>
                    <th className="py-4 px-4">Tipo</th>
                    <th className="py-4 px-4">Tema</th>
                    <th className="py-4 px-4">Senda</th>
                    <th className="py-4 px-2 text-center">XP</th>
                    <th className="py-4 px-4 text-center">Estado</th>
                    <th className="py-4 px-4">Creada</th>
                    <th className="py-4 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50/50">
                  {filteredActivities.slice(0, 8).map((act) => {
                    const sendaColor = getSendaColorClasses(act.sendaNombre);
                    return (
                      <tr key={act.id} className="hover:bg-slate-50/40 transition-colors group cursor-pointer">
                        <td className="py-4 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" className="rounded border-slate-300 text-[#2e9e5b] focus:ring-[#2e9e5b] cursor-pointer" />
                        </td>
                        
                        {/* Actividad details */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${act.tipoBadgeBg} flex items-center justify-center shrink-0`}>
                              <i className={`fa-solid ${act.tipoIcon} text-xs ${act.tipoIconColor}`} />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-extrabold text-slate-800 text-[13px] truncate group-hover:text-[#2e9e5b] transition-colors">{act.titulo}</span>
                              <span className="text-[11px] text-slate-400 truncate mt-0.5">{act.consigna}</span>
                            </div>
                          </div>
                        </td>

                        {/* Tipo (displays theme) */}
                        <td className="py-4 px-4 font-bold text-slate-700 text-[12px]">
                          {act.tipoNombre}
                        </td>

                        {/* Tema (displays Senda) */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full ${sendaColor.bg} flex items-center justify-center shrink-0`}>
                              <i className={`fa-solid ${sendaColor.icon} text-[9px] ${sendaColor.text}`} />
                            </div>
                            <span className="font-bold text-slate-600 text-[12px] whitespace-nowrap">{act.sendaNombre}</span>
                          </div>
                        </td>

                        {/* Senda (displays Age range) */}
                        <td className="py-4 px-4 font-semibold text-slate-500 text-[12px] whitespace-nowrap">
                          {act.franjaEdad}
                        </td>

                        {/* XP */}
                        <td className="py-4 px-2 text-center font-black text-[#2e9e5b] text-[12px] whitespace-nowrap">
                          {act.xpText}
                        </td>

                        {/* Estado */}
                        <td className="py-4 px-4 text-center">
                          {act.estado === "publicada" ? (
                            <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#eefcf4] text-[#2e9e5b] capitalize">
                              Publicada
                            </span>
                          ) : act.estado === "revision" ? (
                            <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fff8eb] text-[#ea580c] capitalize whitespace-nowrap">
                              En revisión
                            </span>
                          ) : act.estado === "borrador" ? (
                            <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 capitalize">
                              Borrador
                            </span>
                          ) : (
                            <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-600 capitalize">
                              Archivada
                            </span>
                          )}
                        </td>

                        {/* Creada */}
                        <td className="py-4 px-4 text-slate-400 font-bold text-[11px] whitespace-nowrap">
                          {act.fechaCreacion}
                        </td>

                        {/* Acciones */}
                        <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => navigate({ to: `/app/actividades/${act.id}` as any })}
                              title="Vista previa"
                              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            >
                              <i className="fa-solid fa-eye text-xs" />
                            </button>
                            <button
                              onClick={() => navigate({ to: `/admin/temas` })}
                              title="Editar"
                              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            >
                              <i className="fa-solid fa-pencil text-xs" />
                            </button>
                            <button
                              title="Más opciones"
                              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            >
                              <i className="fa-solid fa-ellipsis-vertical text-xs" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-slate-100 gap-4 text-xs font-semibold text-[#5c5c5c] select-none">
              <span>
                Mostrando {filteredActivities.length > 0 ? "1" : "0"} a {Math.min(8, filteredActivities.length)} de {filteredActivities.length} actividades
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
        </div>

        {/* Right side widgets (1/4 width) */}
        <div className="flex flex-col gap-6">
          
          {/* Activity summary card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col text-left">
            <h3 className="font-extrabold text-slate-800 text-sm">Resumen de actividades</h3>
            <span className="text-[10px] text-slate-400 mt-1 font-semibold uppercase tracking-wider select-none">Total de actividades</span>
            <div className="text-5xl font-black text-[#6c3aed] mt-4 mb-5 select-none">{summaryStats.total}</div>
            <div className="flex flex-col gap-4 text-xs font-semibold text-slate-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#eefcf4] text-[#2e9e5b] flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-check text-[10px]" />
                  </div>
                  <span>Publicadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-800">{summaryStats.publicadas}</span>
                  <span className="text-slate-400 text-[10px]">{summaryStats.pubPct}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#fff8eb] text-[#ea580c] flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-clock text-[10px]" />
                  </div>
                  <span>En revisión</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-800">{summaryStats.revision}</span>
                  <span className="text-slate-400 text-[10px]">{summaryStats.revPct}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-pencil text-[9px]" />
                  </div>
                  <span>Borradores</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-800">{summaryStats.borradores}</span>
                  <span className="text-slate-400 text-[10px]">{summaryStats.borPct}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#6c3aed]/10 text-[#6c3aed] flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-archive text-[10px]" />
                  </div>
                  <span>Archivadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-800">{summaryStats.archivadas}</span>
                  <span className="text-slate-400 text-[10px]">{summaryStats.arcPct}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Average XP Widget */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex flex-col text-left">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-800 text-sm">XP promedio por actividad</h3>
              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-black bg-[#eefcf4] text-[#2e9e5b]">
                +18 XP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Sigue creando actividades que motiven y desafíen a los niños.</p>
            
            {/* Sparkline chart of 5 bars */}
            <div className="flex items-end justify-end gap-1.5 h-10 mt-4 select-none pr-2">
              <div className="w-2.5 bg-slate-100 rounded-sm h-[35%]" />
              <div className="w-2.5 bg-slate-100 rounded-sm h-[60%]" />
              <div className="w-2.5 bg-slate-200 rounded-sm h-[45%]" />
              <div className="w-2.5 bg-slate-100 rounded-sm h-[80%]" />
              <div className="w-2.5 bg-slate-300 rounded-sm h-[100%]" />
            </div>
          </div>

          {/* Tips Widget */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex flex-col text-left gap-4">
            <h3 className="font-extrabold text-slate-800 text-sm">Consejos rápidos</h3>
            
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                <i className="fa-solid fa-wand-magic-sparkles text-xs" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-slate-700 text-[12px]">Varía los tipos de actividades</span>
                <span className="text-[11px] text-slate-400 mt-0.5 leading-snug">Combina diferentes formatos para mantener el aprendizaje dinámico y entretenido.</span>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <i className="fa-solid fa-pen-nib text-xs" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-slate-700 text-[12px]">Alinea con la senda</span>
                <span className="text-[11px] text-slate-400 mt-0.5 leading-snug">Asegúrate de que cada actividad refuerce el tema y objetivo de la senda.</span>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center shrink-0 mt-0.5">
                <i className="fa-solid fa-puzzle-piece text-xs" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-slate-700 text-[12px]">Revisa antes de publicar</span>
                <span className="text-[11px] text-slate-400 mt-0.5 leading-snug">Una buena revisión garantiza claridad, precisión y una mejor experiencia para los niños.</span>
              </div>
            </div>

            {/* Bottom green card banner */}
            <div className="mt-2 bg-[#eefcf4] rounded-2xl p-4 border border-[#e2f7ea] flex gap-3 text-left">
              <div className="w-7 h-7 rounded-full bg-[#2e9e5b]/10 flex items-center justify-center shrink-0 text-[#2e9e5b]">
                <i className="fa-solid fa-leaf text-xs" />
              </div>
              <p className="text-[11px] font-bold text-[#123b2c] leading-snug mt-0.5">
                Cada actividad es una semilla que fortalece la fe y el corazón de nuestros niños. 💚
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

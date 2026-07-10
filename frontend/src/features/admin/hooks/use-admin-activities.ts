import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { eliminarActividad, obtenerActividadesAdmin, obtenerTemasAdmin, type ActividadAdmin } from "../admin.api";
import { obtenerSendas } from "@/features/sendas/sendas.api";
import { obtenerGruposEdad } from "@/features/catalog/catalog.api";
import { getSendaColorClasses, getActivityTypeInfo, getAgeGroupLabel } from "../componentes/actividades.helpers";
import type { ActivityTableRow } from "../componentes/admin-activities-table";
import type { Tema, Senda } from "@/shared/api/api";

export function useAdminActivities() {
  const queryClient = useQueryClient();

  const [searchValue, setSearchValue] = useState("");
  const [selectedTemaId, setSelectedTemaId] = useState("");
  const [selectedSendaId, setSelectedSendaId] = useState("");
  const [selectedAgeGroupId, setSelectedAgeGroupId] = useState("");
  const [activeTab, setActiveTab] = useState("todos");
  const [paginaActual, setPaginaActual] = useState(1);
  const [porPagina, setPorPagina] = useState(10);

  const activitiesQuery = useQuery({
    queryKey: ["admin", "activities"],
    queryFn: () => obtenerActividadesAdmin(),
  });
  const temasQuery = useQuery({ queryKey: ["admin", "themes"], queryFn: () => obtenerTemasAdmin() });
  const sendasQuery = useQuery({ queryKey: ["sendas"], queryFn: () => obtenerSendas() });
  const ageGroupsQuery = useQuery({ queryKey: ["catalog", "age-groups"], queryFn: () => obtenerGruposEdad() });

  const dbActivities: ActividadAdmin[] = activitiesQuery.data?.actividades ?? [];
  const temasBase: Tema[] = temasQuery.data ?? [];
  const sendasBase: Senda[] = sendasQuery.data ?? [];
  const ageGroupsBase = ageGroupsQuery.data ?? [];

  const deleteMutation = useMutation({
    mutationFn: eliminarActividad,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "activities"] }),
  });

  const mappedActivities = useMemo(() => {
    return dbActivities.map((act): ActivityTableRow => {
      const typeInfo = getActivityTypeInfo(act.tipo_actividad?.codigo ?? "quiz");
      const franja = getAgeGroupLabel(act.grupo_edad_id, ageGroupsBase);
      const tema = act.tema;
      const temaNombre = tema?.titulo ?? "Sin tema";
      const temaSlug = tema?.slug ?? "";
      const temaEstado = tema?.estado ?? "borrador";
      const sendaColor = getSendaColorClasses(tema?.senda?.nombre ?? "");
      const dateObj = act.creado_en ? new Date(act.creado_en) : new Date();
      const dateStr = dateObj.toLocaleDateString("es-EC", { day: "numeric", month: "short", year: "numeric" });

      return {
        id: act.id,
        titulo: act.titulo ?? "Actividad sin título",
        consigna: act.consigna ?? "Sin consigna",
        tipoIcon: typeInfo.icon,
        tipoIconColor: typeInfo.color,
        tipoBadgeBg: typeInfo.bg,
        tipoNombre: act.tipo_actividad?.nombre ?? "Quiz",
        tipoCodigo: act.tipo_actividad?.codigo ?? "quiz",
        temaId: act.tema_id,
        temaNombre,
        pasoId: act.paso_id,
        franjaEdad: franja,
        xpText: `+${act.xp_recompensa || 10} XP`,
        xp: act.xp_recompensa || 10,
        estado: act.obligatorio ? "publicada" : "borrador",
        fechaCreacion: dateStr,
        dificultad: act.dificultad,
        consignaRaw: act.consigna,
        opciones: [],
        temaSlug,
        temaEstado,
        sendaColor,
        grupoEdadId: act.grupo_edad_id,
      };
    });
  }, [dbActivities, ageGroupsBase]);

  const filteredActivities = useMemo(() => {
    return mappedActivities.filter((act) => {
      if (activeTab === "borrador" && act.estado !== "borrador") return false;
      if (activeTab === "revision" && act.estado !== "revision") return false;
      if (activeTab === "publicada" && act.estado !== "publicada") return false;
      if (activeTab === "quiz" && act.tipoCodigo !== "quiz") return false;
      if (activeTab === "flashcard" && act.tipoCodigo !== "flashcard") return false;
      if (activeTab === "completar" && act.tipoCodigo !== "completar_verso") return false;
      if (activeTab === "verdadero-falso" && act.tipoCodigo !== "verdadero_falso") return false;
      if (activeTab === "sopa" && act.tipoCodigo !== "sopa_letras") return false;
      if (searchValue && !act.titulo.toLowerCase().includes(searchValue.toLowerCase()) && !act.consigna.toLowerCase().includes(searchValue.toLowerCase())) return false;
      if (selectedSendaId) {
        const matchingSenda = sendasBase.find((s) => s.id === selectedSendaId);
        if (matchingSenda && act.sendaColor.nombre !== matchingSenda.nombre) return false;
      }
      if (selectedTemaId) {
        const matchingTema = temasBase.find((t) => t.id === selectedTemaId);
        if (matchingTema && act.temaNombre !== matchingTema.titulo) return false;
      }
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

  const paginatedActivities = useMemo(() => {
    const start = (paginaActual - 1) * porPagina;
    return filteredActivities.slice(start, start + porPagina);
  }, [filteredActivities, paginaActual, porPagina]);

  const totalPaginas = useMemo(() => {
    return Math.ceil(filteredActivities.length / porPagina) || 1;
  }, [filteredActivities.length, porPagina]);

  const tabCounts = useMemo(() => {
    const stats = { todos: mappedActivities.length, quiz: 0, flashcards: 0, completar: 0, verdaderoFalso: 0, sopa: 0 };
    mappedActivities.forEach((a) => {
      if (a.tipoCodigo === "quiz") stats.quiz++;
      else if (a.tipoCodigo === "flashcard") stats.flashcards++;
      else if (a.tipoCodigo === "completar_verso") stats.completar++;
      else if (a.tipoCodigo === "verdadero_falso") stats.verdaderoFalso++;
      else if (a.tipoCodigo === "sopa_letras") stats.sopa++;
    });
    return stats;
  }, [mappedActivities]);

  const summaryStats = useMemo(() => {
    let publicadas = 0, revision = 0, borradores = 0, archivadas = 0;
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

  const tieneFiltros = !!(searchValue || selectedTemaId || selectedSendaId || selectedAgeGroupId);

  return {
    searchValue, setSearchValue,
    selectedTemaId, setSelectedTemaId,
    selectedSendaId, setSelectedSendaId,
    selectedAgeGroupId, setSelectedAgeGroupId,
    activeTab, setActiveTab,
    paginaActual, setPaginaActual,
    porPagina, setPorPagina,
    isLoading: activitiesQuery.isLoading,
    filteredActivities: paginatedActivities,
    filteredTotal: filteredActivities.length,
    totalPaginas,
    tabCounts,
    summaryStats,
    clearFilters,
    tieneFiltros,
    deleteMutation,
    temasBase,
    sendasBase,
    ageGroupsBase,
  };
}

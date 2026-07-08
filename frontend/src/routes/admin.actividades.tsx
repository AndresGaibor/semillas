import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { obtenerActividades } from "../features/activities/activities.api";
import { eliminarActividad, obtenerTemasAdmin } from "../features/admin/admin.api";
import { obtenerSendas } from "../features/sendas/sendas.api";
import { obtenerGruposEdad } from "../features/catalog/catalog.api";
import { Loader } from "lucide-react";
import type { Actividad, Tema } from "../shared/api/api";
import { getSendaColorClasses, getActivityTypeInfo, getAgeGroupLabel } from "../features/admin/componentes/actividades.helpers";
import { AdminActivitiesHeader } from "../features/admin/componentes/admin-activities-header";
import { AdminActivitiesTabs } from "../features/admin/componentes/admin-activities-tabs";
import { AdminActivitiesFilters } from "../features/admin/componentes/admin-activities-filters";
import { AdminActivitiesTable, type ActivityTableRow } from "../features/admin/componentes/admin-activities-table";
import { AdminActivitiesSummary } from "../features/admin/componentes/admin-activities-summary";
import { AdminXpWidget } from "../features/admin/componentes/admin-xp-widget";
import { AdminTipsWidget } from "../features/admin/componentes/admin-tips-widget";

export const Route = createFileRoute("/admin/actividades")({
  component: AdminActivitiesPage
});

function AdminActivitiesPage() {
  const navigate = useNavigate();
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
    queryFn: () => obtenerActividades()
  });

  const temasQuery = useQuery({
    queryKey: ["admin", "themes"],
    queryFn: () => obtenerTemasAdmin()
  });

  const sendasQuery = useQuery({
    queryKey: ["sendas"],
    queryFn: () => obtenerSendas()
  });

  const ageGroupsQuery = useQuery({
    queryKey: ["catalog", "age-groups"],
    queryFn: () => obtenerGruposEdad()
  });

  const dbActivities = (activitiesQuery.data ?? []) as Actividad[];
  const temasBase = (temasQuery.data ?? []) as Tema[];
  const sendasBase = (sendasQuery.data ?? []) as any[];
  const ageGroupsBase = (ageGroupsQuery.data ?? []) as any[];

  const deleteMutation = useMutation({
    mutationFn: eliminarActividad,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "activities"] });
    }
  });

  const mappedActivities = useMemo(() => {
    return dbActivities.map((act) => {
      const typeInfo = getActivityTypeInfo(act.tipo_actividad?.codigo ?? "quiz");
      const franja = getAgeGroupLabel(act.grupo_edad_id, ageGroupsBase);
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
      } satisfies ActivityTableRow;
    });
  }, [dbActivities, temasBase, sendasBase, ageGroupsBase]);

  const filteredActivities = useMemo(() => {
    return mappedActivities.filter((act) => {
      if (activeTab === "borrador" && act.estado !== "borrador") return false;
      if (activeTab === "revision" && act.estado !== "revision") return false;
      if (activeTab === "publicada" && act.estado !== "publicada") return false;

      if (activeTab === "quiz" && act.tipoIcon !== "fa-circle-question") return false;
      if (activeTab === "flashcard" && act.tipoIcon !== "fa-book-open") return false;
      if (activeTab === "completar" && act.tipoIcon !== "fa-pen-clip") return false;
      if (activeTab === "verdadero-falso" && act.tipoIcon !== "fa-circle-check") return false;
      if (activeTab === "sopa" && act.tipoIcon !== "fa-border-all") return false;

      if (searchValue && !act.titulo.toLowerCase().includes(searchValue.toLowerCase()) && !act.consigna.toLowerCase().includes(searchValue.toLowerCase())) {
        return false;
      }

      if (selectedSendaId) {
        const matchingSenda = sendasBase.find((s) => s.id === selectedSendaId);
        if (matchingSenda && act.sendaNombre !== matchingSenda.nombre) {
          return false;
        }
      }

      if (selectedTemaId) {
        const matchingTema = temasBase.find((t) => t.id === selectedTemaId);
        if (matchingTema && act.tipoNombre !== matchingTema.titulo) {
          return false;
        }
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

  const tieneFiltros = !!(searchValue || selectedTemaId || selectedSendaId || selectedAgeGroupId);

  return (
    <div className="flex flex-col gap-6 text-left">
      {activitiesQuery.isLoading && (
        <div className="flex items-center justify-center py-6">
          <Loader className="animate-spin text-primario" size={24} />
          <span className="text-sm text-neutro ml-2">Cargando actividades del panel...</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="flex flex-col gap-6 lg:col-span-3 min-w-0">
          <AdminActivitiesHeader />

          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm text-left flex flex-col gap-4">
            <AdminActivitiesTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabCounts={tabCounts}
            />

            <AdminActivitiesFilters
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              selectedTemaId={selectedTemaId}
              onTemaChange={setSelectedTemaId}
              temasBase={temasBase}
              selectedSendaId={selectedSendaId}
              onSendaChange={setSelectedSendaId}
              sendasBase={sendasBase}
              selectedAgeGroupId={selectedAgeGroupId}
              onAgeGroupChange={setSelectedAgeGroupId}
              ageGroupsBase={ageGroupsBase}
              onClear={clearFilters}
              tieneFiltros={tieneFiltros}
            />
          </div>

          <AdminActivitiesTable
            activities={filteredActivities}
            isLoading={activitiesQuery.isLoading}
            totalResultados={filteredActivities.length}
            paginaActual={paginaActual}
            onCambiarPagina={setPaginaActual}
            porPagina={porPagina}
            onCambiarPorPagina={setPorPagina}
          />
        </div>

        <div className="flex flex-col gap-6">
          <AdminActivitiesSummary stats={summaryStats} />
          <AdminXpWidget />
          <AdminTipsWidget />
        </div>
      </div>
    </div>
  );
}

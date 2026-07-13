import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { AdminActivitiesHeader } from "@/features/admin/componentes/admin-activities-header";
import { AdminActivitiesTabs } from "@/features/admin/componentes/admin-activities-tabs";
import { AdminActivitiesFilters } from "@/features/admin/componentes/admin-activities-filters";
import { AdminActivitiesTable } from "@/features/admin/componentes/admin-activities-table";
import { useAdminActivities } from "@/features/admin/hooks/use-admin-activities";

export const Route = createFileRoute("/admin/actividades")({
  component: AdminActivitiesPage,
});

function AdminActivitiesPage() {
  const queryClient = useQueryClient();
  const {
    searchValue, setSearchValue,
    selectedTemaId, setSelectedTemaId,
    selectedSendaId, setSelectedSendaId,
    selectedAgeGroupId, setSelectedAgeGroupId,
    activeTab, setActiveTab,
    paginaActual, setPaginaActual,
    porPagina, setPorPagina,
    isLoading,
    filteredActivities,
    filteredTotal,
    tabCounts,
    summaryStats,
    clearFilters,
    tieneFiltros,
    temasBase,
    sendasBase,
    ageGroupsBase,
  } = useAdminActivities();

  return (
    <div className="activity-library-page text-left">
      {isLoading && (
        <div className="flex items-center justify-center py-6">
          <Loader className="animate-spin text-primario" size={24} />
          <span className="ml-2 text-sm text-slate-500">Cargando actividades del panel...</span>
        </div>
      )}

      <AdminActivitiesHeader totalActividades={summaryStats.total} publicadas={summaryStats.publicadas} />

      <section className="activity-library-toolbar">
        <AdminActivitiesTabs activeTab={activeTab} onTabChange={setActiveTab} tabCounts={tabCounts} />

        <AdminActivitiesFilters
          searchValue={searchValue} onSearchChange={setSearchValue}
          selectedTemaId={selectedTemaId} onTemaChange={setSelectedTemaId}
          temasBase={temasBase}
          selectedSendaId={selectedSendaId} onSendaChange={setSelectedSendaId}
          sendasBase={sendasBase}
          selectedAgeGroupId={selectedAgeGroupId} onAgeGroupChange={setSelectedAgeGroupId}
          ageGroupsBase={ageGroupsBase}
          onClear={clearFilters} tieneFiltros={tieneFiltros}
        />
      </section>

      <AdminActivitiesTable
        activities={filteredActivities}
        isLoading={isLoading}
        totalResultados={filteredTotal}
        paginaActual={paginaActual}
        onCambiarPagina={setPaginaActual}
        porPagina={porPagina}
        onCambiarPorPagina={setPorPagina}
        onActividadEliminada={() => queryClient.invalidateQueries({ queryKey: ["admin", "activities"] })}
      />
    </div>
  );
}

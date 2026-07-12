import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { AdminActivitiesHeader } from "@/features/admin/componentes/admin-activities-header";
import { AdminActivitiesTabs } from "@/features/admin/componentes/admin-activities-tabs";
import { AdminActivitiesFilters } from "@/features/admin/componentes/admin-activities-filters";
import { AdminActivitiesTable } from "@/features/admin/componentes/admin-activities-table";
import { AdminActivitiesSummary } from "@/features/admin/componentes/admin-activities-summary";
import { AdminXpWidget } from "@/features/admin/componentes/admin-xp-widget";
import { AdminTipsWidget } from "@/features/admin/componentes/admin-tips-widget";
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
    <div className="flex flex-col gap-6 text-left">
      {isLoading && (
        <div className="flex items-center justify-center py-6">
          <Loader className="animate-spin text-primario" size={24} />
          <span className="ml-2 text-sm text-emerald-300/70">Cargando actividades del panel...</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="flex flex-col gap-6 lg:col-span-3 min-w-0">
          <AdminActivitiesHeader />

          <div className="bg-[#142e22] rounded-3xl border border-[#1a3a2a] p-5 shadow-sm text-left flex flex-col gap-4">
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
          </div>

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

        <div className="flex flex-col gap-6">
          <AdminActivitiesSummary stats={summaryStats} />
          <AdminXpWidget />
          <AdminTipsWidget />
        </div>
      </div>
    </div>
  );
}

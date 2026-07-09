import { createFileRoute, useNavigate, Outlet, useLocation } from "@tanstack/react-router";
import { Loader } from "lucide-react";

import { AdminThemesHeader } from "../features/admin/componentes/admin-themes-header";
import { AdminThemesFilters } from "../features/admin/componentes/admin-themes-filters";
import { AdminThemesTabs } from "../features/admin/componentes/admin-themes-tabs";
import { AdminThemesTable } from "../features/admin/componentes/admin-themes-table";
import { AdminThemesSummary } from "../features/admin/componentes/admin-themes-summary";
import { useAdminThemes } from "../features/admin/hooks/use-admin-themes";

export const Route = createFileRoute("/admin/temas")({
  component: AdminThemesPage,
});

function AdminThemesPage() {
  const location = useLocation();
  const isExactListRoute = location.pathname === "/admin/temas" || location.pathname === "/admin/temas/";
  if (!isExactListRoute) return <Outlet />;

  return <AdminThemesListView />;
}

function AdminThemesListView() {
  const navigate = useNavigate();
  const {
    searchValue, setSearchValue,
    selectedSendaId, setSelectedSendaId,
    selectedAgeGroupId, setSelectedAgeGroupId,
    activeTab, setActiveTab,
    isLoading,
    filteredThemes, tabCounts,
    filterSendas, filterAgeGroups,
    publishMutation, unpublishMutation,
  } = useAdminThemes();

  return (
    <div className="flex flex-col gap-6">
      {isLoading && (
        <div className="flex items-center justify-center py-6">
          <Loader className="animate-spin text-primario" size={24} />
          <span className="ml-2 text-sm text-neutro">Cargando temas...</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="flex flex-col gap-6 lg:col-span-3 min-w-0">
          <AdminThemesHeader onCrearTema={() => navigate({ to: "/admin/temas/new" })} />

          <AdminThemesFilters
            searchValue={searchValue} onSearchChange={setSearchValue}
            selectedSendaId={selectedSendaId} onSendaChange={setSelectedSendaId}
            selectedAgeGroupId={selectedAgeGroupId} onAgeGroupChange={setSelectedAgeGroupId}
            sendas={filterSendas} ageGroups={filterAgeGroups}
          />

          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col">
            <AdminThemesTabs activeTab={activeTab} onTabChange={setActiveTab} counts={tabCounts} />

            <AdminThemesTable
              temas={filteredThemes}
              onEditar={(id) => navigate({ to: "/admin/temas/$themeId/edit", params: { themeId: id } })}
              onCRECER={(id) => navigate({ to: "/admin/temas/$themeId/crecer", params: { themeId: id } })}
              onActivities={(id) => navigate({ to: "/admin/temas/$themeId/activities", params: { themeId: id } })}
              onPreview={(id) => navigate({ to: "/admin/temas/$themeId/preview", params: { themeId: id } })}
              onDetalle={(id) => navigate({ to: "/admin/temas/$themeId/detalle", params: { themeId: id } })}
              onPublicar={(id) => publishMutation.mutate(id)}
              onDespublicar={(id) => unpublishMutation.mutate(id)}
            />

            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-slate-100 gap-4 text-xs font-semibold text-[#5c5c5c] select-none">
              <span>Mostrando {filteredThemes.length > 0 ? "1" : "0"} a {filteredThemes.length} de {filteredThemes.length} temas</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <AdminThemesSummary counts={{ ...tabCounts, total: tabCounts.todos }} onVerReportes={() => navigate({ to: "/admin/reportes" })} />
        </div>
      </div>
    </div>
  );
}

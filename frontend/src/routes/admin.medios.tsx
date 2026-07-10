import { createFileRoute } from "@tanstack/react-router";
import { useAdminMediaPage } from "../features/admin/hooks/use-admin-media-page";

import { AdminMediaHeader } from "../features/admin/componentes/admin-media-header";
import { AdminMediaTypeTabs } from "../features/admin/componentes/admin-media-type-tabs";
import { AdminMediaFilters } from "../features/admin/componentes/admin-media-filters";
import { AdminMediaGrid } from "../features/admin/componentes/admin-media-grid";
import { AdminMediaDetailPanel } from "../features/admin/componentes/admin-media-detail-panel";
import { AdminMediaLoadingState } from "../features/admin/componentes/admin-media-loading-state";
import { AdminMediaUploadProgress } from "../features/admin/componentes/admin-media-upload-progress";

export const Route = createFileRoute("/admin/medios")({
  component: AdminMediosPage,
});

function AdminMediosPage() {
  const {
    activeTab,
    isUploading,
    mediaQuery,
    paginatedItems,
    selectedId,
    selectedResource,
    handleDelete,
    handleFileChange,
    handleTabChange,
    inputArchivoRef,
    setPaginaActual,
    setPorPagina,
    setSelectedFolder,
    setSelectedId,
    setSelectedSort,
    setSearchValue,
    paginaActual,
    porPagina,
    searchValue,
    selectedFolder,
    selectedSort,
  } = useAdminMediaPage();

  return (
    <div className="flex flex-col gap-6 text-left">
      <input
        ref={inputArchivoRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
      />

      <AdminMediaLoadingState isLoading={mediaQuery.isLoading} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="flex flex-col gap-6 lg:col-span-3 min-w-0">
          <AdminMediaHeader onSubirRecurso={() => inputArchivoRef.current?.click()} />
          <AdminMediaTypeTabs activeTab={activeTab} onTabChange={handleTabChange} />
          <AdminMediaFilters
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            selectedFolder={selectedFolder}
            onFolderChange={setSelectedFolder}
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
          />
          <AdminMediaGrid
            items={paginatedItems}
            selectedId={selectedId}
            onSelect={setSelectedId}
            paginaActual={paginaActual}
            porPagina={porPagina}
            onCambiarPagina={setPaginaActual}
            onCambiarPorPagina={setPorPagina}
          />
        </div>
        <AdminMediaDetailPanel selectedResource={selectedResource} onDelete={handleDelete} />
      </div>

      <AdminMediaUploadProgress isUploading={isUploading} />
    </div>
  );
}

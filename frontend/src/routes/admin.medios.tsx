import { createFileRoute } from "@tanstack/react-router";

import {
  AdminMediaDetailPanel,
  AdminMediaFilters,
  AdminMediaGrid,
  AdminMediaHeader,
  AdminMediaLoadingState,
  AdminMediaUploadProgress,
} from "@/features/admin/componentes/medios";
import { useAdminMediaPage } from "../features/admin/hooks/use-admin-media-page";

export const Route = createFileRoute("/admin/medios")({
  component: AdminMediosPage,
});

function AdminMediosPage() {
  const {
    activeTab,
    countsByType,
    filteredMedia,
    handleDelete,
    handleFilesChange,
    handleSearchChange,
    handleSortChange,
    handleTabChange,
    handleViewModeChange,
    inputArchivoRef,
    isUploading,
    mediaQuery,
    paginatedItems,
    paginaActual,
    porPagina,
    searchValue,
    selectedId,
    selectedResource,
    selectedSort,
    setPaginaActual,
    setPorPagina,
    setSelectedId,
    totalResources,
    uploadProgress,
    viewMode,
  } = useAdminMediaPage();


  return (
    <div className="flex flex-col gap-4 text-left">
      <input
        ref={inputArchivoRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFilesChange}
        accept="image/jpeg,image/png,image/webp,audio/mpeg,audio/aac,audio/ogg,audio/webm,video/mp4,video/webm,application/pdf"
      />

      <AdminMediaHeader
        totalItems={totalResources}
        isUploading={isUploading}
        onSubirRecurso={() => inputArchivoRef.current?.click()}
      />

      <AdminMediaFilters
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        selectedSort={selectedSort}
        onSortChange={handleSortChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        totalItems={totalResources}
        countsByType={countsByType}
      />

      <AdminMediaLoadingState isLoading={mediaQuery.isLoading} />

      {mediaQuery.isError ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"
        >
          No se pudieron cargar los recursos multimedia. Revisa tu conexión e
          inténtalo de nuevo.
        </div>
      ) : null}

      {!mediaQuery.isLoading ? (
        <div
          className={`grid min-w-0 gap-5 ${
            selectedResource
              ? "xl:grid-cols-[minmax(0,1fr)_360px]"
              : "grid-cols-1"
          }`}
        >
          <AdminMediaGrid
            items={paginatedItems}
            totalItems={filteredMedia.length}
            selectedId={selectedId}
            viewMode={viewMode}
            onSelect={(id) => setSelectedId(selectedId === id ? "" : id)}
            paginaActual={paginaActual}
            porPagina={porPagina}
            onCambiarPagina={setPaginaActual}
            onCambiarPorPagina={setPorPagina}
          />

          {selectedResource ? (
            <AdminMediaDetailPanel
              selectedResource={selectedResource}
              onClose={() => setSelectedId("")}
              onDelete={handleDelete}
            />
          ) : null}
        </div>
      ) : null}

      <AdminMediaUploadProgress progress={uploadProgress} />
    </div>
  );
}

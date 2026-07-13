import { createFileRoute } from "@tanstack/react-router";
import { useAdminMediaPage } from "../features/admin/hooks/use-admin-media-page";

import {
  AdminMediaHeader,
  AdminMediaTypeTabs,
  AdminMediaFilters,
  AdminMediaGrid,
  AdminMediaDetailPanel,
  AdminMediaLoadingState,
  AdminMediaUploadProgress,
} from "@/features/admin/componentes/medios";

export const Route = createFileRoute("/admin/medios")({
  component: AdminMediosPage,
});

function AdminMediosPage() {
  const {
    activeTab,
    isUploading,
    mediaQuery,
    filteredMedia,
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
        accept="image/jpeg,image/png,image/webp,audio/mpeg,audio/aac,audio/ogg,audio/webm,video/mp4,video/webm,application/pdf"
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
          {mediaQuery.isError ? (
            <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              No se pudieron cargar los recursos multimedia. Revisa tu conexión e inténtalo de nuevo.
            </div>
          ) : null}
          <AdminMediaGrid
            items={paginatedItems}
            totalItems={filteredMedia.length}
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

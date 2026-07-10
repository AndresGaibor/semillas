import { createFileRoute } from "@tanstack/react-router";

import { DescargasBanner } from "@/features/descargas/componentes/descargas-banner";
import { DescargasTabsFilter } from "@/features/descargas/componentes/descargas-tabs-filter";
import { RecursoCard } from "@/features/descargas/componentes/recurso-card";
import { StorageWidget } from "@/features/descargas/componentes/storage-widget";
import { useDescargasPage } from "@/features/descargas/hooks/use-descargas-page";

export const Route = createFileRoute("/app/descargas")({
  component: DownloadsPage,
});

function DownloadsPage() {
  const {
    showBanner,
    setShowBanner,
    activeTab,
    setActiveTab,
    ageFilter,
    setAgeFilter,
    sortOrder,
    setSortOrder,
    searchQuery,
    setSearchQuery,
    downloadedIds,
    downloadingStates,
    handleDownload,
    handleDelete,
    storageInfo,
    totalStorageMB,
    filteredRecursos,
  } = useDescargasPage();

  return (
    <div className="w-full flex flex-col font-sans text-slate-800 text-left">
      <DescargasBanner visible={showBanner} onCerrar={() => setShowBanner(false)} />

      <DescargasTabsFilter
        activeTab={activeTab}
        onTabChange={setActiveTab}
        ageFilter={ageFilter}
        onAgeChange={setAgeFilter}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
        {filteredRecursos.map(recurso => (
          <RecursoCard
            key={recurso.id}
            id={recurso.id}
            titulo={recurso.titulo}
            tipo={recurso.tipo}
            edad={recurso.edad}
            sizeMB={recurso.sizeMB}
            descripcion={recurso.descripcion}
            imagen={recurso.imagen}
            isDownloaded={downloadedIds.includes(recurso.id)}
            progress={downloadingStates[recurso.id]}
            onDownload={() => handleDownload(recurso.id)}
            onDelete={() => handleDelete(recurso.id)}
          />
        ))}

        {filteredRecursos.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400">
            No se encontraron descargas que coincidan con los filtros.
          </div>
        )}
      </div>

      <StorageWidget
        usedMB={storageInfo.used}
        totalMB={totalStorageMB}
        percentage={storageInfo.percentage}
        onGestionarClick={() => alert("Abriendo panel de configuración de almacenamiento offline.")}
      />
    </div>
  );
}

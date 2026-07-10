import { createFileRoute } from "@tanstack/react-router";
import { CardLeccion } from "@/componentes/ui/card-leccion";
import { TemasTabsFilter, type FiltroTab } from "@/features/themes/componentes/temas-tabs-filter";
import { TemasSearchBar } from "@/features/themes/componentes/temas-search-bar";
import { ResumenTemasCard } from "@/features/themes/componentes/resumen-temas-card";
import { ContinuarAprendiendoCard } from "@/features/themes/componentes/continuar-aprendiendo-card";
import { TemasLoadingState, TemasErrorState, TemasEmptyState } from "@/features/themes/componentes/temas-page-states";
import { SendaFilterRow } from "@/features/themes/componentes/senda-filter-row";
import { useTemasPage } from "@/features/themes/hooks/use-temas-page";

export const Route = createFileRoute("/app/temas/")({
  component: PaginaTemas,
  validateSearch: (search: Record<string, unknown>) => ({
    sendas:
      search.sendas === "padre" || search.sendas === "hijo" || search.sendas === "espiritu"
        ? search.sendas
        : undefined,
  }),
});

function PaginaTemas() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const {
    temasApi,
    temasFiltrados,
    stats,
    temaParaContinuar,
    isLoading,
    isError,
    filtroTab,
    setFiltroTab,
    busqueda,
    setBusqueda,
    toggleFavorito,
    cambiarSenda,
  } = useTemasPage({ searchSenda: search.sendas });

  if (isLoading) return <TemasLoadingState />;
  if (isError) return <TemasErrorState />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 w-full font-sans text-left items-start">
      <div className="flex flex-col min-w-0">
        <SendaFilterRow
          searchSenda={search.sendas}
          onSendaChange={cambiarSenda}
        />
        <TemasTabsFilter activo={filtroTab} onChange={setFiltroTab} />
        <TemasSearchBar valor={busqueda} onChange={setBusqueda} />

        {temasFiltrados.length === 0 ? (
          <TemasEmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {temasFiltrados.map((tema) => (
              <CardLeccion
                key={tema.id}
                titulo={tema.titulo}
                descripcion={tema.descripcion}
                duracion={tema.duracion}
                xp={tema.xp}
                progreso={tema.progreso}
                favorito={tema.favorito}
                imagenUrl={tema.imagenUrl ?? undefined}
                estado={tema.estado}
                mostrarSendaBadge={!search.sendas}
                onFavorito={() => {
                  const slug = temasApi?.find((t) => t.id === tema.id)?.slug ?? tema.id;
                  toggleFavorito(slug);
                }}
                onAccion={() =>
                  navigate({ to: "/app/temas/$themeId", params: { themeId: tema.id } })
                }
                senda={tema.senda}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 w-full">
        <ResumenTemasCard
          totales={stats.totales}
          completados={stats.completados}
          enProgreso={stats.enProgreso}
        />
        <ContinuarAprendiendoCard
          tema={temaParaContinuar ?? null}
          onContinuar={() => {
            if (temaParaContinuar) {
              navigate({ to: "/app/temas/$themeId", params: { themeId: temaParaContinuar.id } });
            }
          }}
        />
      </div>
    </div>
  );
}

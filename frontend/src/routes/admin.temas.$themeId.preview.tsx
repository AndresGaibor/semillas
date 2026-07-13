import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Loader, FileText } from "lucide-react";

import { formatearFechaHoraTema, formatearFechaTema, ThemePreviewHeader, CrecerStepsList, SectionCard, EmptyState, PreviewSidebar } from "@/features/admin/componentes/temas";
import { BadgeInfo } from "lucide-react";
import { useThemePreviewPage } from "../features/admin/hooks/use-theme-preview-page";

export const Route = createFileRoute("/admin/temas/$themeId/preview")({
  component: AdminThemePreviewPage,
});

function AdminThemePreviewPage() {
  const { themeId } = Route.useParams();
  const {
    themeQuery,
    stepsQuery,
    activitiesQuery,
    portadaUrl,
    estado,
    actividades,
    navigateToEdit,
    navigateToDetalle,
    navigateBack,
  } = useThemePreviewPage({ themeId });

  if (themeQuery.isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="animate-spin text-[#2e9e5b]" size={24} />
      </div>
    );
  }

  const theme = themeQuery.data!;

  return (
    <div className="min-h-screen bg-[#0d1f17]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
        <button
          onClick={navigateBack}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-[#2a4a3a] bg-[#142e22] px-4 py-2 text-sm font-semibold text-emerald-200/70 shadow-sm transition-colors hover:bg-[#1a3a2a] hover:text-emerald-50"
        >
          <ArrowLeft size={16} />
          Volver a temas
        </button>

        <ThemePreviewHeader
          theme={theme as ThemePreviewHeaderProps["theme"]}
          portadaUrl={portadaUrl}
          estado={estado}
          formatDate={formatearFechaTema}
          formatDateTime={formatearFechaHoraTema}
          onEdit={navigateToEdit}
          onViewDetail={navigateToDetalle}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_360px]">
          <div className="flex min-w-0 flex-col gap-6">
            <CrecerStepsList pasos={stepsQuery.data ?? []} />
            <SectionCard
              icon={FileText}
              title="Actividades"
              description="La propuesta interactiva que acompaña el tema."
            >
              {actividades.length === 0 ? (
                <EmptyState
                  icon={BadgeInfo}
                  title="Sin actividades aún"
                  description="Agrega actividades para que el tema tenga interacción y evaluación."
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {actividades.map((activity) => (
                    <article
                      key={activity.id}
                      className="flex h-full flex-col rounded-[1.5rem] border border-[#2a4a3a] bg-[#142e22] p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#2e9e5b]">
                            {activity.tipo_actividad?.nombre ?? "Actividad"}
                          </p>
                          <h4 className="mt-2 text-base font-black text-emerald-50">
                            {activity.titulo}
                          </h4>
                        </div>
                        <span className="rounded-full bg-[#f4b740]/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#b8810f]">
                          {activity.xp_recompensa} XP
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-emerald-200/70">
                        {activity.consigna}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          <PreviewSidebar
            theme={theme}
            estado={estado}
            onEdit={navigateToEdit}
            onViewDetail={navigateToDetalle}
            formatDate={formatearFechaTema}
            formatDateTime={formatearFechaHoraTema}
          />
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader, FileText } from "lucide-react";

import { obtenerTemaAdmin, obtenerPasosAdmin } from "../features/admin/admin.api";
import { obtenerActividades, obtenerUrlPortadaTema } from "../features/themes/themes.api";
import { formatearFechaHoraTema, formatearFechaTema, obtenerEstadoTema } from "../features/admin/componentes/theme-view.utils";
import { ThemePreviewHeader, type ThemePreviewHeaderProps } from "../features/admin/componentes/theme-preview-header";
import { CrecerStepsList } from "../features/admin/componentes/crecer-steps-list";
import { SectionCard, EmptyState } from "../features/admin/componentes/section-card";
import { PreviewSidebar } from "../features/admin/componentes/preview-sidebar";
import { BadgeInfo } from "lucide-react";
import type { Actividad } from "../shared/api/api";

export const Route = createFileRoute("/admin/temas/$themeId/preview")({
  component: AdminThemePreviewPage,
});

function AdminThemePreviewPage() {
  const { themeId } = Route.useParams();
  const navigate = useNavigate();

  const themeQuery = useQuery({ queryKey: ["admin", "theme", themeId], queryFn: () => obtenerTemaAdmin(themeId) });
  const stepsQuery = useQuery({ queryKey: ["admin", "theme", themeId, "steps"], queryFn: () => obtenerPasosAdmin(themeId) });
  const activitiesQuery = useQuery({
    queryKey: ["admin", "theme", themeId, "activities"],
    queryFn: () => obtenerActividades(themeId),
  });
  const portadaQuery = useQuery({
    queryKey: ["tema-portada", themeId],
    queryFn: () => obtenerUrlPortadaTema(themeId),
    enabled: Boolean(themeQuery.data?.portada_recurso_id),
    staleTime: 3 * 60 * 1000,
  });

  const theme = themeQuery.data;
  const portadaUrl = portadaQuery.data?.url ?? theme?.portada_recurso?.url_publica ?? null;
  const estado = obtenerEstadoTema(theme?.estado ?? "borrador");

  if (themeQuery.isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="animate-spin text-[#2e9e5b]" size={24} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4ec]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
        <button
          onClick={() => navigate({ to: "/admin/temas" })}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-800"
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
          onEdit={() => navigate({ to: "/admin/temas/$themeId/edit", params: { themeId } })}
          onViewDetail={() => navigate({ to: "/admin/temas/$themeId/detalle", params: { themeId } })}
        />

        <div className={`grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_360px]`}>
          <div className="flex min-w-0 flex-col gap-6">
            <CrecerStepsList pasos={stepsQuery.data ?? []} />
            <SectionCard
              icon={FileText}
              title="Actividades"
              description="La propuesta interactiva que acompaña el tema."
            >
              {(!activitiesQuery.data || (activitiesQuery.data as Actividad[]).length === 0) ? (
                <EmptyState
                  icon={BadgeInfo}
                  title="Sin actividades aún"
                  description="Agrega actividades para que el tema tenga interacción y evaluación."
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {(activitiesQuery.data as Actividad[]).map((activity) => (
                    <article key={activity.id} className="flex h-full flex-col rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#2e9e5b]">
                            {activity.tipo_actividad?.nombre ?? "Actividad"}
                          </p>
                          <h4 className="mt-2 text-base font-black text-slate-800">
                            {activity.titulo}
                          </h4>
                        </div>
                        <span className="rounded-full bg-[#f4b740]/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#b8810f]">
                          {activity.xp_recompensa} XP
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
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
            onEdit={() => navigate({ to: "/admin/temas/$themeId/edit", params: { themeId } })}
            onViewDetail={() => navigate({ to: "/admin/temas/$themeId/detalle", params: { themeId } })}
            formatDate={formatearFechaTema}
            formatDateTime={formatearFechaHoraTema}
          />
        </div>
      </div>
    </div>
  );
}

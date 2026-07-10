import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { BadgeEstado } from "@/componentes/ui/badge-estado";
import { AdminTemaDetalleHeader } from "@/features/admin/componentes/admin-tema-detalle-header";
import { ThemeStatsGrid } from "@/features/admin/componentes/theme-stats-grid";
import { ThemeObjetivoCard } from "@/features/admin/componentes/theme-objetivo-card";
import { CrecerStepsCard } from "@/features/admin/componentes/crecer-steps-card";
import { ThemeActionsCard } from "@/features/admin/componentes/theme-actions-card";
import { ThemeMetadataCard } from "@/features/admin/componentes/theme-metadata-card";
import { useAdminThemeDetalle } from "@/features/admin/hooks/use-admin-theme-detalle";
import type { Actividad } from "@/shared/api/api";

export const Route = createFileRoute("/admin/temas/$themeId/detalle")({
  component: AdminThemeDetallePage,
});

function AdminThemeDetallePage() {
  const { themeId } = Route.useParams();
  const { themeQuery, stepsQuery, activitiesQuery, theme } = useAdminThemeDetalle({ themeId });
  const actividades = (activitiesQuery.data ?? []) as Actividad[];

  return (
    <div>
      <AdminTemaDetalleHeader />

      {themeQuery.isLoading && (
        <div className="flex justify-center py-12">
          <Loader className="animate-spin text-primario" size={24} />
        </div>
      )}

      {theme && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-neutro-oscuro-max">{theme.titulo}</h2>
                  <p className="text-neutro mt-1">{theme.slug}</p>
                </div>
                <BadgeEstado estado={theme.estado} />
              </div>

              {theme.resumen && (
                <p className="text-sm text-neutro-oscuro bg-crema-fondo rounded-xl p-4 mb-4">
                  {theme.resumen}
                </p>
              )}

              <ThemeStatsGrid
                xpRecompensa={theme.xp_recompensa}
                minutosEstimados={theme.minutos_estimados}
               endaNombre={theme.senda?.nombre ?? null}
                versionContenido={theme.version_contenido}
              />
            </div>

            <ThemeObjetivoCard objetivo={theme.objetivo} />

            <CrecerStepsCard
              pasos={stepsQuery.data ?? []}
              isLoading={stepsQuery.isLoading}
            />

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-3">
                Actividades ({actividades.length})
              </h3>
              {activitiesQuery.isLoading && (
                <Loader className="animate-spin text-[#2e9e5b]" size={16} />
              )}
              {actividades.length === 0 && !activitiesQuery.isLoading && (
                <p className="text-sm text-slate-500">Sin actividades aún.</p>
              )}
              <div className="grid gap-2">
                {actividades.map((act) => (
                  <div key={act.id} className="flex items-center justify-between rounded-xl p-3 border border-slate-100">
                    <div>
                      <p className="font-semibold text-sm text-slate-800">{act.titulo}</p>
                      <p className="text-xs text-slate-500">{act.tipo_actividad?.nombre}</p>
                    </div>
                    <span className="text-xs font-bold text-[#f4b740]">{act.xp_recompensa} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <ThemeActionsCard themeId={themeId} />

            <ThemeMetadataCard
              creadoPor={theme.creado_por}
              publicadoEn={theme.publicado_en}
              actualizadoEn={theme.actualizado_en}
              gruposEdad={theme.grupos_edad}
            />
          </div>
        </div>
      )}
    </div>
  );
}

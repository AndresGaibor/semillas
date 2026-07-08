import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { obtenerTemaAdmin, obtenerPasosAdmin } from "../features/admin/admin.api";
import { obtenerActividades } from "../features/themes/themes.api";
import { obtenerUrlPortadaTema } from "../features/themes/themes.api";
import { ArrowLeft, Loader, Edit, Bookmark, Gamepad, Eye } from "lucide-react";
import { BadgeEstado } from "../componentes/ui/badge-estado";

export const Route = createFileRoute("/admin/temas/$themeId/detalle")({
  component: AdminThemeDetallePage,
});

function AdminThemeDetallePage() {
  const { themeId } = Route.useParams();
  const navigate = useNavigate();

  const themeQuery = useQuery({
    queryKey: ["admin", "theme", themeId],
    queryFn: () => obtenerTemaAdmin(themeId),
  });
  const portadaQuery = useQuery({
    queryKey: ["tema-portada", themeId],
    queryFn: () => obtenerUrlPortadaTema(themeId),
    enabled: !!themeQuery.data?.portada_recurso_id,
  });
  const stepsQuery = useQuery({
    queryKey: ["admin", "theme", themeId, "steps"],
    queryFn: () => obtenerPasosAdmin(themeId),
  });
  const activitiesQuery = useQuery({
    queryKey: ["admin", "theme", themeId, "activities"],
    queryFn: () => obtenerActividades(themeId),
  });

  const theme = themeQuery.data;

  const acciones = [
    { icon: Edit, label: "Editar tema", to: "/admin/temas/$themeId/edit" as const, params: { themeId } },
    { icon: Bookmark, label: "Editor CRECER", to: "/admin/temas/$themeId/crecer" as const, params: { themeId } },
    { icon: Gamepad, label: "Actividades", to: "/admin/temas/$themeId/activities" as const, params: { themeId } },
    { icon: Eye, label: "Vista previa", to: "/admin/temas/$themeId/preview" as const, params: { themeId } },
  ];

  return (
    <div>
      <button
        onClick={() => navigate({ to: "/admin/temas" })}
        className="flex items-center gap-1 text-sm text-neutro mb-6 hover:text-neutro-oscuro transition-colors"
      >
        <ArrowLeft size={16} /> Volver a temas
      </button>

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

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div className="bg-crema-fondo rounded-xl p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutro">XP</p>
                  <p className="font-extrabold text-dorado-semilla mt-1">{theme.xp_recompensa}</p>
                </div>
                <div className="bg-crema-fondo rounded-xl p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutro">Duración</p>
                  <p className="font-extrabold text-neutro-oscuro-max mt-1">{theme.minutos_estimados} min</p>
                </div>
                <div className="bg-crema-fondo rounded-xl p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutro">Senda</p>
                  <p className="font-extrabold text-neutro-oscuro-max mt-1">{theme.senda?.nombre ?? "—"}</p>
                </div>
                <div className="bg-crema-fondo rounded-xl p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutro">Versión</p>
                  <p className="font-extrabold text-neutro-oscuro-max mt-1">v{theme.version_contenido}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-neutro-oscuro-max mb-3">Objetivo</h3>
              <p className="text-sm text-neutro-oscuro">{theme.objetivo}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-neutro-oscuro-max mb-3">
                Pasos CRECER ({stepsQuery.data?.length ?? 0})
              </h3>
              {stepsQuery.isLoading && <Loader className="animate-spin text-primario" size={16} />}
              {stepsQuery.data?.length === 0 && (
                <p className="text-sm text-neutro">Sin pasos CRECER aún.</p>
              )}
              <div className="grid gap-2">
                {stepsQuery.data?.map((step) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-3 rounded-xl p-3 border border-slate-100"
                  >
                    <span
                      className="w-2 h-8 rounded-full shrink-0"
                      style={{ backgroundColor: step.tipo_paso?.color_hex ?? "#ccc" }}
                    />
                    <div>
                      <p className="font-semibold text-sm text-neutro-oscuro-max">
                        {step.tipo_paso?.nombre}
                      </p>
                      <p className="text-xs text-neutro">
                        {step.contenidos?.length ?? 0} contenido(s)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-neutro-oscuro-max mb-3">
                Actividades ({activitiesQuery.data?.length ?? 0})
              </h3>
              {activitiesQuery.isLoading && <Loader className="animate-spin text-primario" size={16} />}
              {activitiesQuery.data?.length === 0 && (
                <p className="text-sm text-neutro">Sin actividades aún.</p>
              )}
              <div className="grid gap-2">
                {activitiesQuery.data?.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-center justify-between rounded-xl p-3 border border-slate-100"
                  >
                    <div>
                      <p className="font-semibold text-sm text-neutro-oscuro-max">{act.titulo}</p>
                      <p className="text-xs text-neutro">{act.tipo_actividad?.nombre}</p>
                    </div>
                    <span className="text-xs font-bold text-dorado-semilla">{act.xp_recompensa} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-neutro-oscuro-max mb-4">Acciones</h3>
              <div className="flex flex-col gap-2">
                {acciones.map((accion) => (
                  <button
                    key={accion.label}
                    type="button"
                    onClick={() => navigate({ to: accion.to, params: accion.params })}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-neutro-oscuro-max hover:bg-crema-fondo transition-colors cursor-pointer"
                  >
                    <accion.icon size={16} className="text-neutro" />
                    {accion.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-neutro-oscuro-max mb-3">Metadatos</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutro">Creado por</p>
                  <p className="font-semibold text-neutro-oscuro-max mt-0.5">
                    {theme.creado_por?.nombre_visible ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutro">Publicado</p>
                  <p className="font-semibold text-neutro-oscuro-max mt-0.5">
                    {theme.publicado_en
                      ? new Date(theme.publicado_en).toLocaleDateString("es-EC", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "No publicado"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutro">Actualizado</p>
                  <p className="font-semibold text-neutro-oscuro-max mt-0.5">
                    {theme.actualizado_en
                      ? new Date(theme.actualizado_en).toLocaleDateString("es-EC", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutro">Grupos de edad</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {theme.grupos_edad?.length
                      ? theme.grupos_edad.map((g) => (
                          <span
                            key={g.id}
                            className="text-xs px-2 py-0.5 bg-crema-fondo rounded-md text-neutro-oscuro font-semibold"
                          >
                            {g.nombre}
                          </span>
                        ))
                      : <span className="text-xs text-neutro">—</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  BadgeInfo,
  BookOpenText,
  Clock3,
  FileText,
  LayoutGrid,
  Layers3,
  Loader,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

import { obtenerTemaAdmin, obtenerPasosAdmin } from "../features/admin/admin.api";
import { obtenerActividades, obtenerUrlPortadaTema } from "../features/themes/themes.api";
import { formatearFechaHoraTema, formatearFechaTema, obtenerEstadoTema } from "../features/admin/componentes/theme-view.utils";

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
  const pasos = stepsQuery.data ?? [];
  const actividades = activitiesQuery.data ?? [];
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

        <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_.8fr]">
            <div className="flex flex-col gap-5 p-6 lg:p-8">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <StatusPill clase={estado.clase} punto={estado.punto} texto={estado.etiqueta} />
                <Chip>{theme?.senda?.nombre ?? "Senda sin definir"}</Chip>
                <Chip>{theme?.grupos_edad?.length ? `${theme.grupos_edad.length} franjas` : "Sin franjas"}</Chip>
                <Chip>{theme?.version_biblica_id ? "Con versión bíblica" : "Sin versión bíblica"}</Chip>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-slate-400">
                  Vista previa editorial
                </p>
                <h1 className="max-w-3xl text-3xl font-black leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                  {theme?.titulo ?? "Sin título"}
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-[15px]">
                  {theme?.resumen ?? "Sin resumen"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <MetricMini icon={Clock3} label="Duración" value={`${theme?.minutos_estimados ?? 0} min`} />
                <MetricMini icon={Trophy} label="XP" value={`${theme?.xp_recompensa ?? 0}`} />
                <MetricMini icon={LayoutGrid} label="Versión" value={`v${theme?.version_contenido ?? 0}`} />
                <MetricMini icon={Users} label="Edad" value={theme?.grupos_edad?.length ? `${theme.grupos_edad.length} grupos` : "—"} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <SubPanel title="Objetivo" icon={Sparkles}>
                  <p className="text-sm leading-7 text-slate-600">
                    {theme?.objetivo ?? "—"}
                  </p>
                </SubPanel>

                <SubPanel title="Versículo clave" icon={BookOpenText}>
                  {theme?.versiculo_clave ? (
                    <>
                      <p className="text-sm leading-7 text-slate-600">
                        “{theme.versiculo_clave.texto}”
                      </p>
                      <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-[#2e9e5b]">
                        {theme.versiculo_clave.libro_id}:{theme.versiculo_clave.capitulo}:{theme.versiculo_clave.versiculo}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm leading-7 text-slate-500">No hay versículo clave configurado.</p>
                  )}
                </SubPanel>
              </div>
            </div>

            <div className="border-t border-slate-100 bg-[#faf8f2] p-6 lg:border-l lg:border-t-0 lg:p-8">
              <div className="overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white shadow-sm">
                {portadaUrl ? (
                  <img src={portadaUrl} alt={`Portada de ${theme?.titulo ?? "tema"}`} className="aspect-[4/3] w-full object-cover" />
                ) : (
                  <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 px-6 text-center text-slate-400">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eefcf4] text-[#2e9e5b]">
                      <LayoutGrid size={24} />
                    </div>
                    <p className="text-sm font-bold text-slate-600">Sin portada todavía</p>
                    <p className="text-xs leading-6 text-slate-400">
                      La vista previa funciona mejor con una portada cargada.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 grid gap-3">
                <InfoCard label="Última actualización" value={formatearFechaHoraTema(theme?.actualizado_en)} />
                <InfoCard label="Publicado" value={formatearFechaTema(theme?.publicado_en)} />
                <InfoCard label="Slug" value={theme?.slug ?? "—"} mono />
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_360px]">
          <div className="flex min-w-0 flex-col gap-6">
            <SectionCard icon={Layers3} title="Recorrido CRECER" description="La secuencia pedagógica del tema en el editor.">
              {pasos.length === 0 ? (
                <EmptyState
                  icon={BookOpenText}
                  title="Sin pasos CRECER aún"
                  description="Agrega pasos para que el tema tenga estructura pedagógica visible."
                />
              ) : (
                <div className="grid gap-4">
                  {pasos.map((step) => (
                    <article key={step.id} className="overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white shadow-sm">
                      <div className="flex items-start gap-4 border-b border-slate-100 bg-[#faf8f2] p-5">
                        <span
                          className="mt-1 h-11 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: step.tipo_paso?.color_hex ?? "#cbd5e1" }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-black text-slate-800">
                              {step.tipo_paso?.nombre ?? "Paso sin nombre"}
                            </h3>
                            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                              Orden {step.orden}
                            </span>
                          </div>
                          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                            {step.contenidos.length
                              ? `${step.contenidos.length} bloque(s) de contenido disponibles para este paso.`
                              : "No hay contenidos cargados en este paso."}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-3 p-5 md:grid-cols-2">
                        {step.contenidos.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 md:col-span-2">
                            Aún no se configuró contenido para este paso.
                          </div>
                        ) : (
                          step.contenidos.map((content) => (
                            <article key={content.id} className="rounded-2xl border border-slate-100 bg-[#fcfcfb] p-4">
                              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                                {content.grupo_edad_id}
                              </p>
                              <h4 className="mt-2 text-sm font-extrabold text-slate-800">
                                {content.titulo}
                              </h4>
                              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                                {content.cuerpo}
                              </p>
                              {content.instruccion_corta ? (
                                <p className="mt-3 rounded-2xl bg-[#eefcf4] px-3 py-2 text-xs font-semibold leading-6 text-[#2e9e5b]">
                                  {content.instruccion_corta}
                                </p>
                              ) : null}
                            </article>
                          ))
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard icon={FileText} title="Actividades" description="La propuesta interactiva que acompaña el tema.">
              {actividades.length === 0 ? (
                <EmptyState
                  icon={BadgeInfo}
                  title="Sin actividades aún"
                  description="Agrega actividades para que el tema tenga interacción y evaluación."
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {actividades.map((activity) => (
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

                      <div className="mt-4 flex flex-wrap gap-2">
                        {activity.opciones.slice(0, 4).map((opt) => (
                          <span
                            key={opt.id}
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${opt.correcta ? "bg-[#eefcf4] text-[#2e9e5b]" : "bg-slate-100 text-slate-500"}`}
                          >
                            {opt.etiqueta ?? "Opción"}. {opt.texto}
                          </span>
                        ))}
                      </div>

                      {activity.opciones.length > 4 ? (
                        <p className="mt-3 text-[11px] font-semibold text-slate-400">
                          +{activity.opciones.length - 4} opción(es) más
                        </p>
                      ) : null}
                    </article>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
            <section className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <Sparkles size={16} />
                <p className="text-[10px] font-bold uppercase tracking-[0.22em]">Resumen rápido</p>
              </div>

              <div className="mt-4 grid gap-3">
                <SidebarMetric label="Estado" value={estado.etiqueta} />
                <SidebarMetric label="Duración" value={`${theme?.minutos_estimados ?? 0} min`} />
                <SidebarMetric label="XP" value={`${theme?.xp_recompensa ?? 0}`} />
                <SidebarMetric label="Versión" value={`v${theme?.version_contenido ?? 0}`} />
              </div>

              <div className="mt-4 rounded-2xl bg-[#f7f4ec] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Disponible para</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {theme?.grupos_edad?.length ? (
                    theme.grupos_edad.map((grupo) => (
                      <span key={grupo.id} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                        {grupo.nombre}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">Sin franjas asignadas</span>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <BookOpenText size={16} />
                <p className="text-[10px] font-bold uppercase tracking-[0.22em]">Metadatos</p>
              </div>

              <div className="mt-4 space-y-4 text-sm">
                <MetaRow label="Senda" value={theme?.senda?.nombre ?? "—"} />
                <MetaRow label="Creado por" value={theme?.creado_por?.nombre_visible ?? "—"} />
                <MetaRow label="Publicado" value={formatearFechaTema(theme?.publicado_en)} />
                <MetaRow label="Actualizado" value={formatearFechaHoraTema(theme?.actualizado_en)} />
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <BadgeInfo size={16} />
                <p className="text-[10px] font-bold uppercase tracking-[0.22em]">Acciones</p>
              </div>

              <div className="mt-4 grid gap-2">
                <ActionButton onClick={() => navigate({ to: "/admin/temas/$themeId/edit", params: { themeId } })}>
                  Editar tema
                </ActionButton>
                <ActionButton onClick={() => navigate({ to: "/admin/temas/$themeId/detalle", params: { themeId } })} secondary>
                  Ver detalle
                </ActionButton>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ clase, punto, texto }: { clase: string; punto: string; texto: string }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] ${clase}`}>
      <span className={`h-2 w-2 rounded-full ${punto}`} />
      {texto}
    </span>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-slate-500">{children}</span>;
}

function MetricMini({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-slate-100 bg-[#faf8f2] p-3">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon size={14} className="text-[#2e9e5b]" />
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]">{label}</p>
      </div>
      <p className="mt-2 text-sm font-black text-slate-800">{value}</p>
    </div>
  );
}

function SubPanel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-100 bg-[#faf8f2] p-4">
      <div className="mb-3 flex items-center gap-2 text-slate-700">
        <Icon size={16} className="text-[#2e9e5b]" />
        <h3 className="text-sm font-black">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function SidebarMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{label}</span>
      <span className="text-sm font-extrabold text-slate-800">{value}</span>
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eefcf4] text-[#2e9e5b]">
          <Icon size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-black text-slate-800">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function EmptyState({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-sm">
        <Icon size={20} />
      </div>
      <h3 className="mt-4 text-sm font-black text-slate-700">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

function InfoCard({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className={`mt-2 text-sm font-semibold text-slate-700 ${mono ? "font-mono text-[11px]" : ""}`}>{value}</p>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{label}</span>
      <span className="text-right text-sm font-semibold text-slate-700">{value}</span>
    </div>
  );
}

function ActionButton({ children, onClick, secondary = false }: { children: ReactNode; onClick: () => void; secondary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl px-4 py-3 text-left text-sm font-bold transition-colors ${secondary ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50" : "bg-[#2e9e5b] text-white hover:opacity-95"}`}
    >
      {children}
    </button>
  );
}

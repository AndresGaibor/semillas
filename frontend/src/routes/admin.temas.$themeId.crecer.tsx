import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  BookOpenText,
  Check,
  Circle,
  Clock3,
  Eye,
  Layers3,
  Loader,
  Save,
  Sparkles,
  Target,
  NotebookPen,
} from "lucide-react";

import { obtenerPasosAdmin, guardarParlante, obtenerTemaAdmin } from "../features/admin/admin.api";
import { obtenerGruposEdad, obtenerPasosCrecer } from "../features/catalog/catalog.api";
import { obtenerUrlPortadaTema } from "../features/themes/themes.api";
import { formatearFechaHoraTema, obtenerEstadoTema } from "../features/admin/componentes/theme-view.utils";

export const Route = createFileRoute("/admin/temas/$themeId/crecer")({
  component: AdminThemeCrecerPage,
});

function AdminThemeCrecerPage() {
  const { themeId } = Route.useParams();
  const navigate = useNavigate();

  const [selectedAgeGroupId, setSelectedAgeGroupId] = useState("");
  const [activeStepCode, setActiveStepCode] = useState("conectar");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [shortInstruction, setShortInstruction] = useState("");

  const themeQuery = useQuery({
    queryKey: ["admin", "theme", themeId],
    queryFn: () => obtenerTemaAdmin(themeId),
  });

  const portadaQuery = useQuery({
    queryKey: ["tema-portada", themeId],
    queryFn: () => obtenerUrlPortadaTema(themeId),
    enabled: Boolean(themeQuery.data?.portada_recurso_id),
    staleTime: 3 * 60 * 1000,
  });

  const stepsQuery = useQuery({
    queryKey: ["admin", "theme", themeId, "steps"],
    queryFn: () => obtenerPasosAdmin(themeId),
  });

  const ageGroupsQuery = useQuery({ queryKey: ["catalog", "age-groups"], queryFn: obtenerGruposEdad });
  const crecerStepsQuery = useQuery({ queryKey: ["catalog", "crecer-steps"], queryFn: obtenerPasosCrecer });

  const theme = themeQuery.data;
  const portadaUrl = portadaQuery.data?.url ?? theme?.portada_recurso?.url_publica ?? null;
  const estado = obtenerEstadoTema(theme?.estado ?? "borrador");

  const selectedAgeGroup = useMemo(
    () => ageGroupsQuery.data?.find((ag) => ag.id === selectedAgeGroupId) ?? null,
    [ageGroupsQuery.data, selectedAgeGroupId]
  );

  const activeStep = crecerStepsQuery.data?.find((s) => s.codigo === activeStepCode);
  const activeStepContent = useMemo(() => {
    const step = stepsQuery.data?.find((s) => s.tipo_paso?.codigo === activeStepCode);
    if (!selectedAgeGroupId || !step) return null;
    return step.contenidos?.find((c) => c.grupo_edad_id === selectedAgeGroupId) ?? null;
  }, [stepsQuery.data, activeStepCode, selectedAgeGroupId]);

  useEffect(() => {
    if (activeStepContent) {
      setTitle(activeStepContent.titulo ?? "");
      setBody(activeStepContent.cuerpo);
      setShortInstruction(activeStepContent.instruccion_corta ?? "");
    } else if (selectedAgeGroupId) {
      setTitle("");
      setBody("");
      setShortInstruction("");
    }
  }, [activeStepContent, activeStepCode, selectedAgeGroupId]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const stepType = crecerStepsQuery.data?.find((s) => s.codigo === activeStepCode);
      if (!stepType || !selectedAgeGroupId) throw new Error("Faltan datos");
      return guardarParlante(themeId, {
        tipo_paso_id: stepType.id,
        grupo_edad_id: selectedAgeGroupId,
        titulo: title || stepType.nombre,
        cuerpo: body || "Contenido pendiente...",
        instruccion_corta: shortInstruction || undefined,
      });
    },
    onSuccess: () => stepsQuery.refetch(),
  });

  const pasos = crecerStepsQuery.data ?? [];
  const totalPasos = pasos.length || 6;
  const pasosCompletos = pasos.filter((step) =>
    selectedAgeGroupId
      ? stepsQuery.data?.some(
          (contentStep) =>
            contentStep.tipo_paso?.codigo === step.codigo &&
            contentStep.contenidos?.some((content) => content.grupo_edad_id === selectedAgeGroupId && content.cuerpo && content.cuerpo !== "Contenido pendiente...")
        )
      : false
  ).length;
  const progreso = selectedAgeGroupId ? Math.round((pasosCompletos / totalPasos) * 100) : 0;

  if (themeQuery.isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="animate-spin text-[#2e9e5b]" size={24} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f4ec_0%,#ffffff_38%,#eefcf4_100%)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
        <button
          onClick={() => navigate({ to: "/admin/temas" })}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:bg-white hover:text-slate-800"
        >
          <ArrowLeft size={16} />
          Volver a temas
        </button>

        <section className={`relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br ${estado.fondoHero} text-white shadow-[0_24px_80px_rgba(18,59,44,0.16)]`}>
          <div className={`absolute inset-0 ${estado.brillo}`} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_28%)]" />

          <div className="relative grid gap-6 p-6 lg:grid-cols-[1.15fr_.85fr] lg:p-8">
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <StatusPill clase={estado.clase} punto={estado.punto} texto={`Editor ${estado.etiqueta}`} />
                <Chip>{theme?.senda?.nombre ?? "Senda sin definir"}</Chip>
                <Chip>{theme?.titulo ?? "Tema sin título"}</Chip>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-white/60">
                  Editor CRECER
                </p>
                <h1 className="max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                  {theme?.titulo ?? "Sin título"}
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-white/82 sm:text-[15px]">
                  {theme?.objetivo ?? "Completa los seis momentos CRECER para cada franja de edad."}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <MetricMini icon={Layers3} label="Pasos" value={`${pasosCompletos}/${totalPasos}`} />
                <MetricMini icon={Clock3} label="Actualizado" value={formatearFechaHoraTema(theme?.actualizado_en)} />
                <MetricMini icon={Sparkles} label="Progreso" value={`${progreso}%`} />
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/10 p-4 backdrop-blur">
              <div className="overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/10">
                {portadaUrl ? (
                  <img src={portadaUrl} alt={`Portada de ${theme?.titulo ?? "tema"}`} className="aspect-[4/3] w-full object-cover" />
                ) : (
                  <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 px-6 text-center text-white/72">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/12">
                      <NotebookPen size={24} className="text-white/80" />
                    </div>
                    <p className="text-sm font-bold">Sin portada configurada</p>
                    <p className="text-xs leading-6 text-white/58">
                      El editor se ve mejor con portada y metadatos completos.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 rounded-[1.5rem] border border-white/15 bg-white/10 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/55">Franja activa</p>
                {selectedAgeGroup ? (
                  <>
                    <p className="mt-2 text-sm font-black text-white">{selectedAgeGroup.nombre}</p>
                    <p className="mt-1 text-xs leading-6 text-white/68">
                      {selectedAgeGroup.descripcion ?? `${selectedAgeGroup.edad_minima}-${selectedAgeGroup.edad_maxima} años`}
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-sm font-semibold text-white/72">Selecciona una franja para empezar a editar.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_380px]">
          <div className="flex min-w-0 flex-col gap-6">
            <section className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eefcf4] text-[#2e9e5b]">
                  <Target size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-black text-slate-800">Selecciona la franja</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Cada franja tiene su propio contenido CRECER. El editor mantiene el paso seleccionado mientras escribes.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {ageGroupsQuery.data?.map((ag) => {
                  const isActive = ag.id === selectedAgeGroupId;
                  return (
                    <button
                      key={ag.id}
                      type="button"
                      onClick={() => setSelectedAgeGroupId(ag.id)}
                      className={`rounded-[1.5rem] border p-4 text-left transition-all ${isActive ? "border-[#2e9e5b] bg-[#eefcf4] shadow-sm" : "border-slate-200 bg-white hover:border-[#2e9e5b]/30 hover:bg-slate-50"}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-black text-slate-800">{ag.nombre}</p>
                          <p className="mt-1 text-xs leading-6 text-slate-500">
                            {ag.descripcion ?? `${ag.edad_minima}-${ag.edad_maxima} años`}
                          </p>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${isActive ? "bg-[#2e9e5b] text-white" : "bg-slate-100 text-slate-500"}`}>
                          {isActive ? "Activa" : "Elegir"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {selectedAgeGroupId ? (
              <>
                <section className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eefcf4] text-[#2e9e5b]">
                      <BookOpenText size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-black text-slate-800">Momentos CRECER</h2>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Elige el momento, edita el contenido y guarda por franja.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                    {pasos.map((step) => {
                      const isActive = activeStepCode === step.codigo;
                      const completed = selectedAgeGroupId
                        ? stepsQuery.data?.some(
                            (s) =>
                              s.tipo_paso?.codigo === step.codigo &&
                              s.contenidos?.some((c) => c.grupo_edad_id === selectedAgeGroupId && c.cuerpo && c.cuerpo !== "Contenido pendiente...")
                          )
                        : false;

                      return (
                        <button
                          key={step.codigo}
                          type="button"
                          onClick={() => setActiveStepCode(step.codigo)}
                          className={`flex items-center gap-3 rounded-[1.35rem] border px-4 py-3 text-left transition-all ${isActive ? "border-transparent text-white shadow-sm" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
                          style={{
                            backgroundColor: isActive ? (step.color_hex ?? "#2e9e5b") : undefined,
                          }}
                        >
                          <span className={`flex h-9 w-9 items-center justify-center rounded-2xl ${isActive ? "bg-white/15" : "bg-[#eefcf4] text-[#2e9e5b]"}`}>
                            {completed ? <Check size={16} /> : <Circle size={16} className={isActive ? "text-white/80" : "text-slate-300"} />}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm font-black ${isActive ? "text-white" : "text-slate-800"}`}>{step.nombre}</p>
                            <p className={`mt-0.5 text-[11px] font-semibold ${isActive ? "text-white/78" : "text-slate-400"}`}>
                              {completed ? "Contenido guardado" : "Pendiente de completar"}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eefcf4] text-[#2e9e5b]">
                      <Save size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-black text-slate-800">Editor de contenido</h2>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {activeStep?.nombre ?? "Paso CRECER"} · {selectedAgeGroup?.nombre ?? "Franja"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4">
                    <Field label="Título" help="Nombre visible del contenido para esta franja.">
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-colors focus:border-[#2e9e5b]"
                        placeholder={activeStep?.nombre ?? "Título del bloque"}
                      />
                    </Field>

                    <Field label="Contenido" help="Usa Markdown simple y párrafos cortos para que sea fácil de leer en móvil.">
                      <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        rows={10}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-700 outline-none transition-colors focus:border-[#2e9e5b]"
                        placeholder="Escribe el contenido aquí..."
                      />
                    </Field>

                    <Field label="Instrucción corta" help="Una frase breve para guiar la actividad o reflexión.">
                      <input
                        value={shortInstruction}
                        onChange={(e) => setShortInstruction(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-colors focus:border-[#2e9e5b]"
                        placeholder="Breve instrucción para el niño"
                      />
                    </Field>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => saveMutation.mutate()}
                        disabled={saveMutation.isPending}
                        className="inline-flex items-center gap-2 rounded-2xl bg-[#2e9e5b] px-5 py-3 text-sm font-bold text-white transition-colors hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {saveMutation.isPending ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                        {saveMutation.isPending ? "Guardando..." : `Guardar ${activeStep?.nombre ?? "paso"}`}
                      </button>

                      {saveMutation.isSuccess ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#eefcf4] px-3 py-2 text-sm font-semibold text-[#2e9e5b]">
                          <Check size={16} />
                          Guardado
                        </span>
                      ) : null}
                    </div>
                  </div>
                </section>
              </>
            ) : (
              <section className="rounded-[1.75rem] border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eefcf4] text-[#2e9e5b]">
                  <Layers3 size={24} />
                </div>
                <h2 className="mt-4 text-xl font-black text-slate-800">Elige una franja para comenzar</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-500">
                  Cada franja tiene su propia versión CRECER. Selecciona una edad para ver el editor, cargar contenido y guardar progreso.
                </p>
              </section>
            )}
          </div>

          <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
            <section className="overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-gradient-to-r from-[#fdfbf4] to-white p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Resumen del tema</p>
                <h3 className="mt-2 text-lg font-black text-slate-800">{theme?.titulo ?? "Sin título"}</h3>
              </div>

              <div className="p-5">
                <div className="grid gap-3">
                  <SidebarMetric label="Estado" value={estado.etiqueta} />
                  <SidebarMetric label="Versión" value={`v${theme?.version_contenido ?? 0}`} />
                  <SidebarMetric label="XP" value={`${theme?.xp_recompensa ?? 0}`} />
                  <SidebarMetric label="Duración" value={`${theme?.minutos_estimados ?? 0} min`} />
                </div>

                <div className="mt-4 rounded-2xl bg-[#f7f4ec] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Portada</p>
                  <div className="mt-3 overflow-hidden rounded-2xl border border-slate-100 bg-white">
                    {portadaUrl ? (
                      <img src={portadaUrl} alt={`Portada de ${theme?.titulo ?? "tema"}`} className="aspect-[4/3] w-full object-cover" />
                    ) : (
                      <div className="flex aspect-[4/3] items-center justify-center text-slate-300">
                        <Eye size={24} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <BookOpenText size={16} />
                <p className="text-[10px] font-bold uppercase tracking-[0.22em]">Contenido actual</p>
              </div>

              {activeStepContent ? (
                <div className="mt-4 space-y-3 rounded-2xl bg-[#fcfcfb] p-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#2e9e5b]">{activeStepContent.titulo}</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">{activeStepContent.cuerpo}</p>
                  </div>
                  {activeStepContent.instruccion_corta ? (
                    <p className="rounded-2xl bg-[#eefcf4] px-3 py-2 text-xs font-semibold leading-6 text-[#2e9e5b]">
                      {activeStepContent.instruccion_corta}
                    </p>
                  ) : null}
                </div>
              ) : (
                <EmptyPreviewBlock
                  title="Sin contenido guardado"
                  description="Cuando selecciones una franja y un paso, aquí verás la versión guardada del bloque actual."
                />
              )}
            </section>

            <section className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <Sparkles size={16} />
                <p className="text-[10px] font-bold uppercase tracking-[0.22em]">Guía rápida</p>
              </div>

              <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                <GuideItem text="Edita una franja a la vez para no mezclar mensajes." />
                <GuideItem text="Mantén títulos cortos y contenido directo, pensado para lectura móvil." />
                <GuideItem text="Guarda cada paso antes de cambiar de franja o de momento CRECER." />
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <Clock3 size={16} />
                <p className="text-[10px] font-bold uppercase tracking-[0.22em]">Última edición</p>
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-700">
                {formatearFechaHoraTema(theme?.actualizado_en)}
              </p>
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
  return <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/72">{children}</span>;
}

function MetricMini({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-white/12 bg-white/10 p-3 backdrop-blur">
      <div className="flex items-center gap-2 text-white/62">
        <Icon size={14} />
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]">{label}</p>
      </div>
      <p className="mt-2 text-sm font-black text-white">{value}</p>
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

function Field({
  label,
  help,
  children,
}: {
  label: string;
  help: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</span>
      {children}
      <span className="text-[10px] font-semibold leading-5 text-slate-400">{help}</span>
    </label>
  );
}

function EmptyPreviewBlock({ title, description }: { title: string; description: string }) {
  return (
    <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
      <p className="text-sm font-black text-slate-700">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-500">{description}</p>
    </div>
  );
}

function GuideItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-2xl bg-slate-50 p-3">
      <span className="mt-1 h-2 w-2 rounded-full bg-[#2e9e5b]" />
      <p>{text}</p>
    </div>
  );
}

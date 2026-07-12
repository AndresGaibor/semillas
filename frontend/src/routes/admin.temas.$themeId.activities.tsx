import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Copy,
  FileAudio,
  Gamepad2,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  actualizarActividad,
  crearActividad,
  duplicarActividad,
  eliminarActividad,
  obtenerActividadAdmin,
  obtenerActividadesAdmin,
  obtenerPasosAdmin,
  obtenerTemaAdmin,
  reordenarActividades,
  type ActividadAdmin,
} from "../features/admin/admin.api";
import { obtenerGruposEdad, obtenerTiposActividad } from "../features/catalog/catalog.api";
import { subirArchivo } from "../features/media/media.api";
import type { ActivitySearch } from "../features/admin/componentes/activity-search.types";

export const Route = createFileRoute("/admin/temas/$themeId/activities")({
  component: AdminThemeActivitiesPage,
  validateSearch: (search: Record<string, unknown>): ActivitySearch => ({
    form: search.form as "nueva" | "editar" | undefined,
    actividadId: search.actividadId as string | undefined,
  }),
});

type OptionDraft = { etiqueta: string; texto: string; correcta: boolean; orden: number };
type ActivityDraft = {
  paso_id: string;
  grupo_edad_id: string;
  tipo_actividad_id: string;
  titulo: string;
  consigna: string;
  retroalimentacion: string;
  xp_recompensa: number;
  limite_tiempo_seg: number | null;
  dificultad: "facil" | "normal" | "dificil";
  obligatorio: boolean;
  configuracion: Record<string, unknown>;
  opciones: OptionDraft[];
};

const defaultOptions: OptionDraft[] = ["A", "B", "C", "D"].map((label, index) => ({ etiqueta: label, texto: "", correcta: index === 0, orden: index + 1 }));
const emptyDraft: ActivityDraft = { paso_id: "", grupo_edad_id: "", tipo_actividad_id: "", titulo: "", consigna: "", retroalimentacion: "", xp_recompensa: 10, limite_tiempo_seg: null, dificultad: "facil", obligatorio: true, configuracion: {}, opciones: defaultOptions };

function AdminThemeActivitiesPage() {
  const { themeId } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const queryClient = useQueryClient();
  const [selectedAge, setSelectedAge] = useState("");
  const [draft, setDraft] = useState<ActivityDraft>(emptyDraft);
  const [configText, setConfigText] = useState("{}");

  const themeQuery = useQuery({ queryKey: ["admin", "theme", themeId], queryFn: () => obtenerTemaAdmin(themeId) });
  const groupsQuery = useQuery({ queryKey: ["catalog", "age-groups"], queryFn: obtenerGruposEdad });
  const typesQuery = useQuery({ queryKey: ["catalog", "activity-types"], queryFn: obtenerTiposActividad });
  const stepsQuery = useQuery({ queryKey: ["admin", "theme", themeId, "steps"], queryFn: () => obtenerPasosAdmin(themeId) });
  const activitiesQuery = useQuery({
    queryKey: ["admin", "theme", themeId, "activities", selectedAge],
    queryFn: () => obtenerActividadesAdmin({ tema_id: themeId, grupo_edad_id: selectedAge || undefined, limit: 500 }),
  });
  const editQuery = useQuery({ queryKey: ["admin", "activity", search.actividadId], queryFn: () => obtenerActividadAdmin(search.actividadId!), enabled: search.form === "editar" && Boolean(search.actividadId) });

  useEffect(() => {
    if (!selectedAge && groupsQuery.data?.length) {
      const available = themeQuery.data?.grupos_edad?.[0]?.id;
      const firstId = groupsQuery.data?.[0]?.id;
      setSelectedAge(available || firstId || "");
    }
  }, [groupsQuery.data, selectedAge, themeQuery.data?.grupos_edad]);
  useEffect(() => {
    if (search.form === "nueva") {
      setDraft({ ...emptyDraft, grupo_edad_id: selectedAge, paso_id: stepsQuery.data?.[0]?.id ?? "", tipo_actividad_id: typesQuery.data?.[0]?.id ?? "", opciones: defaultOptions.map((option) => ({ ...option })) });
      setConfigText("{}");
    }
  }, [search.form, selectedAge, stepsQuery.data, typesQuery.data]);
  useEffect(() => {
    const activity = editQuery.data;
    if (!activity || search.form !== "editar") return;
    const nextDraft: ActivityDraft = {
      paso_id: activity.paso_id ?? "",
      grupo_edad_id: activity.grupo_edad_id,
      tipo_actividad_id: activity.tipo_actividad_id,
      titulo: activity.titulo,
      consigna: activity.consigna,
      retroalimentacion: activity.retroalimentacion ?? "",
      xp_recompensa: activity.xp_recompensa,
      limite_tiempo_seg: activity.limite_tiempo_seg,
      dificultad: (activity.dificultad as ActivityDraft["dificultad"]) ?? "facil",
      obligatorio: activity.obligatorio,
      configuracion: activity.configuracion ?? {},
      opciones: activity.opciones.length ? activity.opciones.map((option, index) => ({ etiqueta: option.etiqueta ?? String.fromCharCode(65 + index), texto: option.texto, correcta: option.correcta, orden: option.orden })) : defaultOptions.map((option) => ({ ...option })),
    };
    setDraft(nextDraft);
    setConfigText(JSON.stringify(nextDraft.configuracion, null, 2));
  }, [editQuery.data, search.form]);

  const selectedType = typesQuery.data?.find((type) => type.id === draft.tipo_actividad_id);
  const isFormOpen = search.form === "nueva" || search.form === "editar";
  const activities = useMemo(() => [...(activitiesQuery.data?.actividades ?? [])].sort((a, b) => a.orden - b.orden), [activitiesQuery.data]);

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin", "theme", themeId, "activities"] }),
      queryClient.invalidateQueries({ queryKey: ["admin", "theme", themeId, "studio"] }),
      queryClient.invalidateQueries({ queryKey: ["admin", "activities"] }),
    ]);
  };
  const closeForm = () => navigate({ search: {} });

  const saveMutation = useMutation({
    mutationFn: async () => {
      let parsedConfig: Record<string, unknown> = draft.configuracion;
      try { parsedConfig = JSON.parse(configText) as Record<string, unknown>; } catch { throw new Error("La configuración avanzada no contiene JSON válido"); }
      if (!draft.titulo.trim() || !draft.consigna.trim() || !draft.paso_id || !draft.grupo_edad_id || !draft.tipo_actividad_id) throw new Error("Completa los campos obligatorios");
      const payload = {
        tema_id: themeId,
        paso_id: draft.paso_id,
        grupo_edad_id: draft.grupo_edad_id,
        tipo_actividad_id: draft.tipo_actividad_id,
        titulo: draft.titulo.trim(),
        consigna: draft.consigna.trim(),
        retroalimentacion: draft.retroalimentacion.trim() || undefined,
        orden: search.form === "editar" ? editQuery.data?.orden ?? 1 : activities.length + 1,
        xp_recompensa: draft.xp_recompensa,
        limite_tiempo_seg: draft.limite_tiempo_seg,
        dificultad: draft.dificultad,
        obligatorio: draft.obligatorio,
        configuracion: parsedConfig,
        opciones: draft.opciones.filter((option) => option.texto.trim()).map((option, index) => ({ ...option, texto: option.texto.trim(), orden: index + 1 })),
      };
      if (search.form === "editar" && search.actividadId) return actualizarActividad(search.actividadId, payload);
      return crearActividad(payload);
    },
    onSuccess: async () => { await invalidate(); closeForm(); toast.success(search.form === "editar" ? "Actividad actualizada" : "Actividad creada"); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo guardar"),
  });
  const deleteMutation = useMutation({ mutationFn: eliminarActividad, onSuccess: async () => { await invalidate(); toast.success("Actividad eliminada"); }, onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo eliminar") });
  const duplicateMutation = useMutation({ mutationFn: duplicarActividad, onSuccess: async () => { await invalidate(); toast.success("Actividad duplicada"); }, onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo duplicar") });
  const reorderMutation = useMutation({ mutationFn: (ids: string[]) => reordenarActividades(themeId, ids), onSuccess: async () => { await invalidate(); }, onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo reordenar") });
  const uploadMutation = useMutation({
    mutationFn: async ({ file, key, type }: { file: File; key: string; type: "imagen" | "audio" | "video" }) => ({ key, resource: await subirArchivo(file, type, `${draft.titulo || "Actividad"} - ${key}`) }),
    onSuccess: ({ key, resource }) => {
      const next = { ...draft.configuracion, [key]: resource.url_publica, [`${key}_recurso_id`]: resource.id };
      setDraft((current) => ({ ...current, configuracion: next })); setConfigText(JSON.stringify(next, null, 2)); toast.success("Recurso agregado a la actividad");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "No se pudo subir"),
  });

  const moveActivity = (activityId: string, direction: -1 | 1) => {
    const index = activities.findIndex((activity) => activity.id === activityId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= activities.length) return;
    const ids = activities.map((activity) => activity.id);
    const temp = ids[index]!;
    ids[index] = ids[target]!;
    ids[target] = temp;
    reorderMutation.mutate(ids);
  };

  return (
    <div className="admin-theme-studio">
      <header className="admin-theme-library__hero">
        <div className="flex items-center gap-4"><button type="button" className="admin-icon-button" onClick={() => navigate({ to: "/admin/temas/$themeId/detalle", params: { themeId } })}><ArrowLeft size={19} /></button><div><span className="admin-eyebrow">Editor interactivo</span><h2 className="!text-2xl">Actividades del tema</h2><p>{themeQuery.data?.titulo ?? "Tema"} · juegos, audio, video y evaluaciones por paso y franja.</p></div></div>
        <button type="button" className="admin-primary-button" onClick={() => navigate({ search: { form: "nueva" } })}><Plus size={17} /> Nueva actividad</button>
      </header>

      <section className="admin-editor-section">
        <div className="admin-editor-section__header"><div><h2>Filtrar por franja</h2><p>El orden se guarda en el backend y se utiliza en la experiencia del estudiante.</p></div><select className="rounded-xl border border-[#2a4a3a] px-4 py-2 text-sm" value={selectedAge} onChange={(event) => setSelectedAge(event.target.value)}><option value="">Todas las franjas</option>{groupsQuery.data?.map((group) => <option key={group.id} value={group.id}>{group.nombre}</option>)}</select></div>
      </section>

      <div className={isFormOpen ? "admin-editor-shell" : ""}>
        <main className="admin-editor-main">
          <section className="admin-editor-section">
            <div className="admin-editor-section__header"><div><h2>Secuencia de actividades</h2><p>{activities.length} actividades. Usa las flechas para ajustar el orden sin arrastrar una tabla.</p></div></div>
            {activitiesQuery.isLoading ? <div className="grid place-items-center py-16"><Loader2 className="animate-spin text-violet-600" /></div> : activities.length === 0 ? <div className="admin-library-empty"><Gamepad2 className="mx-auto text-emerald-400/50" /><h3>Sin actividades en esta franja</h3><p>Crea una actividad y asígnala a un paso CRECER.</p></div> : <div className="admin-activity-list">{activities.map((activity, index) => <ActivityRow key={activity.id} activity={activity} stepName={stepsQuery.data?.find((step) => step.id === activity.paso_id)?.tipo_paso?.nombre ?? "Sin paso"} onEdit={() => navigate({ search: { form: "editar", actividadId: activity.id } })} onDelete={() => deleteMutation.mutate(activity.id)} onDuplicate={() => duplicateMutation.mutate(activity.id)} onUp={() => moveActivity(activity.id, -1)} onDown={() => moveActivity(activity.id, 1)} disableUp={index === 0 || reorderMutation.isPending} disableDown={index === activities.length - 1 || reorderMutation.isPending} />)}</div>}
          </section>
        </main>

        {isFormOpen ? (
          <aside className="admin-editor-aside !static">
            <section className="admin-editor-section">
              <div className="admin-editor-section__header"><div><h2>{search.form === "editar" ? "Editar actividad" : "Nueva actividad"}</h2><p>El formulario cambia según el tipo seleccionado.</p></div><button type="button" className="admin-icon-button" onClick={closeForm}><X size={18} /></button></div>
              {editQuery.isLoading ? <div className="grid place-items-center py-20"><Loader2 className="animate-spin" /></div> : <ActivityBuilder draft={draft} onChange={setDraft} configText={configText} onConfigTextChange={setConfigText} steps={stepsQuery.data ?? []} groups={groupsQuery.data ?? []} types={typesQuery.data ?? []} selectedTypeCode={selectedType?.codigo ?? ""} onUpload={(file, key, type) => uploadMutation.mutate({ file, key, type })} uploading={uploadMutation.isPending} />}
              <div className="admin-save-bar mt-5"><p>La configuración se guarda como JSON validado por el backend.</p><button type="button" className="admin-primary-button" disabled={saveMutation.isPending || uploadMutation.isPending} onClick={() => saveMutation.mutate()}>{saveMutation.isPending ? <Loader2 className="animate-spin" size={17} /> : <Save size={17} />} Guardar</button></div>
            </section>
          </aside>
        ) : null}
      </div>
    </div>
  );
}

function ActivityRow({ activity, stepName, onEdit, onDelete, onDuplicate, onUp, onDown, disableUp, disableDown }: { activity: ActividadAdmin; stepName: string; onEdit: () => void; onDelete: () => void; onDuplicate: () => void; onUp: () => void; onDown: () => void; disableUp: boolean; disableDown: boolean }) {
  return <article className="admin-activity-row"><div className="admin-activity-row__handle"><Gamepad2 size={18} /></div><div className="admin-activity-row__identity"><strong>{activity.titulo}</strong><p>{activity.consigna}</p><div className="admin-activity-row__tags"><span>{stepName}</span><span>{activity.tipo_actividad?.nombre ?? "Actividad"}</span><span>{activity.xp_recompensa} XP</span><span>{activity.dificultad}</span></div></div><div className="admin-activity-row__actions"><button type="button" className="admin-icon-button" disabled={disableUp} onClick={onUp}><ArrowUp size={16} /></button><button type="button" className="admin-icon-button" disabled={disableDown} onClick={onDown}><ArrowDown size={16} /></button><button type="button" className="admin-icon-button" onClick={onEdit}><Pencil size={16} /></button><button type="button" className="admin-icon-button" onClick={onDuplicate}><Copy size={16} /></button><button type="button" className="admin-icon-button !text-red-500" onClick={onDelete}><Trash2 size={16} /></button></div></article>;
}

function ActivityBuilder({ draft, onChange, configText, onConfigTextChange, steps, groups, types, selectedTypeCode, onUpload, uploading }: { draft: ActivityDraft; onChange: (draft: ActivityDraft) => void; configText: string; onConfigTextChange: (value: string) => void; steps: Array<{ id: string; tipo_paso?: { nombre?: string | null } | null }>; groups: Array<{ id: string; nombre: string }>; types: Array<{ id: string; codigo: string; nombre: string; descripcion: string | null; es_juego: boolean }>; selectedTypeCode: string; onUpload: (file: File, key: string, type: "imagen" | "audio" | "video") => void; uploading: boolean }) {
  const update = <K extends keyof ActivityDraft>(key: K, value: ActivityDraft[K]) => onChange({ ...draft, [key]: value });
  const updateConfig = (key: string, value: unknown) => {
    const next = key === "__merge__" && value && typeof value === "object"
      ? { ...draft.configuracion, ...(value as Record<string, unknown>) }
      : { ...draft.configuracion, [key]: value };
    update("configuracion", next);
    onConfigTextChange(JSON.stringify(next, null, 2));
  };
  const isQuiz = ["cuestionario", "quiz", "opcion_multiple", "actividad_audio", "actividad_video", "video"].some((code) => selectedTypeCode.includes(code));

  return <div className="admin-form-grid">
    <Field label="Paso CRECER"><select value={draft.paso_id} onChange={(event) => update("paso_id", event.target.value)}><option value="">Selecciona un paso</option>{steps.map((step) => <option key={step.id} value={step.id}>{step.tipo_paso?.nombre ?? "Paso"}</option>)}</select></Field>
    <Field label="Franja"><select value={draft.grupo_edad_id} onChange={(event) => update("grupo_edad_id", event.target.value)}><option value="">Selecciona una franja</option>{groups.map((group) => <option key={group.id} value={group.id}>{group.nombre}</option>)}</select></Field>
    <Field label="Tipo" wide><select value={draft.tipo_actividad_id} onChange={(event) => { update("tipo_actividad_id", event.target.value); const type = types.find((item) => item.id === event.target.value); if (type) onConfigTextChange("{}"); }}><option value="">Selecciona el tipo</option>{types.map((type) => <option key={type.id} value={type.id}>{type.nombre}</option>)}</select></Field>
    <Field label="Título" wide><input value={draft.titulo} onChange={(event) => update("titulo", event.target.value)} /></Field>
    <Field label="Consigna" wide><textarea rows={3} value={draft.consigna} onChange={(event) => update("consigna", event.target.value)} /></Field>
    <Field label="Retroalimentación" wide><textarea rows={2} value={draft.retroalimentacion} onChange={(event) => update("retroalimentacion", event.target.value)} /></Field>
    <Field label="XP"><input type="number" min={0} value={draft.xp_recompensa} onChange={(event) => update("xp_recompensa", Number(event.target.value))} /></Field>
    <Field label="Tiempo límite (segundos)"><input type="number" min={1} value={draft.limite_tiempo_seg ?? ""} onChange={(event) => update("limite_tiempo_seg", event.target.value ? Number(event.target.value) : null)} /></Field>
    <Field label="Dificultad"><select value={draft.dificultad} onChange={(event) => update("dificultad", event.target.value as ActivityDraft["dificultad"])}><option value="facil">Fácil</option><option value="normal">Normal</option><option value="dificil">Difícil</option></select></Field>
    <Field label="Obligatoria"><select value={draft.obligatorio ? "si" : "no"} onChange={(event) => update("obligatorio", event.target.value === "si")}><option value="si">Sí</option><option value="no">No</option></select></Field>

    <div className="admin-field admin-field--wide"><span>Configuración del tipo</span><div className="admin-config-builder"><TypeSpecificConfig code={selectedTypeCode} config={draft.configuracion} updateConfig={updateConfig} onUpload={onUpload} uploading={uploading} />{isQuiz ? <OptionsBuilder options={draft.opciones} onChange={(opciones) => update("opciones", opciones)} /> : null}<div className="admin-config-help">Los campos visuales actualizan el JSON. La edición avanzada permite cubrir nuevos tipos sin desplegar otro formulario.</div><textarea rows={8} value={configText} onChange={(event) => onConfigTextChange(event.target.value)} className="font-mono text-xs" aria-label="Configuración JSON avanzada" /></div></div>
  </div>;
}

function TypeSpecificConfig({ code, config, updateConfig, onUpload, uploading }: { code: string; config: Record<string, unknown>; updateConfig: (key: string, value: unknown) => void; onUpload: (file: File, key: string, type: "imagen" | "audio" | "video") => void; uploading: boolean }) {
  if (!code) return <p className="text-xs text-emerald-300/60">Selecciona un tipo para ver sus campos especializados.</p>;
  if (code.includes("video")) return <><ConfigField label="URL del video" value={String(config.video_url ?? "")} onChange={(value) => updateConfig("video_url", value)} /><MediaUpload label="Subir video" icon={<Video size={18} />} accept="video/*" disabled={uploading} onFile={(file) => onUpload(file, "video_url", "video")} /></>;
  if (code.includes("audio") || code.includes("cancion")) return <><ConfigField label="URL del audio" value={String(config.audio_url ?? config.cancion_url ?? "")} onChange={(value) => updateConfig(code.includes("cancion") ? "cancion_url" : "audio_url", value)} /><MediaUpload label="Subir audio" icon={<FileAudio size={18} />} accept="audio/*" disabled={uploading} onFile={(file) => onUpload(file, code.includes("cancion") ? "cancion_url" : "audio_url", "audio")} /><ConfigArea label="Letra o transcripción" value={String(config.letra ?? "")} onChange={(value) => updateConfig("letra", value)} /></>;
  if (code.includes("completar")) return <><ConfigArea label="Frase con espacio" value={String(config.frase ?? "")} onChange={(value) => updateConfig("frase", value)} /><ConfigField label="Respuesta" value={String(config.respuesta ?? "")} onChange={(value) => updateConfig("respuesta", value)} /></>;
  if (code.includes("verdadero")) return <ConfigArea label="Afirmaciones (una por línea: texto|true o false)" value={arrayToLines(config.afirmaciones)} onChange={(value) => updateConfig("afirmaciones", value.split("\n").filter(Boolean).map((line) => { const [texto, correcta] = line.split("|"); return { texto: (texto ?? "").trim(), correcta: correcta?.trim() === "true" }; }))} />;
  if (code.includes("relacionar")) return <ConfigArea label="Pares (izquierda|derecha)" value={pairsToLines(config.pares)} onChange={(value) => updateConfig("pares", value.split("\n").filter(Boolean).map((line) => { const [izquierda, derecha] = line.split("|"); return { izquierda: (izquierda ?? "").trim(), derecha: (derecha ?? "").trim() }; }))} />;
  if (code.includes("arrastrar") || code.includes("secuencia")) return <ConfigArea label="Elementos en orden (uno por línea)" value={simpleArrayToLines(config.items)} onChange={(value) => { const items = value.split("\n").filter(Boolean); updateConfig("__merge__", { items, orden_correcto: items }); }} />;
  if (code.includes("sopa")) return <><ConfigField label="Palabras separadas por coma" value={simpleArrayToLines(config.palabras).replaceAll("\n", ", ")} onChange={(value) => updateConfig("palabras", value.split(",").map((item) => item.trim()).filter(Boolean))} /><ConfigField label="Filas" value={String(config.filas ?? 12)} type="number" onChange={(value) => updateConfig("filas", Number(value))} /><ConfigField label="Columnas" value={String(config.columnas ?? 12)} type="number" onChange={(value) => updateConfig("columnas", Number(value))} /></>;
  if (code.includes("rompecabezas")) return <><ConfigField label="URL de imagen" value={String(config.imagen ?? "")} onChange={(value) => updateConfig("imagen", value)} /><MediaUpload label="Subir imagen" icon={<ImageIcon size={18} />} accept="image/*" disabled={uploading} onFile={(file) => onUpload(file, "imagen", "imagen")} /><ConfigField label="Filas" type="number" value={String(config.filas ?? 3)} onChange={(value) => updateConfig("filas", Number(value))} /><ConfigField label="Columnas" type="number" value={String(config.columnas ?? 3)} onChange={(value) => updateConfig("columnas", Number(value))} /></>;
  if (code.includes("aventura")) return <ConfigArea label="Escenas JSON" value={JSON.stringify(config.escenas ?? [], null, 2)} onChange={(value) => { try { updateConfig("escenas", JSON.parse(value)); } catch { /* se valida en JSON avanzado */ } }} />;
  return <p className="text-xs leading-6 text-emerald-300/60">Este tipo usa opciones y configuración avanzada. Puedes definir cualquier propiedad compatible con el renderizador.</p>;
}

function OptionsBuilder({ options, onChange }: { options: OptionDraft[]; onChange: (options: OptionDraft[]) => void }) { return <div className="admin-option-builder"><strong className="text-xs text-emerald-100">Opciones de respuesta</strong>{options.map((option, index) => <div key={`${option.etiqueta}-${index}`} className="admin-option-row"><span>{option.etiqueta}</span><input value={option.texto} onChange={(event) => onChange(options.map((item, itemIndex) => itemIndex === index ? { ...item, texto: event.target.value } : item))} /><label><input type="radio" name="correct-answer" checked={option.correcta} onChange={() => onChange(options.map((item, itemIndex) => ({ ...item, correcta: itemIndex === index })))} /> Correcta</label><button type="button" className="admin-icon-button !h-8 !w-8 !text-red-500" onClick={() => onChange(options.filter((_, itemIndex) => itemIndex !== index).map((item, itemIndex) => ({ ...item, etiqueta: String.fromCharCode(65 + itemIndex), orden: itemIndex + 1 })))}><Trash2 size={14} /></button></div>)}<button type="button" className="admin-secondary-button w-fit" onClick={() => onChange([...options, { etiqueta: String.fromCharCode(65 + options.length), texto: "", correcta: false, orden: options.length + 1 }])}><Plus size={14} /> Agregar opción</button></div>; }
function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) { return <label className={`admin-field ${wide ? "admin-field--wide" : ""}`}><span>{label}</span>{children}</label>; }
function ConfigField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) { return <label className="admin-field"><span>{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} /></label>; }
function ConfigArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="admin-field"><span>{label}</span><textarea rows={5} value={value} onChange={(event) => onChange(event.target.value)} /></label>; }
function MediaUpload({ label, icon, accept, disabled, onFile }: { label: string; icon: React.ReactNode; accept: string; disabled: boolean; onFile: (file: File) => void }) { return <label className="admin-media-slot cursor-pointer"><div className="admin-media-slot__preview">{icon}</div><div><strong>{label}</strong><small>El archivo se registra en Medios y su URL queda en la configuración.</small><span className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-violet-600"><Upload size={14} /> {disabled ? "Subiendo..." : "Seleccionar archivo"}</span></div><input className="hidden" type="file" accept={accept} disabled={disabled} onChange={(event) => { const file = event.target.files?.[0]; if (file) onFile(file); }} /></label>; }
function arrayToLines(value: unknown) { return Array.isArray(value) ? value.map((item) => typeof item === "object" && item ? `${String((item as any).texto ?? "")}|${String((item as any).correcta ?? false)}` : String(item)).join("\n") : ""; }
function pairsToLines(value: unknown) { return Array.isArray(value) ? value.map((item) => `${String((item as any)?.izquierda ?? "")}|${String((item as any)?.derecha ?? "")}`).join("\n") : ""; }
function simpleArrayToLines(value: unknown) { return Array.isArray(value) ? value.map(String).join("\n") : ""; }

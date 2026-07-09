import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { crearActividad, eliminarActividad, actualizarActividad, obtenerPasosAdmin } from "../features/admin/admin.api";
import { obtenerActividad } from "../features/activities/activities.api";
import { obtenerTiposActividad, obtenerGruposEdad } from "../features/catalog/catalog.api";
import { obtenerActividades } from "../features/themes/themes.api";
import { ArrowLeft, Loader, Plus, Trash2, Gamepad2 } from "lucide-react";

interface ActivitySearch {
  form?: "nueva" | "editar";
  actividadId?: string;
}

export const Route = createFileRoute("/admin/temas/$themeId/activities")({
  component: AdminThemeActivitiesPage,
  validateSearch: (search: Record<string, unknown>): ActivitySearch => ({
    form: search.form as "nueva" | "editar" | undefined,
    actividadId: search.actividadId as string | undefined,
  }),
});

function AdminThemeActivitiesPage() {
  const { themeId } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const queryClient = useQueryClient();

  const isEditMode = search.form === "editar" && search.actividadId;
  const isNewMode = search.form === "nueva";

  const [selectedAgeGroupId, setSelectedAgeGroupId] = useState("");
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [xpReward, setXpReward] = useState(10);
  const [selectedStepId, setSelectedStepId] = useState("");
  const [selectedActivityTypeId, setSelectedActivityTypeId] = useState("");
  const [feedback, setFeedback] = useState("");
  const [options, setOptions] = useState([
    { etiqueta: "A", texto: "", correcta: false, orden: 1 },
    { etiqueta: "B", texto: "", correcta: false, orden: 2 },
    { etiqueta: "C", texto: "", correcta: false, orden: 3 },
    { etiqueta: "D", texto: "", correcta: false, orden: 4 }
  ]);

  const ageGroupsQuery = useQuery({
    queryKey: ["catalog", "age-groups"],
    queryFn: obtenerGruposEdad,
  });

  const activityToEditQuery = useQuery({
    queryKey: ["admin", "activity", search.actividadId],
    queryFn: () => obtenerActividad(search.actividadId!),
    enabled: !!search.actividadId,
  });

  useEffect(() => {
    if (activityToEditQuery.data && isEditMode) {
      const act = activityToEditQuery.data;
      setTitle(act.titulo);
      setPrompt(act.consigna);
      setXpReward(act.xp_recompensa);
      setSelectedStepId(act.paso_id || "");
      setSelectedActivityTypeId(act.tipo_actividad_id);
      setFeedback(act.retroalimentacion || "");
      if (act.opciones && act.opciones.length > 0) {
        setOptions(act.opciones.map((opt, idx) => ({
          etiqueta: opt.etiqueta || String.fromCharCode(65 + idx),
          texto: opt.texto,
          correcta: opt.correcta,
          orden: idx + 1
        })));
      }
      if (act.grupo_edad_id) {
        setSelectedAgeGroupId(act.grupo_edad_id);
      }
    }
  }, [activityToEditQuery.data, isEditMode]);

  useEffect(() => {
    if (!selectedAgeGroupId && ageGroupsQuery.data && ageGroupsQuery.data.length > 0) {
      const first = ageGroupsQuery.data[0];
      if (first && !isEditMode) setSelectedAgeGroupId(first.id);
    }
  }, [ageGroupsQuery.data, selectedAgeGroupId, isEditMode]);

  const activitiesQuery = useQuery({
    queryKey: ["admin", "theme", themeId, "activities", selectedAgeGroupId],
    queryFn: () => obtenerActividades(themeId, selectedAgeGroupId || undefined),
    enabled: !!selectedAgeGroupId && !isEditMode
  });
  const stepsQuery = useQuery({
    queryKey: ["admin", "theme", themeId, "steps"],
    queryFn: () => obtenerPasosAdmin(themeId)
  });
  const activityTypesQuery = useQuery({
    queryKey: ["catalog", "activity-types"],
    queryFn: obtenerTiposActividad
  });

  const createMutation = useMutation({
    mutationFn: () => {
      if (!selectedStepId || !selectedActivityTypeId) throw new Error("Faltan campos");
      return crearActividad({
        tema_id: themeId,
        paso_id: selectedStepId || null,
        grupo_edad_id: selectedAgeGroupId,
        tipo_actividad_id: selectedActivityTypeId,
        titulo: title,
        consigna: prompt,
        retroalimentacion: feedback || undefined,
        orden: (activitiesQuery.data?.length ?? 0) + 1,
        xp_recompensa: xpReward,
        dificultad: "facil",
        obligatorio: true,
        configuracion: {},
        opciones: options.filter(o => o.texto).map((option, index) => ({
          etiqueta: option.etiqueta,
          texto: option.texto,
          correcta: option.correcta,
          orden: index + 1,
          retroalimentacion: undefined
        }))
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "theme", themeId, "activities"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "activities"] });
      navigate({ search: {} });
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!search.actividadId) throw new Error("ID de actividad requerido");
      return actualizarActividad(search.actividadId, {
        titulo: title,
        consigna: prompt,
        retroalimentacion: feedback || undefined,
        xp_recompensa: xpReward,
        paso_id: selectedStepId || null,
        tipo_actividad_id: selectedActivityTypeId,
        grupo_edad_id: selectedAgeGroupId,
        dificultad: "facil",
        obligatorio: true,
        opciones: options.filter(o => o.texto).map((option, index) => ({
          etiqueta: option.etiqueta,
          texto: option.texto,
          correcta: option.correcta,
          orden: index + 1,
          retroalimentacion: undefined
        }))
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "activities"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "theme", themeId, "activities"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "activity", search.actividadId] });
      navigate({ search: {} });
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: eliminarActividad,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "activities"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "theme", themeId, "activities"] });
    }
  });

  const resetForm = () => {
    setTitle("");
    setPrompt("");
    setXpReward(10);
    setFeedback("");
    setSelectedStepId("");
    setSelectedActivityTypeId("");
    setOptions([
      { etiqueta: "A", texto: "", correcta: false, orden: 1 },
      { etiqueta: "B", texto: "", correcta: false, orden: 2 },
      { etiqueta: "C", texto: "", correcta: false, orden: 3 },
      { etiqueta: "D", texto: "", correcta: false, orden: 4 }
    ]);
  };

  const handleCloseForm = () => {
    navigate({ search: {} });
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const isFormOpen = isNewMode || isEditMode;
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <button type="button" onClick={() => navigate({ to: "/admin/temas" })} className="flex items-center gap-1 text-sm text-[#123b2c]/50 mb-6">
        <ArrowLeft size={16} /> Volver
      </button>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-[#123b2c]">Franja:</label>
          <select
            value={selectedAgeGroupId}
            onChange={(e) => setSelectedAgeGroupId(e.target.value)}
            disabled={!!isEditMode}
            className="px-3 py-2 rounded-xl border border-[#e5e7eb] text-sm bg-white disabled:bg-slate-50"
          >
            <option value="">Todas</option>
            {ageGroupsQuery.data?.map((ag) => (
              <option key={ag.id} value={ag.id}>{ag.nombre}</option>
            ))}
          </select>
        </div>
        {!isEditMode && (
          <button type="button" onClick={() => navigate({ search: { form: "nueva" } })} className="flex items-center gap-1.5 bg-[#2e9e5b] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#267d4c] transition-colors">
            <Plus size={16} /> Nueva
          </button>
        )}
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-sm mb-6 grid gap-4 max-w-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#123b2c]">
              {isEditMode ? "Editar actividad" : "Nueva actividad (Quiz)"}
            </h3>
            <button type="button" onClick={handleCloseForm} className="text-sm text-slate-400 hover:text-slate-600">
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select value={selectedStepId} onChange={(e) => setSelectedStepId(e.target.value)} className="px-4 py-2.5 rounded-xl border border-[#e5e7eb] text-sm">
              <option value="">Paso CRECER</option>
              {stepsQuery.data?.map((s) => <option key={s.id} value={s.id}>{s.tipo_paso?.nombre}</option>)}
            </select>
            <select value={selectedActivityTypeId} onChange={(e) => setSelectedActivityTypeId(e.target.value)} className="px-4 py-2.5 rounded-xl border border-[#e5e7eb] text-sm">
              <option value="">Tipo</option>
              {activityTypesQuery.data?.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
            </select>
          </div>

          <input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} className="px-4 py-2.5 rounded-xl border border-[#e5e7eb] text-sm" />
          <textarea placeholder="Pregunta" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} className="px-4 py-2.5 rounded-xl border border-[#e5e7eb] text-sm" />
          <input placeholder="Retroalimentación (opcional)" value={feedback} onChange={(e) => setFeedback(e.target.value)} className="px-4 py-2.5 rounded-xl border border-[#e5e7eb] text-sm" />
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-[#123b2c]">XP</label>
            <input type="number" value={xpReward} onChange={(e) => setXpReward(Number(e.target.value))} className="w-20 px-3 py-2 rounded-xl border border-[#e5e7eb] text-sm" />
          </div>

          <div>
            <label className="text-sm font-medium text-[#123b2c] mb-2 block">Opciones</label>
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <span className="w-6 text-sm font-bold text-[#123b2c]">{opt.etiqueta}.</span>
                <input placeholder={`Opción ${opt.etiqueta}`} value={opt.texto} onChange={(e) => setOptions(options.map((o, j) => j === i ? { ...o, texto: e.target.value } : o))} className="flex-1 px-3 py-2 rounded-xl border border-[#e5e7eb] text-sm" />
                <label className="flex items-center gap-1 text-xs text-[#2e9e5b] whitespace-nowrap">
                  <input type="radio" name="correctOption" checked={opt.correcta} onChange={() => setOptions(options.map((o, j) => ({ ...o, correcta: j === i })))} />
                  Correcta
                </label>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={(!selectedStepId && !isEditMode) || !title || !prompt || isSubmitting}
            className="bg-[#2e9e5b] text-white py-2.5 rounded-xl font-semibold hover:bg-[#267d4c] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader className="animate-spin" size={18} />
                {isEditMode ? "Actualizando..." : "Creando..."}
              </>
            ) : (
              <>
                <Plus size={18} />
                {isEditMode ? "Actualizar actividad" : "Crear actividad"}
              </>
            )}
          </button>
        </form>
      )}

      {!isFormOpen && (
        <div className="grid gap-3">
          {activitiesQuery.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="animate-spin text-primario" size={24} />
            </div>
          ) : activitiesQuery.data?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <Gamepad2 className="mx-auto text-[#123b2c]/20 mb-3" size={48} />
              <p className="text-[#123b2c]/40">No hay actividades aún</p>
            </div>
          ) : (
            activitiesQuery.data?.map((activity) => (
              <div key={activity.id} className="bg-white rounded-xl p-4 shadow-sm border border-[#e5e7eb]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#123b2c]">{activity.titulo}</h3>
                    <p className="text-sm text-[#123b2c]/60 mt-0.5 line-clamp-2">{activity.consigna}</p>
                    <span className="text-xs text-[#f4b740] font-medium mt-1 inline-block">{activity.xp_recompensa} XP</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => navigate({ search: { form: "editar", actividadId: activity.id } })}
                      className="p-2 text-[#3d8bd4] hover:bg-[#3d8bd4]/10 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <i className="fa-solid fa-pencil" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(activity.id)}
                      className="p-2 text-[#ee6c4d] hover:bg-[#ee6c4d]/10 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {activity.opciones && activity.opciones.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {activity.opciones.map((opt) => (
                      <span key={opt.id} className={`text-xs px-2 py-1 rounded-md ${opt.correcta ? "bg-[#2e9e5b]/10 text-[#2e9e5b]" : "bg-[#f7f4ec] text-[#123b2c]/50"}`}>
                        {opt.etiqueta}. {opt.texto} {opt.correcta ? "✓" : ""}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

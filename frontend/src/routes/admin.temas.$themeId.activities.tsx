import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createActivity, deleteActivity, getAdminThemeSteps } from "../features/admin/admin.api";
import { getActivityTypes } from "../features/catalog/catalog.api";
import { getThemeActivities } from "../features/themes/themes.api";
import { getMe } from "../features/profile/profile.api";
import { ArrowLeft, Loader, Plus, Trash2, Gamepad2 } from "lucide-react";

export const Route = createFileRoute("/admin/temas/$themeId/activities")({
  component: AdminThemeActivitiesPage
});

function AdminThemeActivitiesPage() {
  const { themeId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
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

  const meQuery = useQuery({ queryKey: ["me"], queryFn: getMe });
  const activitiesQuery = useQuery({
    queryKey: ["admin", "theme", themeId, "activities"],
    queryFn: () => getThemeActivities(themeId, meQuery.data?.perfil?.grupo_edad_id ?? undefined),
    enabled: !!meQuery.data
  });
  const stepsQuery = useQuery({
    queryKey: ["admin", "theme", themeId, "steps"],
    queryFn: () => getAdminThemeSteps(themeId)
  });
  const activityTypesQuery = useQuery({
    queryKey: ["catalog", "activity-types"],
    queryFn: getActivityTypes
  });

  const createMutation = useMutation({
    mutationFn: () => {
      if (!selectedStepId || !selectedActivityTypeId) throw new Error("Faltan campos");
      return createActivity({
        tema_id: themeId,
        paso_id: selectedStepId,
        grupo_edad_id: meQuery.data?.perfil?.grupo_edad_id ?? "",
        tipo_actividad_id: selectedActivityTypeId,
        titulo: title,
        consigna: prompt,
        retroalimentacion: feedback || undefined,
        orden: (activitiesQuery.data?.length ?? 0) + 1,
        xp_recompensa: xpReward,
        difficulty: "facil",
        obligatorio: true,
        configuracion: {},
        opciones: options.map((option, index) => ({
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
      setShowForm(false);
      setTitle(""); setPrompt(""); setXpReward(10); setFeedback("");
      setOptions([{ etiqueta: "A", texto: "", correcta: false, orden: 1 }, { etiqueta: "B", texto: "", correcta: false, orden: 2 }, { etiqueta: "C", texto: "", correcta: false, orden: 3 }, { etiqueta: "D", texto: "", correcta: false, orden: 4 }]);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "theme", themeId, "activities"] })
  });

  return (
    <div>
      <button onClick={() => navigate({ to: "/admin/temas" })} className="flex items-center gap-1 text-sm text-[#123b2c]/50 mb-4">
        <ArrowLeft size={16} /> Volver
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#123b2c]">Actividades</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 bg-[#2e9e5b] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#267d4c] transition-colors">
          <Plus size={16} /> {showForm ? "Cancelar" : "Nueva"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6 grid gap-4 max-w-xl">
          <h3 className="font-bold text-[#123b2c]">Nueva actividad (Quiz)</h3>

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

          <button onClick={() => createMutation.mutate()} disabled={!selectedStepId || !title || !prompt} className="bg-[#2e9e5b] text-white py-2.5 rounded-xl font-semibold hover:bg-[#267d4c] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {createMutation.isPending ? <Loader className="animate-spin" size={18} /> : <Plus size={18} />}
            {createMutation.isPending ? "Creando..." : "Crear actividad"}
          </button>
        </div>
      )}

      <div className="grid gap-3">
        {activitiesQuery.data?.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl">
            <Gamepad2 className="mx-auto text-[#123b2c]/20 mb-3" size={48} />
            <p className="text-[#123b2c]/40">No hay actividades aún</p>
          </div>
        )}

        {activitiesQuery.data?.map((activity) => (
          <div key={activity.id} className="bg-white rounded-xl p-4 shadow-sm border border-[#e5e7eb]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#123b2c]">{activity.titulo}</h3>
                <p className="text-sm text-[#123b2c]/60 mt-0.5 line-clamp-2">{activity.consigna}</p>
                <span className="text-xs text-[#f4b740] font-medium mt-1 inline-block">{activity.xp_recompensa} XP</span>
              </div>
              <button onClick={() => deleteMutation.mutate(activity.id)} className="p-2 text-[#ee6c4d] hover:bg-[#ee6c4d]/10 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            </div>

            {activity.opciones.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {activity.opciones.map((opt) => (
                  <span key={opt.id} className={`text-xs px-2 py-1 rounded-md ${opt.correcta ? "bg-[#2e9e5b]/10 text-[#2e9e5b]" : "bg-[#f7f4ec] text-[#123b2c]/50"}`}>
                    {opt.etiqueta}. {opt.texto} {opt.correcta ? "✓" : ""}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

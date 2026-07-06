import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  createActivity,
  deleteActivity,
  getAdminThemeSteps
} from "../features/admin/admin.api";
import { getActivityTypes } from "../features/catalog/catalog.api";
import { getThemeActivities } from "../features/themes/themes.api";
import { getMe } from "../features/profile/profile.api";

export const Route = createFileRoute("/admin/temas/$themeId/activities")({
  component: AdminThemeActivitiesPage
});

function AdminThemeActivitiesPage() {
  const { themeId } = Route.useParams();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [xpReward, setXpReward] = useState(10);
  const [selectedStepId, setSelectedStepId] = useState("");
  const [selectedActivityTypeId, setSelectedActivityTypeId] = useState("");
  const [feedback, setFeedback] = useState("");
  const [options, setOptions] = useState([
    { label: "A", text: "", isCorrect: false, sortOrder: 1 },
    { label: "B", text: "", isCorrect: false, sortOrder: 2 },
    { label: "C", text: "", isCorrect: false, sortOrder: 3 },
    { label: "D", text: "", isCorrect: false, sortOrder: 4 }
  ]);

  const meQuery = useQuery({ queryKey: ["me"], queryFn: getMe });

  const activitiesQuery = useQuery({
    queryKey: ["admin", "theme", themeId, "activities"],
    queryFn: () =>
      getThemeActivities(themeId, meQuery.data?.profile?.age_group_id ?? undefined),
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
      const quizType = activityTypesQuery.data?.find((t) => t.code === "quiz");
      if (!selectedStepId || !selectedActivityTypeId || !quizType) {
        throw new Error("Faltan campos requeridos");
      }
      return createActivity({
        themeId,
        stepId: selectedStepId,
        ageGroupId: meQuery.data?.profile?.age_group_id ?? "",
        activityTypeId: selectedActivityTypeId,
        title,
        prompt,
        feedback: feedback || undefined,
        sortOrder: (activitiesQuery.data?.length ?? 0) + 1,
        xpReward,
        difficulty: "easy",
        options
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "theme", themeId, "activities"] });
      setShowForm(false);
      setTitle("");
      setPrompt("");
      setXpReward(10);
      setFeedback("");
      setOptions([
        { label: "A", text: "", isCorrect: false, sortOrder: 1 },
        { label: "B", text: "", isCorrect: false, sortOrder: 2 },
        { label: "C", text: "", isCorrect: false, sortOrder: 3 },
        { label: "D", text: "", isCorrect: false, sortOrder: 4 }
      ]);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "theme", themeId, "activities"] });
    }
  });

  return (
    <main>
      <h1>Actividades del tema</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        style={{ padding: "8px 16px", background: "#2E9E5B", color: "white", border: "none", borderRadius: 8, cursor: "pointer", marginBottom: 16 }}
      >
        {showForm ? "Cancelar" : "+ Nueva actividad"}
      </button>

      {showForm && (
        <div style={{ display: "grid", gap: 12, maxWidth: 640, background: "white", padding: 16, borderRadius: 12, marginBottom: 24 }}>
          <h3>Nueva actividad (Quiz)</h3>

          <select value={selectedStepId} onChange={(e) => setSelectedStepId(e.target.value)} style={{ padding: 8 }}>
            <option value="">Paso CRECER</option>
            {stepsQuery.data?.map((s) => (
              <option key={s.id} value={s.id}>{s.step_type.name}</option>
            ))}
          </select>

          <select value={selectedActivityTypeId} onChange={(e) => setSelectedActivityTypeId(e.target.value)} style={{ padding: 8 }}>
            <option value="">Tipo de actividad</option>
            {activityTypesQuery.data?.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: 8 }} />
          <textarea placeholder="Pregunta" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} style={{ padding: 8 }} />
          <input placeholder="Retroalimentación" value={feedback} onChange={(e) => setFeedback(e.target.value)} style={{ padding: 8 }} />
          <input type="number" placeholder="XP" value={xpReward} onChange={(e) => setXpReward(Number(e.target.value))} style={{ padding: 8 }} />

          <fieldset>
            <legend>Opciones</legend>
            {options.map((opt, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <strong>{opt.label}.</strong>
                <input
                  placeholder="Texto"
                  value={opt.text}
                  onChange={(e) =>
                    setOptions(options.map((o, j) => (j === i ? { ...o, text: e.target.value } : o)))
                  }
                  style={{ flex: 1, padding: 6 }}
                />
                <label>
                  <input
                    type="radio"
                    name="correctOption"
                    checked={opt.isCorrect}
                    onChange={() =>
                      setOptions(options.map((o, j) => ({ ...o, isCorrect: j === i })))
                    }
                  />
                  Correcta
                </label>
              </div>
            ))}
          </fieldset>

          <button
            onClick={() => createMutation.mutate()}
            disabled={!selectedStepId || !title || !prompt || !selectedActivityTypeId}
            style={{
              padding: "10px 20px",
              background: selectedStepId && title && prompt && selectedActivityTypeId ? "#2E9E5B" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: selectedStepId && title && prompt && selectedActivityTypeId ? "pointer" : "not-allowed"
            }}
          >
            {createMutation.isPending ? "Creando..." : "Crear actividad"}
          </button>
        </div>
      )}

      <section style={{ display: "grid", gap: 12 }}>
        {activitiesQuery.data?.length === 0 && <p>No hay actividades aún.</p>}

        {activitiesQuery.data?.map((activity) => (
          <article key={activity.id} style={{ background: "white", padding: 16, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ margin: 0 }}>{activity.title}</h3>
                <p style={{ margin: "4px 0", color: "#666" }}>{activity.prompt}</p>
                <p style={{ fontSize: 13, color: "#999" }}>{activity.xp_reward} XP</p>
              </div>
              <button
                onClick={() => deleteMutation.mutate(activity.id)}
                style={{ background: "#EE6C4D", color: "white", border: "none", borderRadius: 8, padding: "4px 12px", cursor: "pointer", height: 32 }}
              >
                Eliminar
              </button>
            </div>

            {activity.options.length > 0 && (
              <div style={{ marginTop: 8, display: "grid", gap: 4 }}>
                {activity.options.map((opt) => (
                  <div key={opt.id} style={{ fontSize: 14, color: opt.is_correct ? "#2E9E5B" : "#666" }}>
                    {opt.label}. {opt.text} {opt.is_correct && "✓"}
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}

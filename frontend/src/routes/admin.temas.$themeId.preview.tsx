import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAdminTheme, getAdminThemeSteps } from "../features/admin/admin.api";
import { getThemeActivities } from "../features/themes/themes.api";
import { getMe } from "../features/profile/profile.api";

export const Route = createFileRoute("/admin/temas/$themeId/preview")({
  component: AdminThemePreviewPage
});

function AdminThemePreviewPage() {
  const { themeId } = Route.useParams();

  const meQuery = useQuery({ queryKey: ["me"], queryFn: getMe });

  const themeQuery = useQuery({
    queryKey: ["admin", "theme", themeId],
    queryFn: () => getAdminTheme(themeId)
  });

  const stepsQuery = useQuery({
    queryKey: ["admin", "theme", themeId, "steps"],
    queryFn: () => getAdminThemeSteps(themeId)
  });

  const activitiesQuery = useQuery({
    queryKey: ["admin", "theme", themeId, "activities"],
    queryFn: () =>
      getThemeActivities(themeId, meQuery.data?.profile?.age_group_id ?? undefined),
    enabled: !!meQuery.data
  });

  const theme = themeQuery.data;

  return (
    <main style={{ maxWidth: 720 }}>
      <h1>Vista previa: {theme?.title ?? "Cargando..."}</h1>
      <p style={{ color: "#666" }}>{theme?.summary}</p>
      <p><strong>Objetivo:</strong> {theme?.objective}</p>

      <h2>Recorrido CRECER</h2>
      {stepsQuery.data?.length === 0 && <p style={{ color: "#999" }}>Sin pasos CRECER aún.</p>}

      <section style={{ display: "grid", gap: 12 }}>
        {stepsQuery.data?.map((step) => (
          <article key={step.id} style={{ padding: 16, background: "white", borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <h3 style={{ margin: 0, color: step.step_type.color_hex ?? "#333" }}>
              {step.step_type.name}
            </h3>
            {step.contents?.map((content) => (
              <div key={content.id} style={{ marginTop: 8 }}>
                <p><strong>{content.title}</strong></p>
                <p style={{ color: "#555", whiteSpace: "pre-wrap" }}>{content.body}</p>
                {content.short_instruction && (
                  <p style={{ fontStyle: "italic", color: "#888" }}>{content.short_instruction}</p>
                )}
              </div>
            ))}
          </article>
        ))}
      </section>

      <h2 style={{ marginTop: 24 }}>Actividades</h2>
      {activitiesQuery.data?.length === 0 && <p style={{ color: "#999" }}>Sin actividades aún.</p>}

      <section style={{ display: "grid", gap: 12 }}>
        {activitiesQuery.data?.map((activity) => (
          <article key={activity.id} style={{ padding: 16, background: "white", borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <h3 style={{ margin: 0 }}>{activity.title}</h3>
            <p>{activity.prompt}</p>
            <p style={{ fontSize: 13, color: "#999" }}>{activity.xp_reward} XP</p>

            <div style={{ display: "grid", gap: 4, marginTop: 8 }}>
              {activity.options?.map((opt) => (
                <div key={opt.id} style={{ fontSize: 14, padding: "4px 8px", background: opt.is_correct ? "#e6f7ed" : "#f5f5f5", borderRadius: 6 }}>
                  {opt.label}. {opt.text} {opt.is_correct && "✓"}
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

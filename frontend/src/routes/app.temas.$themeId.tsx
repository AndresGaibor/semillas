import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getTheme, getThemeSteps, getThemeActivities } from "../features/themes/themes.api";
import { getMe } from "../features/profile/profile.api";

export const Route = createFileRoute("/app/temas/$themeId")({
  component: ThemeDetailPage
});

function ThemeDetailPage() {
  const { themeId } = Route.useParams();

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: getMe
  });

  const themeQuery = useQuery({
    queryKey: ["theme", themeId],
    queryFn: () => getTheme(themeId)
  });

  const stepsQuery = useQuery({
    queryKey: ["theme", themeId, "steps", meQuery.data?.profile?.age_group_id],
    queryFn: () => getThemeSteps(themeId, meQuery.data?.profile?.age_group_id ?? undefined),
    enabled: !!meQuery.data
  });

  const activitiesQuery = useQuery({
    queryKey: ["theme", themeId, "activities", meQuery.data?.profile?.age_group_id],
    queryFn: () =>
      getThemeActivities(themeId, meQuery.data?.profile?.age_group_id ?? undefined),
    enabled: !!meQuery.data
  });

  const firstActivity = activitiesQuery.data?.[0];

  return (
    <main>
      <h1>{themeQuery.data?.title}</h1>
      <p>{themeQuery.data?.summary}</p>

      <h2>Recorrido CRECER</h2>

      <section style={{ display: "grid", gap: 12 }}>
        {stepsQuery.data?.map((step) => (
          <article key={step.id} style={{ padding: 16, background: "white", borderRadius: 16 }}>
            <h3>{step.step_type.name}</h3>
            <p>{step.contents?.[0]?.short_instruction}</p>
          </article>
        ))}
      </section>

      {firstActivity && (
        <Link
          to="/app/actividades/$activityId"
          params={{ activityId: firstActivity.id }}
        >
          Iniciar actividad
        </Link>
      )}
    </main>
  );
}

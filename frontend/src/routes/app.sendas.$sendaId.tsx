import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getThemes } from "../features/themes/themes.api";

export const Route = createFileRoute("/app/sendas/$sendaId")({
  component: SendaDetailPage
});

function SendaDetailPage() {
  const { sendaId } = Route.useParams();

  const themesQuery = useQuery({
    queryKey: ["themes", { pathId: sendaId }],
    queryFn: () => getThemes({ pathId: sendaId })
  });

  return (
    <main>
      <h1>Temas de la senda</h1>

      {themesQuery.isLoading && <p>Cargando temas...</p>}

      <section style={{ display: "grid", gap: 16 }}>
        {themesQuery.data?.map((theme) => (
          <Link
            key={theme.id}
            to="/app/temas/$themeId"
            params={{ themeId: theme.id }}
            style={{
              padding: 24,
              borderRadius: 24,
              background: "white"
            }}
          >
            <h2>{theme.title}</h2>
            <p>{theme.summary}</p>
            <span>{theme.xp_reward} XP</span>
          </Link>
        ))}
      </section>
    </main>
  );
}

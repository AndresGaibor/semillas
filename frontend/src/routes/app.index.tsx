import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../features/profile/profile.api";
import { getMyGamification } from "../features/gamification/gamification.api";

export const Route = createFileRoute("/app/")({
  component: AppHomePage
});

function AppHomePage() {
  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: getMe
  });

  const gamificationQuery = useQuery({
    queryKey: ["gamification", "me"],
    queryFn: getMyGamification
  });

  return (
    <main>
      <h1>Hola, {meQuery.data?.profile?.nickname ?? "Semillero"}</h1>

      <p>Continúa creciendo en la Palabra de Dios.</p>

      <section style={{ display: "flex", gap: 16 }}>
        <article>
          <strong>XP</strong>
          <p>{gamificationQuery.data?.level?.xp_total ?? 0}</p>
        </article>

        <article>
          <strong>Nivel</strong>
          <p>{gamificationQuery.data?.level?.level_number ?? 1}</p>
        </article>
      </section>

      <Link to="/app/sendas">Explorar sendas</Link>
    </main>
  );
}

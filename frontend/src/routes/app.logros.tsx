import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMyGamification } from "../features/gamification/gamification.api";

export const Route = createFileRoute("/app/logros")({
  component: AchievementsPage
});

function AchievementsPage() {
  const query = useQuery({
    queryKey: ["gamification", "me"],
    queryFn: getMyGamification
  });

  return (
    <main>
      <h1>Mis logros</h1>
      <p>XP total: {query.data?.level?.xp_total ?? 0}</p>
      <p>Nivel: {query.data?.level?.level_number ?? 1}</p>
    </main>
  );
}

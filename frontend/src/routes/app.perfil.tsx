import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../features/profile/profile.api";

export const Route = createFileRoute("/app/perfil")({
  component: ProfilePage
});

function ProfilePage() {
  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: getMe
  });

  const profile = meQuery.data?.profile;

  return (
    <main>
      <h1>Mi perfil</h1>

      <section style={{ background: "white", padding: 24, borderRadius: 16 }}>
        <p><strong>Nombre:</strong> {profile?.nickname ?? "—"}</p>
        <p><strong>Franja de edad:</strong> {profile?.age_group_id ?? "—"}</p>
      </section>
    </main>
  );
}

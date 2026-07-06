import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "../features/admin/admin.api";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage
});

function AdminDashboardPage() {
  const query = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: getAdminDashboard
  });

  return (
    <main>
      <h1>Panel de administración</h1>

      <section style={{ display: "flex", gap: 16 }}>
        <article>
          <strong>Temas</strong>
          <p>{query.data?.themes ?? 0}</p>
        </article>
        <article>
          <strong>Publicados</strong>
          <p>{query.data?.published ?? 0}</p>
        </article>
        <article>
          <strong>Usuarios</strong>
          <p>{query.data?.users ?? 0}</p>
        </article>
        <article>
          <strong>Actividades</strong>
          <p>{query.data?.activities ?? 0}</p>
        </article>
      </section>
    </main>
  );
}

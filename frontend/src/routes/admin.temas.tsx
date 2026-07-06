import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { publishTheme, unpublishTheme } from "../features/admin/admin.api";
import { getThemes } from "../features/themes/themes.api";

export const Route = createFileRoute("/admin/temas")({
  component: AdminThemesPage
});

function AdminThemesPage() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin", "themes"],
    queryFn: () => getThemes()
  });

  const publishMutation = useMutation({
    mutationFn: publishTheme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "themes"] });
      queryClient.invalidateQueries({ queryKey: ["themes"] });
    }
  });

  const unpublishMutation = useMutation({
    mutationFn: unpublishTheme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "themes"] });
    }
  });

  return (
    <main>
      <h1>Gestión de temas</h1>
      <Link to="/admin/temas/new">+ Crear tema</Link>

      <section style={{ display: "grid", gap: 16, marginTop: 24 }}>
        {query.data?.map((theme) => (
          <article
            key={theme.id}
            style={{
              background: "white",
              padding: 16,
              borderRadius: 12,
              border: "1px solid #e5e7eb"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <h2 style={{ margin: 0 }}>{theme.title}</h2>
                <p style={{ margin: "4px 0", color: "#666" }}>
                  Estado: <strong>{theme.status}</strong> &middot; {theme.xp_reward} XP
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <Link
                to="/admin/temas/$themeId/edit"
                params={{ themeId: theme.id }}
                style={{ padding: "6px 12px", background: "#e5e7eb", borderRadius: 8, fontSize: 14 }}
              >
                Editar
              </Link>
              <Link
                to="/admin/temas/$themeId/crecer"
                params={{ themeId: theme.id }}
                style={{ padding: "6px 12px", background: "#e5e7eb", borderRadius: 8, fontSize: 14 }}
              >
                CRECER
              </Link>
              <Link
                to="/admin/temas/$themeId/activities"
                params={{ themeId: theme.id }}
                style={{ padding: "6px 12px", background: "#e5e7eb", borderRadius: 8, fontSize: 14 }}
              >
                Actividades
              </Link>
              <Link
                to="/admin/temas/$themeId/preview"
                params={{ themeId: theme.id }}
                style={{ padding: "6px 12px", background: "#e5e7eb", borderRadius: 8, fontSize: 14 }}
              >
                Vista previa
              </Link>

              {theme.status !== "published" ? (
                <button
                  onClick={() => publishMutation.mutate(theme.id)}
                  style={{ padding: "6px 12px", background: "#2E9E5B", color: "white", border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer" }}
                >
                  Publicar
                </button>
              ) : (
                <button
                  onClick={() => unpublishMutation.mutate(theme.id)}
                  style={{ padding: "6px 12px", background: "#EE6C4D", color: "white", border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer" }}
                >
                  Despublicar
                </button>
              )}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

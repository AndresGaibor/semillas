import { Link, Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { hasSession } from "../shared/api/auth-guard";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    if (!hasSession()) {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminLayout
});

function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 260, background: "#123B2C", color: "white", padding: 24 }}>
        <h2>Admin Semillas</h2>
        <nav style={{ display: "grid", gap: 12 }}>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/temas">Temas</Link>
          <Link to="/admin/temas/new">Nuevo tema</Link>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 32 }}>
        <Outlet />
      </main>
    </div>
  );
}

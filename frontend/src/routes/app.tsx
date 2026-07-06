import { Link, Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { hasSession } from "../shared/api/auth-guard";

export const Route = createFileRoute("/app")({
  beforeLoad: () => {
    if (!hasSession()) {
      throw redirect({ to: "/login" });
    }
  },
  component: AppLayout
});

function AppLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: 240,
          padding: 24,
          background: "white",
          borderRight: "1px solid #e5e7eb"
        }}
      >
        <h2>Semillas</h2>
        <nav style={{ display: "grid", gap: 12 }}>
          <Link to="/app">Inicio</Link>
          <Link to="/app/sendas">Sendas</Link>
          <Link to="/app/logros">Logros</Link>
          <Link to="/app/perfil">Perfil</Link>
        </nav>
      </aside>

      <section style={{ flex: 1, padding: 32 }}>
        <Outlet />
      </section>
    </div>
  );
}

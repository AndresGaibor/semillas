import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: LandingPage
});

function LandingPage() {
  return (
    <main style={{ padding: 32 }}>
      <h1>Semillas</h1>
      <p>Aprende de Dios de forma divertida.</p>

      <div style={{ display: "flex", gap: 12 }}>
        <Link to="/login">Iniciar</Link>
        <Link to="/app">Entrar a la app</Link>
      </div>
    </main>
  );
}

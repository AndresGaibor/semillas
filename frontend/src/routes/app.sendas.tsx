import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getSendas } from "../features/sendas/sendas.api";

export const Route = createFileRoute("/app/sendas")({
  component: SendasPage
});

function SendasPage() {
  const sendasQuery = useQuery({
    queryKey: ["sendas"],
    queryFn: getSendas
  });

  return (
    <main>
      <h1>Explora las sendas</h1>

      {sendasQuery.isLoading && <p>Cargando sendas...</p>}

      <section style={{ display: "grid", gap: 16 }}>
        {sendasQuery.data?.map((senda) => (
          <Link
            key={senda.id}
            to="/app/sendas/$sendaId"
            params={{ sendaId: senda.id }}
            style={{
              padding: 24,
              background: "white",
              borderRadius: 24,
              border: `2px solid ${senda.color_hex}`
            }}
          >
            <h2>{senda.name}</h2>
            <p>{senda.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}

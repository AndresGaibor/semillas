import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/ajustes")({
  component: AdminAjustesPage,
});

function AdminAjustesPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <i className="fa-solid fa-gear text-5xl text-green-950/20 mb-4" />
      <h2 className="text-xl font-bold text-green-950 mb-2">Ajustes</h2>
      <p className="text-sm text-green-950/40 max-w-md">
        Configura los parámetros generales de la plataforma.
      </p>
    </div>
  );
}

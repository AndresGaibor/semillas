import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/clubes")({
  component: AdminClubesPage,
});

function AdminClubesPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <i className="fa-solid fa-people-group text-5xl text-emerald-50/20 mb-4" />
      <h2 className="text-xl font-bold text-emerald-50 mb-2">Gestión de Clubes</h2>
      <p className="text-sm text-emerald-300/60 max-w-md">
        Administra los clubes, miembros y retos cooperativos.
      </p>
    </div>
  );
}

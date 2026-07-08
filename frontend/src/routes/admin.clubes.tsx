import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/clubes")({
  component: AdminClubesPage,
});

function AdminClubesPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <i className="fa-solid fa-people-group text-5xl text-[#123b2c]/20 mb-4" />
      <h2 className="text-xl font-bold text-[#123b2c] mb-2">Gestión de Clubes</h2>
      <p className="text-sm text-[#123b2c]/40 max-w-md">
        Administra los clubes, miembros y retos cooperativos.
      </p>
    </div>
  );
}

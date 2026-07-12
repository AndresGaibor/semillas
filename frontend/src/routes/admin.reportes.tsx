import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/reportes")({
  component: AdminReportesPage,
});

function AdminReportesPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <i className="fa-solid fa-chart-simple text-5xl text-emerald-50/20 mb-4" />
      <h2 className="text-xl font-bold text-emerald-50 mb-2">Reportes</h2>
      <p className="text-sm text-emerald-300/60 max-w-md">
        Visualiza reportes de contenido, progreso y actividad de usuarios.
      </p>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/sendas")({
  component: AdminSendasPage,
});

function AdminSendasPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <i className="fa-solid fa-route text-5xl text-emerald-400/20 mb-4" />
      <h2 className="text-xl font-bold text-emerald-200 mb-2">Gestión de Sendas</h2>
      <p className="text-sm text-emerald-400/40 max-w-md">
        Administra las sendas bíblicas: Padre, Hijo y Espíritu Santo.
      </p>
    </div>
  );
}

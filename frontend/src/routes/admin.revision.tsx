import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/revision")({
  component: AdminRevisionPage,
});

function AdminRevisionPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <i className="fa-solid fa-shield text-5xl text-[#123b2c]/20 mb-4" />
      <h2 className="text-xl font-bold text-[#123b2c] mb-2">Revisión de Contenido</h2>
      <p className="text-sm text-[#123b2c]/40 max-w-md">
        Revisa y aprueba el contenido pendiente antes de su publicación.
      </p>
    </div>
  );
}

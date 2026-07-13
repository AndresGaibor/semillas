import { EmptyState } from "@/componentes/ui/empty-state";

export function EstadoVacio() {
  return (
    <div className="py-16 text-center">
      <EmptyState mensaje="No hay usuarios registrados en la plataforma" className="py-0 font-bold text-slate-500 text-sm" />
    </div>
  );
}

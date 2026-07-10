import { Loader2 } from "lucide-react";

export function TemasLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Loader2 className="size-8 text-primario animate-spin" />
      <p className="text-sm font-semibold text-neutro">Cargando temas bíblicos...</p>
    </div>
  );
}

export function TemasErrorState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
      <svg className="size-12 text-red-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <h4 className="text-sm font-black text-slate-700 mb-1">Error al cargar temas</h4>
      <p className="text-xs text-slate-400 font-semibold max-w-[280px]">
        No pudimos obtener los temas. Revisa tu conexión e intenta de nuevo.
      </p>
    </div>
  );
}

export function TemasEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
      <svg className="size-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.121 2.121l2.121 2.121a1 1 0 001.415 0l2.121-2.121a1 1 0 000-1.415l-2.121-2.121a1 1 0 00-1.415 0L9.88 5.636a1 1 0 000 1.415l2.121 2.121z" />
      </svg>
      <h4 className="text-sm font-black text-slate-700 mb-1">No se encontraron temas</h4>
      <p className="text-xs text-slate-400 font-semibold max-w-[280px]">
        Intenta buscar con otros términos o cambia la pestaña seleccionada.
      </p>
    </div>
  );
}

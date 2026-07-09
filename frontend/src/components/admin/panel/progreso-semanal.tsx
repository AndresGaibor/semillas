import { ChevronDown } from "lucide-react";
import { PROGRESO_SEMANAL } from "./data";

export function ProgresoSemanal() {
  const max = Math.max(...PROGRESO_SEMANAL.map((item) => item.valor));

  return (
    <section className="min-w-0 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-slate-950">Progreso semanal</h3>
          <p className="mt-1 text-xs font-medium text-slate-500">Contenido publicado por semana</p>
        </div>
        <button type="button" className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-500">
          Esta semana <ChevronDown className="size-4" />
        </button>
      </div>
      <div className="mt-5 flex h-32 items-end justify-between gap-4 border-b border-slate-200 px-4">
        {PROGRESO_SEMANAL.map((item) => {
          const alto = (item.valor / max) * 100;
          return (
            <div key={item.dia} className="flex flex-1 flex-col items-center">
              <span className="mb-2 text-xs font-extrabold text-slate-700">{item.valor}</span>
              <div className="w-4 rounded-t-md bg-emerald-400" style={{ height: `${alto}%` }} />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between px-4 text-xs font-semibold text-slate-500">
        {PROGRESO_SEMANAL.map((item) => <span key={item.dia}>{item.dia}</span>)}
      </div>
    </section>
  );
}

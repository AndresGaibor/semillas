import { Trophy } from "lucide-react";
import type { GamificacionMiRespuesta } from "../profile.api";

type LogroItem = GamificacionMiRespuesta["logros"][number];

interface SeccionLogrosProps {
  logros: LogroItem[];
  totalActividades: number;
}

export function SeccionLogros({ logros, totalActividades }: SeccionLogrosProps) {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Progreso</p>
          <h2 className="mt-1 text-xl font-black text-slate-800">Logros recientes</h2>
        </div>
        <span className="text-sm font-bold text-slate-500">{totalActividades} actividades completadas</span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {logros.length > 0 ? (
          logros.slice(0, 4).map((item) => (
            <article key={item.logro_id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-white p-2 text-[#2E9E5B] shadow-sm ring-1 ring-slate-100">
                  <Trophy className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-slate-800">{item.logro?.nombre ?? "Logro desbloqueado"}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {item.logro?.descripcion ?? "Completa temas y actividades para seguir desbloqueando insignias."}
                  </p>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm font-medium leading-6 text-slate-500 md:col-span-2">
            Aún no tienes logros visibles. Completa temas y actividades para desbloquear tus primeras insignias.
          </div>
        )}
      </div>
    </section>
  );
}

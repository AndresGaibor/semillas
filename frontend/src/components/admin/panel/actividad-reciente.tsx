import type { ComponentType, SVGProps } from "react";
import { unirClases } from "@/lib/utilidades";
import { ACTIVIDAD_RECIENTE } from "./data";

export function ActividadReciente({ onVerTodaLaActividad }: { onVerTodaLaActividad: () => void }) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
      <h3 className="text-lg font-extrabold text-slate-950">Actividad reciente</h3>
      <div className="mt-4 space-y-3">
        {ACTIVIDAD_RECIENTE.map((actividad, index) => (
          <ItemActividad key={index} {...actividad} />
        ))}
      </div>
      <button type="button" onClick={onVerTodaLaActividad} className="mx-auto mt-5 block font-extrabold text-emerald-600 hover:text-emerald-700">
        Ver toda la actividad
      </button>
    </section>
  );
}

interface ActividadItemProps {
  icono: ComponentType<SVGProps<SVGSVGElement>>;
  fondo: string;
  colorIcono: string;
  texto: string;
  tiempo: string;
}

function ItemActividad({ icono: Icono, fondo, colorIcono, texto, tiempo }: ActividadItemProps) {
  return (
    <article className="flex min-w-0 items-start gap-4">
      <div className={unirClases("grid size-9 shrink-0 place-items-center rounded-full", fondo)}>
        <Icono className={unirClases("size-5", colorIcono)} />
      </div>
      <p className="min-w-0 flex-1 text-xs font-semibold leading-snug text-slate-700 sm:text-sm">{texto}</p>
      <span className="whitespace-nowrap text-xs font-medium text-slate-500">{tiempo}</span>
    </article>
  );
}

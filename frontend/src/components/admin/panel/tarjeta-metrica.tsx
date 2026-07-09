import type { ComponentType, SVGProps } from "react";
import { unirClases } from "@/lib/utilidades";

interface TarjetaMetricaProps {
  titulo: string;
  valor: string;
  cambio: string;
  icono: ComponentType<SVGProps<SVGSVGElement>>;
  colorIcono: string;
  fondoIcono: string;
  colorValor: string;
}

export function TarjetaMetrica({ titulo, valor, cambio, icono: Icono, colorIcono, fondoIcono, colorValor }: TarjetaMetricaProps) {
  return (
    <article className="min-w-0 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
      <div className="grid min-w-0 grid-cols-[74px_minmax(0,1fr)] items-center gap-4">
        <div className={unirClases("grid size-[74px] shrink-0 place-items-center rounded-full", fondoIcono)}>
          <Icono className={unirClases("size-9", colorIcono)} />
        </div>
        <div className="min-w-0">
          <p className="whitespace-nowrap text-xs font-extrabold leading-none tracking-tight text-slate-800 2xl:text-sm">{titulo}</p>
          <p className={unirClases("mt-1.5 text-3xl md:text-4xl font-black leading-none", colorValor)}>{valor}</p>
          <p className="mt-2 text-xs font-semibold leading-snug text-slate-500">
            <span className="font-extrabold text-emerald-600">↑</span> {cambio}
          </p>
        </div>
      </div>
    </article>
  );
}

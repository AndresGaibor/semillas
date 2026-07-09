import type { ComponentType, SVGProps } from "react";
import { unirClases } from "@/lib/utilidades";
import { CabeceraSeccion } from "@/componentes/ui/cabecera-seccion";
import { ESTADOS_CONTENIDO } from "./data";

export function EstadoContenido({ onVerTodo }: { onVerTodo: () => void }) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
      <CabeceraSeccion titulo="Estado del contenido" descripcion="Resumen general del estado de todo el contenido." textoBoton="Ver todo" onBotonClick={onVerTodo} />
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
        {ESTADOS_CONTENIDO.map((estado) => (
          <TarjetaEstadoContenido key={estado.titulo} {...estado} />
        ))}
      </div>
    </section>
  );
}

interface EstadoContenidoProps {
  titulo: string;
  valor: number;
  porcentaje: string;
  icono: ComponentType<SVGProps<SVGSVGElement>>;
  fondo: string;
  colorIcono: string;
  colorPunto: string;
}

function TarjetaEstadoContenido({ titulo, valor, porcentaje, icono: Icono, fondo, colorIcono, colorPunto }: EstadoContenidoProps) {
  return (
    <article className={unirClases("rounded-2xl p-4", fondo)}>
      <div className="flex items-center gap-3">
        <div className="grid size-12 shrink-0 place-items-center rounded-full bg-white/70">
          <Icono className={unirClases("size-6", colorIcono)} />
        </div>
        <div>
          <p className="text-2xl font-extrabold leading-none text-slate-900">{valor}</p>
          <p className="mt-1 text-xs font-semibold text-slate-700 sm:text-sm">{titulo}</p>
        </div>
      </div>
      <p className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-slate-700 sm:text-sm">
        <span className={unirClases("size-3 rounded-full", colorPunto)} />{porcentaje}
      </p>
    </article>
  );
}

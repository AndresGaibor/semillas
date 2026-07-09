import { useNavigate } from "@tanstack/react-router";
import type { ComponentType, SVGProps } from "react";
import { unirClases } from "@/lib/utilidades";
import { CabeceraSeccion } from "@/componentes/ui/cabecera-seccion";
import { ACCIONES_RAPIDAS } from "./data";

export function AccionesRapidas() {
  const navigate = useNavigate();

  return (
    <section className="min-w-0 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
      <CabeceraSeccion titulo="Acciones rápidas" descripcion="Crea, administra y revisa contenido fácilmente." />
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
        {ACCIONES_RAPIDAS.map((accion) => (
          <TarjetaAccionRapida key={accion.titulo} {...accion} onClick={() => navigate({ to: accion.to })} />
        ))}
      </div>
    </section>
  );
}

interface AccionRapidaProps {
  titulo: string;
  descripcion: string;
  icono: ComponentType<SVGProps<SVGSVGElement>>;
  fondo: string;
  colorIcono: string;
  colorTitulo: string;
  onClick: () => void;
}

function TarjetaAccionRapida({ titulo, descripcion, icono: Icono, fondo, colorIcono, colorTitulo, onClick }: AccionRapidaProps) {
  return (
    <button type="button" onClick={onClick} className={unirClases("flex items-center gap-3 rounded-2xl border border-slate-100 p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md", fondo)}>
      <div className="grid size-11 shrink-0 place-items-center rounded-full bg-white">
        <Icono className={unirClases("size-6", colorIcono)} />
      </div>
      <div>
        <h4 className={unirClases("text-xs font-extrabold sm:text-sm", colorTitulo)}>{titulo}</h4>
        <p className="mt-1 text-xs font-medium leading-snug text-slate-700">{descripcion}</p>
      </div>
    </button>
  );
}

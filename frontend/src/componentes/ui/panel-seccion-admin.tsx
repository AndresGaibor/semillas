import * as React from "react";

import { unirClases } from "@/lib/utilidades";

type PanelSeccionAdminProps = {
  titulo: React.ReactNode;
  descripcion?: React.ReactNode;
  accion?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contenidoClassName?: string;
};

export function PanelSeccionAdmin({
  titulo,
  descripcion,
  accion,
  footer,
  children,
  className,
  contenidoClassName,
}: PanelSeccionAdminProps) {
  return (
    <section
      className={unirClases(
        "rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]",
        className,
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[clamp(1.35rem,1.55vw,2rem)] font-black leading-none tracking-tight text-slate-900">
            {titulo}
          </h3>
          {descripcion ? <p className="mt-2 text-[13px] leading-snug text-slate-500">{descripcion}</p> : null}
        </div>
        {accion ? <div className="shrink-0 pt-1">{accion}</div> : null}
      </div>

      <div className={unirClases("min-w-0", contenidoClassName)}>{children}</div>

      {footer ? <div className="mt-4">{footer}</div> : null}
    </section>
  );
}

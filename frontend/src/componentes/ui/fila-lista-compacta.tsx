import * as React from "react";

import { unirClases } from "@/lib/utilidades";

export interface FilaListaCompactaProps extends React.HTMLAttributes<HTMLDivElement> {
  izquierda: React.ReactNode;
  titulo: React.ReactNode;
  subtitulo?: React.ReactNode;
  derecha?: React.ReactNode;
  onClick?: () => void;
  izquierdaClassName?: string;
  contenidoClassName?: string;
  derechaClassName?: string;
  clase?: string;
}

export function FilaListaCompacta({
  izquierda,
  titulo,
  subtitulo,
  derecha,
  onClick,
  izquierdaClassName,
  contenidoClassName,
  derechaClassName,
  className,
  clase,
  ...propiedades
}: FilaListaCompactaProps) {
  const clasesBase = unirClases(
    "flex items-center gap-3 rounded-2xl border border-slate-100/50 bg-slate-50/20 p-3 transition-colors select-none",
    onClick && "cursor-pointer hover:bg-slate-50/70",
    className,
    clase,
  );
  const propiedadesBoton = propiedades as unknown as React.ButtonHTMLAttributes<HTMLButtonElement>;
  const propiedadesDiv = propiedades as React.HTMLAttributes<HTMLDivElement>;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={clasesBase} {...propiedadesBoton}>
        <div className={unirClases("shrink-0", izquierdaClassName)}>{izquierda}</div>
        <div className={unirClases("min-w-0 flex-1 text-left", contenidoClassName)}>
          <span className="block text-[12.8px] font-extrabold text-neutro-oscuro-max truncate leading-tight">
            {titulo}
          </span>
          {subtitulo ? (
            <span className="mt-0.5 block truncate text-[10px] leading-tight text-neutro">{subtitulo}</span>
          ) : null}
        </div>
        {derecha ? <div className={unirClases("shrink-0", derechaClassName)}>{derecha}</div> : null}
      </button>
    );
  }

  return (
    <div className={clasesBase} {...propiedadesDiv}>
      <div className={unirClases("shrink-0", izquierdaClassName)}>{izquierda}</div>
      <div className={unirClases("min-w-0 flex-1 text-left", contenidoClassName)}>
        <span className="block text-[12.8px] font-extrabold text-neutro-oscuro-max truncate leading-tight">
          {titulo}
        </span>
        {subtitulo ? (
          <span className="mt-0.5 block truncate text-[10px] leading-tight text-neutro">{subtitulo}</span>
        ) : null}
      </div>
      {derecha ? <div className={unirClases("shrink-0", derechaClassName)}>{derecha}</div> : null}
    </div>
  );
}

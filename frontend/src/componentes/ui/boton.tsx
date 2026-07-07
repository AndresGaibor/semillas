import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { unirClases } from "@/lib/utilidades";

const variantesBoton = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-bold leading-none select-none whitespace-nowrap",
    "transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    "active:scale-[0.98]",
  ],
  {
    variants: {
      variante: {
        primario: [
          "bg-[#6C3AED] text-white",
          "shadow-[0_2px_8px_rgba(108,58,237,0.20)]",
          "hover:bg-[#5B30C8]",
          "active:bg-[#3B1FA3]",
          "focus-visible:ring-violet-500",
          "disabled:bg-violet-200 disabled:text-violet-300 disabled:shadow-none",
        ],
        exito: [
          "bg-[#16A34A] text-white",
          "shadow-[0_2px_8px_rgba(22,163,74,0.18)]",
          "hover:bg-[#15803D]",
          "active:bg-[#14532D]",
          "focus-visible:ring-green-500",
          "disabled:bg-green-100 disabled:text-green-400 disabled:shadow-none",
        ],
        secundario: [
          "bg-violet-50 text-violet-700",
          "hover:bg-violet-100",
          "active:bg-violet-200",
          "focus-visible:ring-violet-400",
          "disabled:bg-slate-50 disabled:text-slate-300",
        ],
        contorno: [
          "border border-violet-500 bg-white text-violet-700",
          "hover:bg-violet-50",
          "active:bg-violet-100",
          "focus-visible:ring-violet-500",
          "disabled:border-slate-300 disabled:bg-white disabled:text-slate-300",
        ],
        texto: [
          "bg-transparent text-violet-700 shadow-none",
          "hover:bg-violet-50 hover:text-violet-900",
          "active:bg-violet-100",
          "focus-visible:ring-violet-400",
          "disabled:bg-transparent disabled:text-slate-300",
        ],
        peligro: [
          "bg-gradient-to-br from-red-500 to-red-600 text-white",
          "shadow-[0_4px_10px_rgba(239,68,68,0.16)]",
          "hover:from-red-600 hover:to-red-700",
          "active:from-red-700 active:to-red-900",
          "focus-visible:ring-red-500",
          "disabled:bg-none disabled:bg-red-100 disabled:text-red-500 disabled:shadow-none",
        ],
        peligroContorno: [
          "border border-red-400 bg-white text-red-500",
          "hover:bg-red-50",
          "active:bg-red-100",
          "focus-visible:ring-red-500",
          "disabled:border-red-100 disabled:bg-red-50 disabled:text-red-300",
        ],
      },
      tamano: {
        grande: "h-14 px-7 text-base rounded-2xl",
        mediano: "h-11 px-5 text-sm rounded-xl",
        pequeno: "h-9 px-4 text-xs rounded-lg",
        icono: "h-11 w-11 p-0 rounded-xl",
        iconoPequeno: "h-9 w-9 p-0 rounded-lg",
      },
      forma: {
        normal: "",
        pildora: "rounded-full",
        cuadrado: "rounded-xl",
      },
      anchoCompleto: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variante: "primario",
      tamano: "mediano",
      forma: "normal",
      anchoCompleto: false,
    },
  },
);

export type VarianteBoton =
  | "primario"
  | "exito"
  | "secundario"
  | "contorno"
  | "texto"
  | "peligro"
  | "peligroContorno";

export type TamanoBoton =
  | "grande"
  | "mediano"
  | "pequeno"
  | "icono"
  | "iconoPequeno";

export type FormaBoton = "normal" | "pildora" | "cuadrado";

export type EstadoVisualBoton = "normal" | "encima" | "presionado";

const clasesEstadoVisual: Record<
  VarianteBoton,
  Partial<Record<EstadoVisualBoton, string>>
> = {
  primario: {
    encima: "!bg-[#5B30C8]",
    presionado: "!bg-[#3B1FA3] scale-[0.98]",
  },
  exito: {
    encima: "!bg-[#15803D]",
    presionado: "!bg-[#14532D] scale-[0.98]",
  },
  secundario: {
    encima: "!bg-violet-100",
    presionado: "!bg-violet-200 scale-[0.98]",
  },
  contorno: {
    encima: "!bg-violet-50",
    presionado: "!bg-violet-100 scale-[0.98]",
  },
  texto: {
    encima: "!bg-violet-50 !text-violet-900",
    presionado: "!bg-violet-100 scale-[0.98]",
  },
  peligro: {
    encima: "!from-red-600 !to-red-700",
    presionado: "!from-red-700 !to-red-900 scale-[0.98]",
  },
  peligroContorno: {
    encima: "!bg-red-50",
    presionado: "!bg-red-100 scale-[0.98]",
  },
};

export interface PropiedadesBoton
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">,
    Omit<VariantProps<typeof variantesBoton>, "variante" | "tamano" | "forma"> {
  variante?: VarianteBoton;
  tamano?: TamanoBoton;
  forma?: FormaBoton;
  iconoIzquierdo?: React.ReactNode;
  iconoDerecho?: React.ReactNode;
  cargando?: boolean;
  textoCargando?: string;
  deshabilitado?: boolean;
  disabled?: boolean;
  estadoVisual?: EstadoVisualBoton;
  clase?: string;
}

export const Boton = React.forwardRef<HTMLButtonElement, PropiedadesBoton>(
  (
    {
      variante = "primario",
      tamano = "mediano",
      forma = "normal",
      anchoCompleto = false,
      iconoIzquierdo,
      iconoDerecho,
      cargando = false,
      textoCargando,
      deshabilitado = false,
      disabled = false,
      estadoVisual = "normal",
      clase,
      className,
      children,
      type = "button",
      ...propiedades
    },
    referencia,
  ) => {
    const estaDeshabilitado = disabled || deshabilitado || cargando;

    const claseEstadoVisual =
      estadoVisual === "normal" ? "" : clasesEstadoVisual[variante]?.[estadoVisual];

    return (
      <button
        ref={referencia}
        type={type}
        disabled={estaDeshabilitado}
        aria-busy={cargando || undefined}
        className={unirClases(
          variantesBoton({ variante, tamano, forma, anchoCompleto }),
          claseEstadoVisual,
          className,
          clase,
        )}
        {...propiedades}
      >
        {cargando ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          iconoIzquierdo && <span className="inline-flex shrink-0">{iconoIzquierdo}</span>
        )}

        {children && (
          <span>{cargando && textoCargando ? textoCargando : children}</span>
        )}

        {!cargando && iconoDerecho && (
          <span className="inline-flex shrink-0">{iconoDerecho}</span>
        )}
      </button>
    );
  },
);

Boton.displayName = "Boton";

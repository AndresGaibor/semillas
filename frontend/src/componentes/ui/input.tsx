import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircle2, Eye, EyeOff, XCircle } from "lucide-react";

import { unirClases } from "@/lib/utilidades";

// ── Variantes base del input ─────────────────────────────────────────────────

const variantesInput = cva(
  [
    "w-full rounded-xl border bg-white text-sm font-medium",
    "text-gray-900 placeholder:text-gray-400 placeholder:font-normal",
    "transition-all duration-150 ease-out",
    "focus:outline-none",
    "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200",
  ],
  {
    variants: {
      estado: {
        default: [
          "border-gray-200",
          "focus:border-[#6C3AED] focus:ring-2 focus:ring-[#6C3AED]/15",
        ],
        error: [
          "border-red-400 bg-red-50/30",
          "focus:border-red-500 focus:ring-2 focus:ring-red-500/15",
        ],
        exito: [
          "border-[#16A34A]",
          "focus:border-[#16A34A] focus:ring-2 focus:ring-green-500/15",
        ],
      },
      tamano: {
        mediano: "h-11 px-4 text-sm",
      },
      conIconoIzquierdo: {
        true: "pl-11",
        false: "",
      },
      conIconoDerecho: {
        true: "pr-11",
        false: "",
      },
    },
    defaultVariants: {
      estado: "default",
      tamano: "mediano",
      conIconoIzquierdo: false,
      conIconoDerecho: false,
    },
  },
);

// ── Tipos ────────────────────────────────────────────────────────────────────

export type EstadoInput = "default" | "error" | "exito";

export interface PropiedadesInput
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  estado?: EstadoInput;
  iconoIzquierdo?: React.ReactNode;
  iconoDerecho?: React.ReactNode;
  mensajeError?: string;
  mensajeExito?: string;
  clase?: string;
}

// ── Componente Input ─────────────────────────────────────────────────────────

export const Input = React.forwardRef<HTMLInputElement, PropiedadesInput>(
  (
    {
      estado = "default",
      iconoIzquierdo,
      iconoDerecho,
      mensajeError,
      mensajeExito,
      clase,
      className,
      disabled,
      ...propiedades
    },
    referencia,
  ) => {
    const tieneIconoIzq = Boolean(iconoIzquierdo);
    const tieneIconoDer = Boolean(iconoDerecho) || estado === "exito" || estado === "error";

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="relative">
          {/* Ícono izquierdo */}
          {iconoIzquierdo && (
            <span
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              aria-hidden="true"
            >
              {iconoIzquierdo}
            </span>
          )}

          <input
            ref={referencia}
            disabled={disabled}
            className={unirClases(
              variantesInput({
                estado,
                tamano: "mediano",
                conIconoIzquierdo: tieneIconoIzq,
                conIconoDerecho: tieneIconoDer,
              }),
              className,
              clase,
            )}
            aria-invalid={estado === "error" ? true : undefined}
            {...propiedades}
          />

          {/* Ícono derecho — personalizado o estado */}
          {(iconoDerecho || estado === "exito" || estado === "error") && (
            <span
              className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            >
              {iconoDerecho ??
                (estado === "exito" ? (
                  <CheckCircle2 className="size-4 text-[#16A34A]" />
                ) : (
                  <XCircle className="size-4 text-red-500" />
                ))}
            </span>
          )}
        </div>

        {/* Mensajes */}
        {estado === "error" && mensajeError && (
          <p className="text-xs text-red-500 font-medium">{mensajeError}</p>
        )}
        {estado === "exito" && mensajeExito && (
          <p className="text-xs text-[#16A34A] font-medium">{mensajeExito}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

// ── Input de contraseña ──────────────────────────────────────────────────────

export interface PropiedadesInputContraseña extends Omit<PropiedadesInput, "type"> {
  mostrarBotonVer?: boolean;
}

export const InputContraseña = React.forwardRef<HTMLInputElement, PropiedadesInputContraseña>(
  ({ mostrarBotonVer = true, clase, className, ...propiedades }, referencia) => {
    const [visible, setVisible] = React.useState(false);

    return (
      <div className="relative w-full">
        <Input
          ref={referencia}
          type={visible ? "text" : "password"}
          iconoDerecho={
            mostrarBotonVer ? (
              <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                className="text-gray-400 hover:text-gray-600 pointer-events-auto transition-colors"
                aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            ) : undefined
          }
          clase={clase}
          className={className}
          {...propiedades}
        />
      </div>
    );
  },
);

InputContraseña.displayName = "InputContraseña";

// ── Input de búsqueda ────────────────────────────────────────────────────────

export interface PropiedadesInputBusqueda extends Omit<PropiedadesInput, "iconoIzquierdo"> {
  iconoBusqueda?: React.ReactNode;
}

export const InputBusqueda = React.forwardRef<HTMLInputElement, PropiedadesInputBusqueda>(
  ({ iconoBusqueda, ...propiedades }, referencia) => {
    return (
      <Input
        ref={referencia}
        type="search"
        iconoIzquierdo={
          iconoBusqueda ?? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          )
        }
        {...propiedades}
      />
    );
  },
);

InputBusqueda.displayName = "InputBusqueda";
